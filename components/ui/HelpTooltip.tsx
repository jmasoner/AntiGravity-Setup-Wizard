import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface HelpTooltipProps {
  what: string;
  example: string;
  why: string;
}

export const HelpTooltip: React.FC<HelpTooltipProps> = ({ what, example, why }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block ml-2 group">
      <button
        type="button"
        className="text-slate-500 hover:text-blue-400 transition-colors focus:outline-none"
        onClick={() => setIsVisible(!isVisible)}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        <HelpCircle className="w-4 h-4" />
      </button>

      {isVisible && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-4 bg-slate-800 border border-slate-600 rounded-lg shadow-xl text-xs pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-slate-800 border-r border-b border-slate-600 rotate-45"></div>
          
          <div className="space-y-3">
            <div>
              <span className="font-bold text-blue-400 uppercase tracking-wider text-[10px]">What is this?</span>
              <p className="text-slate-200 mt-1">{what}</p>
            </div>
            
            <div className="bg-slate-900/50 p-2 rounded border border-slate-700/50">
              <span className="font-bold text-emerald-400 uppercase tracking-wider text-[10px]">Example</span>
              <p className="text-emerald-100 font-mono mt-1 break-all">{example}</p>
            </div>

            <div>
              <span className="font-bold text-purple-400 uppercase tracking-wider text-[10px]">Why do we need it?</span>
              <p className="text-slate-300 mt-1 italic">{why}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
