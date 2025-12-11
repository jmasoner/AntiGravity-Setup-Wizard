export type AIModel =
  | 'gemini-2.5-flash'
  | 'claude-3-5-sonnet-20241022'
  | 'claude-3-opus-20240229'
  | 'deepseek-coder'
  | 'qwen-2.5-coder-32b'
  | 'mistral-codestral';

export interface UserProfile {
  name: string;
  username: string;
  email: string;
  phoneCell: string;
  phoneDesk: string;
  address: string;
  googleDrivePath: string;
  oneDrivePath: string;
  githubPath: string;
  // Hosting / SSH Details
  hostingHostname?: string; // e.g., aikbr.com
  hostingUsername?: string; // e.g., cpanel_user
  sshKeyPath?: string;      // e.g., C:\\Users\\Name\\.ssh\\id_rsa
  // AI Model Selection
  selectedAIModel?: AIModel; // Default AI model to use
}

export interface ProjectConfig {
  projectName: string;
  projectSlug: string; // Directory name e.g., 'anti-gravity-wizard'
  location: 'OneDrive' | 'GoogleDrive' | 'Both';
  tools: string[]; // e.g., ['Gemini CLI', 'Claude CLI']
  description: string;
  githubRepoName?: string; // GitHub repository name for sync
}

export enum GeneratorMode {
  SETUP_GUIDE = 'SETUP_GUIDE',
  PROJECT_SCAFFOLD = 'PROJECT_SCAFFOLD', // Legacy simple mode
  README_GEN = 'README_GEN',
  DRIVE_MAPPING = 'DRIVE_MAPPING',
  ARCHITECT_INTERVIEW = 'ARCHITECT_INTERVIEW',
  ARCHITECT_BLUEPRINT = 'ARCHITECT_BLUEPRINT',
  ARCHITECT_FABRICATE = 'ARCHITECT_FABRICATE'
}

export interface GeneratedContent {
  markdown: string;
  scripts?: {
    filename: string;
    content: string;
    language: string;
  }[];
}

// -- New Architect Types --

export type ArchitectStep = 'IDEATION' | 'INTERVIEW' | 'BLUEPRINT' | 'FABRICATION';

export interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
}

export interface ArchitectState {
  step: ArchitectStep;
  rawIdea: string;
  chatHistory: ChatMessage[]; // Full conversation log
  blueprint: ProjectBlueprint | null;
}

export interface ProjectBlueprint {
  name: string;
  architectureType: 'MODULAR' | 'FLAT';
  description: string;
  phases: string[];
  techStack: string[];
  folderStructure: string;
  rationale: string;
}