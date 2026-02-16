import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CompiledPanelProps {
  prompt: string;
}

const CompiledPanel: React.FC<CompiledPanelProps> = ({ prompt }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
          Compiled Prompt
          <span className="text-[10px] bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded font-normal normal-case tracking-normal">
            Read-only
          </span>
        </h3>
        <button
          onClick={handleCopy}
          disabled={!prompt}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
            copied 
              ? 'bg-green-50 text-green-600 border border-green-200' 
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          {copied ? (
            <>
              <Check size={14} /> Copied!
            </>
          ) : (
            <>
              <Copy size={14} /> Copy Prompt
            </>
          )}
        </button>
      </div>
      <div className="flex-1 bg-gray-900 rounded-xl p-4 overflow-y-auto font-mono text-sm text-gray-300 leading-relaxed selection:bg-blue-500/30">
        {prompt ? (
          <pre className="whitespace-pre-wrap">{prompt}</pre>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-600 italic">
            Add blocks to see the compiled prompt here...
          </div>
        )}
      </div>
    </div>
  );
};

export default CompiledPanel;
