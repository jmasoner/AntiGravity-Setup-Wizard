import { UserProfile } from './types';

// Pre-filled with the information provided by the user for this session.
// In a real production app, this would likely be loaded from a secure backend or local storage.
export const INITIAL_USER_PROFILE: UserProfile = {
  name: "John Masoner",
  username: "john@masoner.us",
  email: "john@masoner.us",
  phoneCell: "360-513-4238",
  phoneDesk: "850-359-8005",
  address: "2760 Country Mill Rd, Milton, FL 325770",
  googleDrivePath: "G:\\My Drive", // Standard Google Drive for Desktop path
  oneDrivePath: "C:\\Users\\john\\OneDrive",
  githubPath: "C:\\Users\\john\\OneDrive\\MyProjects", // Updated to match user workflow
  hostingHostname: "", // e.g. aikbr.com
  hostingUsername: "",
  sshKeyPath: "C:\\Users\\john\\.ssh\\id_rsa",
  selectedAIModel: "gemini-2.5-flash" // Default AI model
};

export const TOOLS_LIST = [
  "Gemini CLI",
  "Claude CLI",
  "Google Cloud SDK",
  "Python Virtual Env",
  "Node.js",
  "Git / GitHub",
  "Docker",
  "Terraform"
];