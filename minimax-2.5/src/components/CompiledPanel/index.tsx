import React from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '../ui';

interface CompiledPanelProps {
  compiledText: string;
}

export const CompiledPanel: React.FC<CompiledPanelProps> = ({ compiledText }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(compiledText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border-t border-slate-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
          Compiled Prompt
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">
            {compiledText.length} characters
          </span>
          <Button
            variant={copied ? 'primary' : 'secondary'}
            size="sm"
            onClick={handleCopy}
            disabled={!compiledText}
          >
            {copied ? (
              <>
                <Check size={16} className="mr-1" />
                Copied!
              </>
            ) : (
              <>
                <Copy size={16} className="mr-1" />
                Copy
              </>
            )}
          </Button>
        </div>
      </div>
      <textarea
        readOnly
        value={compiledText}
        placeholder="Your compiled prompt will appear here..."
        className="w-full h-40 px-4 py-3 border border-slate-200 rounded-lg bg-slate-50 text-sm font-mono text-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      />
    </div>
  );
};
