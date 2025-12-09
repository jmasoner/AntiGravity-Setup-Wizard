import React from 'react';
import { UserProfile, ProjectConfig } from '../types';
import { Server, Key, FolderOpen, Github, Terminal, ExternalLink } from 'lucide-react';
import { HelpTooltip } from './ui/HelpTooltip';

interface ProfileEditorProps {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  projectConfig: ProjectConfig;
  setProjectConfig: (config: ProjectConfig) => void;
}

export const ProfileEditor: React.FC<ProfileEditorProps> = ({ profile, setProfile, projectConfig, setProjectConfig }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleProjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Auto-generate slug if name changes
    if (name === 'projectName') {
        const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        setProjectConfig({ ...projectConfig, projectName: value, projectSlug: slug });
    } else {
        setProjectConfig({ ...projectConfig, [name]: value });
    }
  };

  const copyGitScript = () => {
    const script = `
# --- AntiGravity Git Initializer ---
# Project: ${projectConfig.projectName}

# 1. Navigate to Project Root
$targetPath = "${profile.githubPath}\\${projectConfig.projectSlug}"
if (!(Test-Path $targetPath)) { New-Item -ItemType Directory -Force -Path $targetPath }
cd $targetPath

# 2. Initialize Local Repo
git init
git branch -M main
git add .
git commit -m "Initial commit: ${projectConfig.projectName}"

# 3. Configure GitHub Credentials (Prevent 403 Errors)
Write-Host "Configuring Git Credential Manager..." -ForegroundColor Cyan
gh auth setup-git

# NOTE: If you get a 'Permission denied' or 403 error, uncomment and run the line below to refresh credentials:
# gh auth refresh -h github.com -s repo,workflow,write:packages,delete_repo

# 4. Create and Push to GitHub
Write-Host "Creating Remote Repository..." -ForegroundColor Cyan
gh repo create ${projectConfig.projectSlug} --public --source=. --remote=origin --push
    `.trim();
    navigator.clipboard.writeText(script);
    alert('Git Initialization Script copied to clipboard!');
  };

  const openGithubNew = () => {
    const url = `https://github.com/new?name=${projectConfig.projectSlug}&description=${encodeURIComponent(projectConfig.description)}&visibility=public`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h2 className="text-2xl font-bold text-white mb-2">Identity Profile</h2>
            <p className="text-slate-400">This information is used to personalize scripts, comments, and README files.</p>
        </div>
        <div className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded text-yellow-500 text-xs">
            Stored locally in session
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Contact Details */}
        <div className="space-y-4 p-6 bg-slate-950 rounded-xl border border-slate-800">
            <h3 className="text-lg font-semibold text-blue-400 mb-4">Contact Details</h3>
            
            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400 flex items-center">
                    Full Name
                    <HelpTooltip 
                        what="Your full legal or professional name." 
                        example="John Masoner" 
                        why="Used in copyright headers, README author sections, and git configuration."
                    />
                </label>
                <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400 flex items-center">
                    Email (Username)
                    <HelpTooltip 
                        what="Your primary email address used for services." 
                        example="john@masoner.us" 
                        why="Used for git config, script logins, and documentation contact info."
                    />
                </label>
                <input
                type="text"
                name="username"
                value={profile.username}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400 flex items-center">
                        Cell Phone
                        <HelpTooltip 
                            what="Mobile contact number." 
                            example="360-513-4238" 
                            why="Included in private project documentation for team emergency contact."
                        />
                    </label>
                    <input
                    type="text"
                    name="phoneCell"
                    value={profile.phoneCell}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400 flex items-center">
                        Desk Phone
                        <HelpTooltip 
                            what="Office or Landline number." 
                            example="850-359-8005" 
                            why="Included in enterprise/corporate project documentation."
                        />
                    </label>
                    <input
                    type="text"
                    name="phoneDesk"
                    value={profile.phoneDesk}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400 flex items-center">
                    Physical Address
                    <HelpTooltip 
                        what="Mailing address for the entity owning the code." 
                        example="2760 Country Mill Rd..." 
                        why="Sometimes required for official Open Source licenses or Enterprise contracts."
                    />
                </label>
                <input
                type="text"
                name="address"
                value={profile.address}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
            </div>
        </div>

        {/* Storage Paths */}
        <div className="space-y-4 p-6 bg-slate-950 rounded-xl border border-slate-800 h-fit">
            <h3 className="text-lg font-semibold text-emerald-400 mb-4">Storage Paths</h3>
            
            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400 flex items-center">
                    OneDrive Root Path
                    <HelpTooltip 
                        what="The absolute file path to your local OneDrive folder." 
                        example="C:\Users\john\OneDrive" 
                        why="The scripts need to know exactly where to build the 'MyProjects' folder so it syncs to the cloud."
                    />
                </label>
                <input
                type="text"
                name="oneDrivePath"
                value={profile.oneDrivePath}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400 flex items-center">
                    Google Drive Root Path
                    <HelpTooltip 
                        what="The drive letter or path for Google Drive for Desktop." 
                        example="G:\My Drive" 
                        why="Used to create the redundant backup of your projects on Google's cloud."
                    />
                </label>
                <input
                type="text"
                name="googleDrivePath"
                value={profile.googleDrivePath}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400 flex items-center">
                    Local Git Repo Root
                    <HelpTooltip 
                        what="Where your git repositories live. Often the same as 'OneDrive\MyProjects'." 
                        example="C:\Users\john\OneDrive\MyProjects" 
                        why="The script initializes git here. NOTE: Syncing active git folders to OneDrive can sometimes cause conflicts, but is convenient."
                    />
                </label>
                <input
                type="text"
                name="githubPath"
                value={profile.githubPath}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                />
            </div>
        </div>

        {/* Hosting / SSH */}
        <div className="space-y-4 p-6 bg-slate-950 rounded-xl border border-slate-800 h-fit">
            <h3 className="text-lg font-semibold text-purple-400 mb-4 flex items-center gap-2">
                <Server className="w-4 h-4" /> Cloud Hosting & SSH
            </h3>
            
            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400 flex items-center">
                    Hosting Hostname / IP
                    <HelpTooltip 
                        what="The domain name or IP address of your remote server." 
                        example="aikbr.com" 
                        why="Required to create SSH connection scripts and map network drives."
                    />
                </label>
                <input
                type="text"
                name="hostingHostname"
                placeholder="e.g. aikbr.com"
                value={profile.hostingHostname || ''}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400 flex items-center">
                    Hosting Username
                    <HelpTooltip 
                        what="The username you use to log into cPanel or SSH." 
                        example="cpanel_user" 
                        why="Used to construct the SSH login command (user@host)."
                    />
                </label>
                <input
                type="text"
                name="hostingUsername"
                placeholder="e.g. cpanel_user"
                value={profile.hostingUsername || ''}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400 flex items-center gap-1">
                    <Key className="w-3 h-3" /> SSH Private Key Path
                    <HelpTooltip 
                        what="Location of your SSH private key file." 
                        example="C:\Users\john\.ssh\id_rsa" 
                        why="Allows the script to log you in automatically without typing a password every time."
                    />
                </label>
                <input
                type="text"
                name="sshKeyPath"
                value={profile.sshKeyPath || ''}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                />
            </div>
        </div>
      </div>
      
      {/* Current Project Context Section */}
      <div className="p-6 bg-slate-900/50 rounded-xl border border-slate-700">
         <h3 className="text-lg font-semibold text-orange-400 mb-4 flex items-center gap-2">
            <FolderOpen className="w-5 h-5" /> Active Project Context
         </h3>
         <p className="text-sm text-slate-400 mb-4">
            Define the project you are currently working on here. Tools like "Env Setup" and "README Creator" will use these details. 
            For new projects, use the <strong>Project Architect</strong> tab.
         </p>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400 flex items-center">
                        Current Project Name
                        <HelpTooltip 
                            what="The human-readable name of your project." 
                            example="City Sync Dashboard" 
                            why="Used in README titles and descriptions."
                        />
                    </label>
                    <input
                    type="text"
                    name="projectName"
                    value={projectConfig.projectName}
                    onChange={handleProjectChange}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400 flex items-center">
                        Project Directory (Slug)
                        <HelpTooltip 
                            what="The folder name on your hard drive. Should be lowercase and hyphenated." 
                            example="city-sync-dashboard" 
                            why="Used for folder paths and git repository URLs."
                        />
                    </label>
                    <input
                    type="text"
                    name="projectSlug"
                    value={projectConfig.projectSlug || ''}
                    onChange={handleProjectChange}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-orange-500 outline-none font-mono text-sm"
                    />
                </div>
            </div>

            <div className="space-y-4">
                 <h4 className="text-sm font-medium text-slate-400 flex items-center gap-2">
                    <Github className="w-4 h-4" /> GitHub Actions
                 </h4>
                 
                 <div className="flex gap-4">
                    <button 
                        onClick={openGithubNew}
                        className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white p-3 rounded-lg flex items-center justify-center gap-2 transition"
                    >
                        <ExternalLink className="w-4 h-4 text-orange-400" />
                        <span className="text-sm">Create on GitHub.com</span>
                    </button>
                    
                    <button 
                        onClick={copyGitScript}
                        className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white p-3 rounded-lg flex items-center justify-center gap-2 transition"
                    >
                        <Terminal className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm">Copy Init Script</span>
                    </button>
                 </div>

                 <div className="text-xs text-slate-500 font-mono bg-black/20 p-2 rounded border border-white/5">
                    Target: {profile.githubPath}\{projectConfig.projectSlug}
                 </div>
            </div>
         </div>
      </div>
    </div>
  );
};