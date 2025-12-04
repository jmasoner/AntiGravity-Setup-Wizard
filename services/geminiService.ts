import { GoogleGenAI } from "@google/genai";
import { UserProfile, ProjectConfig, GeneratorMode, GeneratedContent, ArchitectState } from '../types';

const getSystemInstruction = (mode: GeneratorMode): string => {
  switch (mode) {
    case GeneratorMode.SETUP_GUIDE:
      return "You are a Senior DevOps Engineer specializing in Windows and Cloud environments. Your goal is to provide clear, step-by-step instructions for setting up a development environment called 'AntiGravity'. Focus on PowerShell, Windows Terminal, and API configuration.";
    case GeneratorMode.DRIVE_MAPPING:
      return "You are an IT Support Specialist. Explain clearly how to install Google Drive for Desktop on Windows and verify the drive letter mapping.";
    case GeneratorMode.PROJECT_SCAFFOLD:
      return "You are a Build Engineer. Generate PowerShell scripts to create directory structures, initialize git, and create default config files.";
    case GeneratorMode.README_GEN:
      return "You are a Technical Writer. Create professional README.md files including contact info and project scope.";
    case GeneratorMode.ARCHITECT_INTERVIEW:
      return "You are an Enterprise Solutions Architect and CTO. Your goal is to interview the user to deeply understand their project requirements. Do not just ask for the name. Ask about: 1. Scale (POC vs Enterprise). 2. Architecture (Monolith vs Microservices/Modular). 3. Specific Tech Constraints. Your tone should be professional, insightful, and guiding.";
    case GeneratorMode.ARCHITECT_BLUEPRINT:
      return "You are a CTO. Based on the interview, define the architecture. Output valid JSON only describing the 'blueprint' with fields: name, architectureType (MODULAR|FLAT), description, phases (array of strings), techStack (array of strings), folderStructure (string representation of tree), rationale.";
    case GeneratorMode.ARCHITECT_FABRICATE:
      return "You are a Senior Systems Engineer. You are responsible for creating the 'Mission Files' for the project. You must generate: 1. A CONTEXT.md file (The Brains) which acts as a seed prompt for AI agents. 2. An 'init' PowerShell script (The Builder) that physically builds the scaffold. 3. A 'resume' PowerShell script (The Daily Driver) that launches a multi-tabbed Windows Terminal environment for immediate productivity.";
    default:
      return "You are a helpful AI assistant.";
  }
};

export const generateContent = async (
  mode: GeneratorMode,
  profile: UserProfile,
  project?: ProjectConfig,
  architectState?: ArchitectState
): Promise<GeneratedContent> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  let prompt = "";
  let isJsonMode = false;

  // --- STANDARD MODES ---
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
         - How to use 'gh repo create' to push it to GitHub.
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
  }

  // --- ARCHITECT MODES ---
  
  else if (mode === GeneratorMode.ARCHITECT_INTERVIEW && architectState) {
    prompt = `
      User's Initial Idea: "${architectState.rawIdea}"

      Analyze this idea as a CTO.
      1. Briefly restate the goal to confirm understanding.
      2. Ask 3-4 critical architectural questions. 
         - Help the user decide: Is this a "Flat" app (Simple, fast) or "Modular" (Scalable, complex)?
         - Ask about specific data needs or integrations.
         - Ask about the intended lifespan (Prototype or Enterprise System?).
      
      Format your response as a conversation starter. Do not use JSON.
    `;
  }

  else if (mode === GeneratorMode.ARCHITECT_BLUEPRINT && architectState) {
    isJsonMode = true;
    const interviewText = architectState.interviewQandA.map(qa => `Q: ${qa.question}\nA: ${qa.answer}`).join('\n');
    prompt = `
      User's Idea: "${architectState.rawIdea}"
      
      Interview Results:
      ${interviewText}

      Based on this, create a Project Blueprint.
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
  }

  else if (mode === GeneratorMode.ARCHITECT_FABRICATE && architectState && architectState.blueprint) {
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

      CRITICAL PATH LOGIC:
      - The user may have 'OneDrive\\MyProjects' and 'GitHub Repo Root' pointed to the same folder.
      - In your generated PowerShell script, verify paths before creating them. If they are the same, treat the OneDrive folder as the Master Git Repo.
      - If they are different, assume the user wants a Git Repo in one place and a synced backup in OneDrive.

      FILE 1: CONTEXT.md
      - This file acts as the "Long Term Memory" for AI agents.
      - Include the project goals, architecture, tech stack, and phases.
      - Include the User's contact info.
      - Include a "Master Prompt" section that tells an AI agent how to start working on Phase 1.
      - Use clear Markdown headers.

      FILE 2: init_${bp.name.toLowerCase()}.ps1 (The Ignition Script)
      - Create the project directories. Handle the path logic described above.
      - Initialize git ('git init').
      - Write the CONTEXT.md file to the root.
      - Create a .env.example.
      - Create a README.md (use the user's contact details).
      - ENTERPRISE GIT: Check for 'gh' CLI. If installed, run 'gh repo create ${bp.name} --public --source=. --remote=origin' and 'git push -u origin main'.
      - Output "Ignition Complete" at the end.

      FILE 3: resume_${bp.name.toLowerCase()}.ps1 (The Orbit Script)
      - This script is for daily use.
      - 1. Check if project paths exist.
      - 2. Navigate to the project root and run 'git fetch' (silently).
      - 3. Launch Windows Terminal (wt.exe) with a unified dashboard.
           Use the following wt command structure (adjust paths as needed):
           wt -w 0 new-tab -p "Windows PowerShell" -d "PROJECT_ROOT" -t "Mission Control" ; split-pane -p "Windows PowerShell" -H -d "PROJECT_ROOT" ; new-tab -p "Windows PowerShell" -d "PROJECT_ROOT" -t "AI Agents" cmd /k "echo Launching Claude... & claude" ; split-pane -V cmd /k "echo Launching Gemini... & gemini" 
      - 4. If Hosting info is provided, add another tab to the wt command that attempts to SSH: ssh -i ${profile.sshKeyPath} ${profile.hostingUsername}@${profile.hostingHostname}
           (If WebDisk is preferred, attempt to mount the drive first using net use).
      - 5. Read the content of CONTEXT.md and copy it to the clipboard (Set-Clipboard).
      - 6. Print "Project Resumed. CONTEXT.md copied to clipboard."
    `;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: getSystemInstruction(mode),
        responseMimeType: isJsonMode ? 'application/json' : 'text/plain',
        thinkingConfig: { thinkingBudget: 1024 } 
      }
    });

    const text = response.text || "";

    // If Blueprint mode, we just return the JSON text to be parsed by the component
    if (mode === GeneratorMode.ARCHITECT_BLUEPRINT) {
        return { markdown: text };
    }
    
    // Extract scripts for Fabricate mode
    const scripts: {filename: string, content: string, language: string}[] = [];
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let match;
    let count = 1;
    while ((match = codeBlockRegex.exec(text)) !== null) {
      const lang = match[1] || 'text';
      let content = match[2];
      let extension = 'txt';
      let filename = `file_${count}`;

      // Heuristic filename detection
      if (content.includes('Get-Content') || content.includes('New-Item') || lang === 'powershell' || lang === 'ps1') {
        extension = 'ps1';
        if (content.includes('wt') || content.includes('resume')) {
             filename = `resume_${architectState?.blueprint?.name.toLowerCase() || 'project'}`;
        } else {
             filename = `init_${architectState?.blueprint?.name.toLowerCase() || 'project'}`;
        }
      } else if (lang === 'md' || lang === 'markdown') {
        extension = 'md';
        filename = 'CONTEXT';
      }

      scripts.push({
        filename: `${filename}.${extension}`,
        content: content.trim(),
        language: lang
      });
      count++;
    }

    return {
      markdown: text,
      scripts: scripts.length > 0 ? scripts : undefined
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      markdown: `### Error\n\n${(error as Error).message}`,
    };
  }
};