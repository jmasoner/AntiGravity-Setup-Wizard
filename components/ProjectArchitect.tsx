import React, { useState } from 'react';
import { UserProfile, ArchitectState, GeneratorMode, ProjectBlueprint } from '../types';
import { generateContent } from '../services/geminiService';
import { ResultViewer } from './ResultViewer';
import { BrainCircuit, MessageSquare, Compass, Rocket, ArrowRight, CheckCircle } from 'lucide-react';

interface ProjectArchitectProps {
  profile: UserProfile;
}

export const ProjectArchitect: React.FC<ProjectArchitectProps> = ({ profile }) => {
  const [state, setState] = useState<ArchitectState>({
    step: 'IDEATION',
    rawIdea: '',
    interviewQandA: [],
    blueprint: null
  });
  
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string>(''); // For Interview stage text
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [finalResult, setFinalResult] = useState<any>(null); // For Fabrication stage

  // --- HANDLERS ---

  const startInterview = async () => {
    if (!state.rawIdea) return;
    setLoading(true);
    try {
      const result = await generateContent(GeneratorMode.ARCHITECT_INTERVIEW, profile, undefined, state);
      setAiResponse(result.markdown);
      setState(s => ({ ...s, step: 'INTERVIEW' }));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = () => {
    if (!currentAnswer) return;
    // We append the AI's previous text as the "Question" (simplified) and user answer
    // In a real chat app, we'd keep full history. Here we just grab the last AI output as context.
    const newQA = [...state.interviewQandA, { question: aiResponse, answer: currentAnswer }];
    setState(s => ({ ...s, interviewQandA: newQA }));
    setCurrentAnswer('');
    // For this simple wizard, we assume after 1 round of Q&A we move to Blueprint, 
    // but we could loop. Let's loop once if Q&A is empty, then offer Blueprint.
    if (newQA.length < 1) {
        // Continue interview? (Not implemented for brevity, let's go straight to Blueprint after user input)
    } 
    generateBlueprint(newQA);
  };

  const generateBlueprint = async (qaHistory: {question: string, answer: string}[]) => {
    setLoading(true);
    try {
      // Create a temporary state with updated QA for the API call
      const tempState = { ...state, interviewQandA: qaHistory };
      const result = await generateContent(GeneratorMode.ARCHITECT_BLUEPRINT, profile, undefined, tempState);
      
      // Parse JSON from markdown code block if present, or raw text
      let jsonStr = result.markdown;
      if (jsonStr.includes('```json')) {
        jsonStr = jsonStr.split('```json')[1].split('```')[0];
      } else if (jsonStr.includes('```')) {
        jsonStr = jsonStr.split('```')[1].split('```')[0];
      }
      
      const blueprint: ProjectBlueprint = JSON.parse(jsonStr);
      setState(s => ({ ...s, step: 'BLUEPRINT', interviewQandA: qaHistory, blueprint }));
    } catch (e) {
      console.error("Failed to parse blueprint JSON", e);
      setAiResponse("Error generating blueprint. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fabricateMission = async () => {
    setLoading(true);
    try {
      const result = await generateContent(GeneratorMode.ARCHITECT_FABRICATE, profile, undefined, state);
      setFinalResult(result);
      setState(s => ({ ...s, step: 'FABRICATION' }));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // --- RENDER STEPS ---

  const renderIdeation = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-slate-950 border border-slate-800 p-8 rounded-xl text-center space-y-4">
        <BrainCircuit className="w-16 h-16 text-blue-500 mx-auto" />
        <h2 className="text-3xl font-bold text-white">What are we building today, John?</h2>
        <p className="text-slate-400 max-w-lg mx-auto">
          Describe your idea in plain English. I'll act as your CTO to determine the architecture, tools, and folder structure.
        </p>
        <textarea
          value={state.rawIdea}
          onChange={(e) => setState(s => ({...s, rawIdea: e.target.value}))}
          placeholder="e.g., I want a dashboard to track city traffic using Python and React..."
          className="w-full h-32 bg-slate-900 border border-slate-700 rounded-lg p-4 text-white resize-none focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button
          onClick={startInterview}
          disabled={loading || !state.rawIdea}
          className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold transition flex items-center gap-2 mx-auto disabled:opacity-50"
        >
          {loading ? 'Thinking...' : 'Analyze Idea'} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const renderInterview = () => (
    <div className="space-y-6 animate-in slide-in-from-right duration-500">
      <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <MessageSquare className="text-emerald-500 w-6 h-6" />
            <h3 className="text-xl font-bold text-white">Gemini Architect</h3>
        </div>
        
        <div className="prose prose-invert prose-emerald max-w-none">
            <div className="bg-emerald-950/30 p-4 rounded-lg border border-emerald-900/50 text-emerald-100 whitespace-pre-wrap">
                {aiResponse}
            </div>
        </div>

        <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Your Answer / Refinement</label>
            <textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Answer the questions or provide more details..."
                className="w-full h-24 bg-slate-900 border border-slate-700 rounded-lg p-4 text-white resize-none focus:ring-2 focus:ring-emerald-500 outline-none"
            />
        </div>

        <button
          onClick={submitAnswer}
          disabled={loading || !currentAnswer}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? 'Designing Blueprint...' : 'Create Blueprint'} <Compass className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const renderBlueprint = () => (
    <div className="space-y-6 animate-in zoom-in duration-300">
       <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl space-y-6 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -z-10"></div>

          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
                <Compass className="text-purple-500 w-6 h-6" />
                <h3 className="text-xl font-bold text-white">Project Blueprint: <span className="text-purple-400">{state.blueprint?.name}</span></h3>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${state.blueprint?.architectureType === 'MODULAR' ? 'bg-blue-500/20 border-blue-500 text-blue-300' : 'bg-orange-500/20 border-orange-500 text-orange-300'}`}>
                {state.blueprint?.architectureType}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Left Col: Details */}
             <div className="space-y-4">
                <div>
                    <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Description</h4>
                    <p className="text-slate-200 mt-1 text-sm">{state.blueprint?.description}</p>
                </div>
                <div>
                    <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Tech Stack</h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                        {state.blueprint?.techStack.map(t => (
                            <span key={t} className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-xs border border-slate-700">{t}</span>
                        ))}
                    </div>
                </div>
                <div>
                    <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Phases</h4>
                    <ul className="mt-1 space-y-1">
                        {state.blueprint?.phases.map((p, i) => (
                            <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                                <span className="text-purple-500 mt-1">•</span> {p}
                            </li>
                        ))}
                    </ul>
                </div>
             </div>

             {/* Right Col: Structure */}
             <div className="bg-slate-900 rounded-lg p-4 border border-slate-700 font-mono text-xs text-slate-300 overflow-auto max-h-64">
                <h4 className="text-slate-500 mb-2 font-sans font-bold uppercase">Proposed Structure</h4>
                <pre>{state.blueprint?.folderStructure}</pre>
             </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
             <button
                onClick={fabricateMission}
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-500 text-white px-6 py-4 rounded-lg font-bold text-lg transition shadow-lg shadow-purple-900/20 hover:shadow-purple-500/20 flex items-center justify-center gap-3 disabled:opacity-50"
             >
                <Rocket className="w-6 h-6" />
                {loading ? 'Fabricating Mission Files...' : 'Launch Mission Fabrication'}
             </button>
             <p className="text-center text-slate-500 text-xs mt-2">
                Generates CONTEXT.md, Initialization Script, and Daily Resume Script.
             </p>
          </div>
       </div>
    </div>
  );

  const renderFabrication = () => (
    <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
         <div className="bg-gradient-to-r from-green-900/40 to-slate-900 border border-green-800/50 p-6 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/50">
                    <CheckCircle className="text-green-500 w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">Mission Ready</h2>
                    <p className="text-slate-300">Your scripts have been fabricated and are ready for deployment.</p>
                </div>
            </div>
            <button onClick={() => setState({step: 'IDEATION', rawIdea: '', interviewQandA: [], blueprint: null})} className="text-slate-400 hover:text-white text-sm underline">
                Start New Project
            </button>
         </div>
         <ResultViewer content={finalResult} loading={false} />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
        {state.step === 'IDEATION' && renderIdeation()}
        {state.step === 'INTERVIEW' && renderInterview()}
        {state.step === 'BLUEPRINT' && renderBlueprint()}
        {state.step === 'FABRICATION' && renderFabrication()}
    </div>
  );
};
