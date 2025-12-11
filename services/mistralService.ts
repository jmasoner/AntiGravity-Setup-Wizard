import { UserProfile, ProjectConfig, GeneratorMode, GeneratedContent, ArchitectState } from '../types';

const MISTRAL_API_KEY = import.meta.env.VITE_MISTRAL_API_KEY;
const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';

export type MistralModel = 'codestral-latest' | 'mistral-large-latest';

const getSystemInstruction = (mode: GeneratorMode): string => {
    switch (mode) {
        case GeneratorMode.SETUP_GUIDE:
            return "You are a Senior DevOps Engineer specializing in Windows and Cloud environments. Your goal is to provide clear, step-by-step instructions for setting up a development environment called 'AntiGravity'. Focus on PowerShell, Windows Terminal, and API configuration.";
        case GeneratorMode.DRIVE_MAPPING:
            return "You are an IT Support Specialist. Explain clearly how to install Google Drive for Desktop and Windows mapping.";
        case GeneratorMode.PROJECT_SCAFFOLD:
            return "You are a Build Engineer. Generate PowerShell scripts to create directory structures and git repos.";
        case GeneratorMode.README_GEN:
            return "You are a Technical Writer. Create professional README.md files.";
        case GeneratorMode.ARCHITECT_INTERVIEW:
            return "You are an Enterprise Solutions Architect and CTO. Your goal is to interview the user to deeply understand their project requirements. Do not just ask for the name. Dig deep into Scale, Architecture (Monolith vs Microservices), Tech Constraints, and Long-term goals. Be conversational. Ask 1-2 focused questions at a time.";
        case GeneratorMode.ARCHITECT_BLUEPRINT:
            return "You are a CTO. Based on the interview, define the architecture. Output valid JSON only describing the 'blueprint'.";
        case GeneratorMode.ARCHITECT_FABRICATE:
            return "You are a Senior Systems Engineer. You are responsible for creating the 'Mission Files' for the project. IMPORTANT: You must output scripts in code blocks. The FIRST LINE of every code block MUST be a comment with the filename, e.g., '# FILENAME: script_name.ps1'. This is required for the system to save the files.";
        default:
            return "You are a helpful AI assistant.";
    }
};

const buildPrompt = (
    mode: GeneratorMode,
    profile: UserProfile,
    project?: ProjectConfig,
    architectState?: ArchitectState
): string => {
    let prompt = "";

    if (mode === GeneratorMode.DRIVE_MAPPING) {
        prompt = `
      John Masoner needs to map his Google Drive to his Windows computers.
      
      Please provide a step-by-step guide to:
      1. Downloading and Installing "Google Drive for Desktop".
      2. Logging in with ${profile.username}.
      3. Configuring it to mount as a local drive letter (usually G:).
      4. Ensuring files are set to 'Stream files'.
    `;
    } else if (mode === GeneratorMode.SETUP_GUIDE) {
        prompt = `
      Create a master setup guide for the "AntiGravity" development environment.
      User: ${profile.name}
      Paths:
      - OneDrive: ${profile.oneDrivePath}
      - Google Drive: ${profile.googleDrivePath}
      - GitHub Local: ${profile.githubPath}
      
      Include setup for development tools, API keys, and folder structures.
    `;
    } else if (mode === GeneratorMode.README_GEN && project) {
        prompt = `
      Create a professional README.md for project "${project.projectName}".
      Description: ${project.description}
      Tools: ${project.tools.join(', ')}
      
      Lead Developer: ${profile.name}
      Contact: ${profile.email}
    `;
    } else if (mode === GeneratorMode.ARCHITECT_INTERVIEW && architectState) {
        const historyText = architectState.chatHistory
            .map(msg => `${msg.role.toUpperCase()}: ${msg.content}`)
            .join('\n\n');

        prompt = `
      Conversation History:
      ${historyText}

      User's Idea: "${architectState.rawIdea}"

      Ask clarifying questions about the project.
    `;
    } else if (mode === GeneratorMode.ARCHITECT_BLUEPRINT && architectState) {
        const historyText = architectState.chatHistory
            .map(msg => `${msg.role.toUpperCase()}: ${msg.content}`)
            .join('\n\n');

        prompt = `
      Project Discussion:
      ${historyText}

      Create a Project Blueprint in JSON format.
    `;
    } else if (mode === GeneratorMode.ARCHITECT_FABRICATE && architectState && architectState.blueprint) {
        const bp = architectState.blueprint;
        prompt = `Generate mission files for: ${bp.name}`;
    }

    return prompt;
};

export const generateContentWithMistral = async (
    mode: GeneratorMode,
    profile: UserProfile,
    model: MistralModel = 'codestral-latest',
    project?: ProjectConfig,
    architectState?: ArchitectState
): Promise<GeneratedContent> => {
    if (!MISTRAL_API_KEY) {
        return {
            markdown: '### Error\n\nMistral API key not configured. Please set VITE_MISTRAL_API_KEY in your .env file.\n\nGet your key at: https://console.mistral.ai/',
        };
    }

    const systemInstruction = getSystemInstruction(mode);
    const prompt = buildPrompt(mode, profile, project, architectState);

    try {
        const response = await fetch(MISTRAL_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${MISTRAL_API_KEY}`,
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    {
                        role: 'system',
                        content: systemInstruction,
                    },
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
                temperature: 0.7,
                max_tokens: 4096,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Mistral API Error: ${errorData.message || response.statusText}`);
        }

        const data = await response.json();
        const text = data.choices[0]?.message?.content || '';

        if (mode === GeneratorMode.ARCHITECT_BLUEPRINT) {
            return { markdown: text };
        }

        const scripts: { filename: string; content: string; language: string }[] = [];
        const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
        let match;

        while ((match = codeBlockRegex.exec(text)) !== null) {
            const lang = match[1] || 'text';
            const content = match[2].trim();
            const firstLine = content.split('\n')[0].trim();
            let filename = '';

            if (firstLine.includes('FILENAME:')) {
                const parts = firstLine.split('FILENAME:');
                if (parts.length > 1) {
                    filename = parts[1].trim().replace('-->', '').trim();
                }
            }

            if (filename) {
                scripts.push({ filename, content, language: lang });
            }
        }

        return {
            markdown: text,
            scripts: scripts.length > 0 ? scripts : undefined,
        };
    } catch (error) {
        console.error('Mistral API Error:', error);
        return {
            markdown: `### Error\n\n${(error as Error).message}`,
        };
    }
};
