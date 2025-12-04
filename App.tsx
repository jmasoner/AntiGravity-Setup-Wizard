import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { ProfileEditor } from './components/ProfileEditor';
import { ResultViewer } from './components/ResultViewer';
import { ProjectArchitect } from './components/ProjectArchitect';
import { INITIAL_USER_PROFILE, TOOLS_LIST } from './constants';
import { UserProfile, ProjectConfig, GeneratorMode, GeneratedContent } from './types';
import { generateContent } from './services/geminiService';
import { Play, Download, Github } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedContent | null>(null);

  // Defaulting to "AntiGravity" details so the user can generate the README for THIS project easily.
  const [projectConfig, setProjectConfig] = useState<ProjectConfig>({
    projectName: 'AntiGravity Setup Wizard',
    projectSlug: 'AntiGravity-Setup-Wizard',
    location: 'Both',
    tools: ['React', 'Gemini API', 'Tailwind CSS', 'TypeScript', 'GitHub CLI'],
    description: 'A personalized environment setup assistant and project architect that generates PowerShell scripts, scaffolds, and context files for Gemini/Claude workflows.'
  });

  const handleGenerate = async (mode: GeneratorMode) => {
    setLoading(true);
    setResult(null);
    try {
      const content = await generateContent(mode, profile, projectConfig);
      setResult(content);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <ProfileEditor 
            profile={profile} 
            setProfile={setProfile} 
            projectConfig={projectConfig}
            setProjectConfig={setProjectConfig}
          />
        );
      
      case 'drive':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-900/40 to-slate-900 border border-blue-800/50 p-6 rounded-xl">
              <h2 className="text-2xl font-bold text-white mb-2">Google Drive Mapping</h2>
              <p className="text-slate-300 mb-6">
                Instructions to install Google Drive for Desktop and map it to a drive letter (G:) on your Desktop and Laptop.
              </p>
              <button
                onClick={() => handleGenerate(GeneratorMode.DRIVE_MAPPING)}
                disabled={loading}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold transition shadow-lg shadow-blue-900/20 disabled:opacity-50"
              >
                <Download className="w-5 h-5" />
                <span>Generate Mapping Guide</span>
              </button>
            </div>
            <ResultViewer content={result} loading={loading} />
          </div>
        );

      case 'setup':
        return (
          <div className="space-y-6">
             <div className="bg-gradient-to-r from-emerald-900/40 to-slate-900 border border-emerald-800/50 p-6 rounded-xl">
              <h2 className="text-2xl font-bold text-white mb-2">AntiGravity Environment Setup</h2>
              <p className="text-slate-300 mb-6">
                Create the master instruction set for installing Python, Node.js, Git, Gemini CLI, and Claude CLI. 
                This will also cover setting up your `MyProjects` folder structure in {profile.oneDrivePath} and {profile.googleDrivePath}.
              </p>
              <button
                onClick={() => handleGenerate(GeneratorMode.SETUP_GUIDE)}
                disabled={loading}
                className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-lg font-semibold transition shadow-lg shadow-emerald-900/20 disabled:opacity-50"
              >
                <Play className="w-5 h-5" />
                <span>Generate Setup Script</span>
              </button>
            </div>
            <ResultViewer content={result} loading={loading} />
          </div>
        );

      case 'project':
        return <ProjectArchitect profile={profile} />;

      case 'readme':
        return (
          <div className="space-y-6">
            <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl space-y-6">
              <div className="flex items-center justify-between">
                 <h2 className="text-2xl font-bold text-white">README Generator</h2>
                 <Github className="text-orange-500 w-8 h-8" />
              </div>
              <p className="text-slate-400 text-sm">
                Generates a standardized README.md incorporating your contact details and the current project configuration.
              </p>
              
               <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">Project Description</label>
                    <textarea 
                      value={projectConfig.description}
                      onChange={(e) => setProjectConfig({...projectConfig, description: e.target.value})}
                      className="w-full h-24 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white resize-none"
                    />
               </div>

               <button
                onClick={() => handleGenerate(GeneratorMode.README_GEN)}
                disabled={loading}
                className="w-full bg-orange-600 hover:bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold transition shadow-lg shadow-orange-900/20 disabled:opacity-50"
              >
                Generate README.md
              </button>
            </div>
            <ResultViewer content={result} loading={loading} />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={(tab) => { setActiveTab(tab); setResult(null); }}>
      {renderContent()}
    </Layout>
  );
}

export default App;