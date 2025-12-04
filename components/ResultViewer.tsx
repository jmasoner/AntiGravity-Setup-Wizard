import React from 'react';
import { GeneratedContent } from '../types';
import { Copy, Terminal } from 'lucide-react';

interface ResultViewerProps {
  content: GeneratedContent | null;
  loading: boolean;
}

export const ResultViewer: React.FC<ResultViewerProps> = ({ content, loading }) => {
  if (loading) {
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center space-y-4 bg-slate-950/50 rounded-xl border border-slate-800 animate-pulse">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-blue-400 font-mono">Gemini is thinking...</p>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center space-y-4 bg-slate-950/30 rounded-xl border border-slate-800 border-dashed">
        <p className="text-slate-500">Select an option to generate content</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Markdown Content */}
      <div className="bg-slate-950 rounded-xl border border-slate-800 p-8 shadow-xl">
        <div className="prose prose-invert prose-blue max-w-none">
            <div className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-300">
                {content.markdown}
            </div>
        </div>
      </div>

      {/* Extracted Scripts */}
      {content.scripts && content.scripts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-emerald-400 flex items-center gap-2">
            <Terminal className="w-5 h-5" /> Generated Scripts
          </h3>
          {content.scripts.map((script, idx) => (
            <div key={idx} className="bg-[#0d1117] rounded-lg border border-slate-700 overflow-hidden">
              <div className="flex justify-between items-center px-4 py-2 bg-slate-800/50 border-b border-slate-700">
                <span className="text-xs font-mono text-slate-400">{script.filename}</span>
                <button 
                  onClick={() => navigator.clipboard.writeText(script.content)}
                  className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition"
                  title="Copy Code"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <pre className="p-4 overflow-x-auto text-sm text-blue-100 font-mono">
                {script.content}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};