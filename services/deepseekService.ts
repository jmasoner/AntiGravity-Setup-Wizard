import { UserProfile, ProjectConfig, GeneratorMode, GeneratedContent, ArchitectState } from '../types';

const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

export type DeepSeekModel = 'deepseek-coder' | 'deepseek-chat';

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
      Currently, he does not have it mapped.
      
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
      
      Goal: 
      1. Create a "MyProjects" folder in all three locations.
      2. Explain how to set up Gemini CLI and Claude CLI globally.
      3. Explain how to manage API keys safely.
      4. Include a specific section on "Bootstrapping this Tool":
         - Instructions for initializing the git repo for "AntiGravity Setup Wizard" at ${profile.githubPath}\\AntiGravity-Setup-Wizard.
         - Instructions must include running 'gh auth setup-git' to avoid permission errors.
         - How to use 'gh repo create' to push it to GitHub.
      
      BONUS:
      At the end, provide a single copy-pasteable PowerShell block.
      FIRST LINE: # FILENAME: bootstrap_antigravity.ps1
      The script must:
      1. Checks if the AntiGravity directory exists.
      2. Initializes git.
      3. Creates a .gitignore (node_modules, .env).
      4. Runs 'gh auth setup-git'.
      5. Creates the repo and pushes.
    `;
    } else if (mode === GeneratorMode.README_GEN && project) {
        prompt = `
      Create a professional README.md for project "${project.projectName}".
      Description: ${project.description}
      Tools: ${project.tools.join(', ')}
      
      Header Info:
      Project: ${project.projectName}
      Lead Developer: ${profile.name}
      Contact: ${profile.email} | ${profile.phoneCell}
      Office: ${profile.phoneDesk} | ${profile.address}
    `;
    } else if (mode === GeneratorMode.ARCHITECT_INTERVIEW && architectState) {
        const historyText = architectState.chatHistory
            .map(msg => `${msg.role.toUpperCase()}: ${msg.content}`)
            .join('\n\n');

        prompt = `
      Current Conversation History:
      ${historyText}

      User's Latest Idea/Input: "${architectState.rawIdea}" (or see history)

      Task:
      Review the conversation. 
      If this is the start, ask clarifying questions about Scale, Architecture, and Tech.
      If the user has answered, analyze their answers.
      - Did they miss anything critical?
      - Do you need to clarify "Modular" vs "Flat"?
      - Ask 1-2 follow-up questions to build a complete picture.
      
      Keep it professional but conversational. Do not output JSON yet.
    `;
    } else if (mode === GeneratorMode.ARCHITECT_BLUEPRINT && architectState) {
        const historyText = architectState.chatHistory
            .map(msg => `${msg.role.toUpperCase()}: ${msg.content}`)
            .join('\n\n');

        prompt = `
      Full Project Discussion:
      ${historyText}

      Based on this deep dive, create a Project Blueprint.
      Output ONLY valid JSON matching this structure:
      {
        "name": "ProjectName (CamelCase)",
        "architectureType": "MODULAR" or "FLAT",
        "description": "Refined technical description",
        "phases": ["Phase 1: ...", "Phase 2: ..."],
        "techStack": ["Tool 1", "Tool 2"],
        "folderStructure": "Text based tree diagram",
        "rationale": "Why you chose this architecture"
      }
    `;
    } else if (mode === GeneratorMode.ARCHITECT_FABRICATE && architectState && architectState.blueprint) {
        const bp = architectState.blueprint;
        const hostingInfo = profile.hostingHostname
            ? `Hosting Host: ${profile.hostingHostname}, User: ${profile.hostingUsername}, Key: ${profile.sshKeyPath}`
            : "No external hosting configured.";

        prompt = `
      PROJECT BLUEPRINT:
      Name: ${bp.name}
      Type: ${bp.architectureType}
      Stack: ${bp.techStack.join(', ')}
      Phases: ${bp.phases.join('; ')}
      Structure:
      ${bp.folderStructure}

      USER PROFILE:
      Name: ${profile.name}
      Email: ${profile.email}
      Phone: ${profile.phoneCell}
      OneDrive: ${profile.oneDrivePath}
      GoogleDrive: ${profile.googleDrivePath}
      GitHub Repo Root: ${profile.githubPath}
      
      HOSTING CONFIG:
      ${hostingInfo}

      TASK:
      Generate 3 distinct files. Use markdown code blocks.
      IMPORTANT: You MUST start the content of each code block with a comment line identifying the filename.

      FILE 1: CONTEXT.md
      FILE 2: init_${bp.name.toLowerCase()}.ps1 (The Ignition Script)
      FILE 3: resume_${bp.name.toLowerCase()}.ps1 (The Orbit Script)
    `;
    }

    return prompt;
};

export const generateContentWithDeepSeek = async (
    mode: GeneratorMode,
    profile: UserProfile,
    model: DeepSeekModel = 'deepseek-coder',
    project?: ProjectConfig,
    architectState?: ArchitectState
): Promise<GeneratedContent> => {
    if (!DEEPSEEK_API_KEY) {
        return {
            markdown: '### Error\n\nDeepSeek API key not configured. Please set VITE_DEEPSEEK_API_KEY in your .env file.',
        };
    }

    const systemInstruction = getSystemInstruction(mode);
    const prompt = buildPrompt(mode, profile, project, architectState);

    try {
        const response = await fetch(DEEPSEEK_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
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
            throw new Error(`DeepSeek API Error: ${errorData.error?.message || response.statusText}`);
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
        console.error('DeepSeek API Error:', error);
        return {
            markdown: `### Error\n\n${(error as Error).message}`,
        };
    }
};
