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
  sshKeyPath?: string;      // e.g., C:\Users\Name\.ssh\id_rsa
}

export interface ProjectConfig {
  projectName: string;
  projectSlug: string; // Directory name e.g., 'anti-gravity-wizard'
  location: 'OneDrive' | 'GoogleDrive' | 'Both';
  tools: string[]; // e.g., ['Gemini CLI', 'Claude CLI']
  description: string;
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

export interface ArchitectState {
  step: ArchitectStep;
  rawIdea: string;
  interviewQandA: { question: string; answer: string }[];
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