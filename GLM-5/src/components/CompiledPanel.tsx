import { useState } from 'react';
import type { BlockInstance } from '@/types/blocks';
import { compilePrompt } from '@/lib/compiler';

interface CompiledPanelProps {
  blocks: BlockInstance[];
}

export function CompiledPanel({ blocks }: CompiledPanelProps) {
  const [copied, setCopied] = useState(false);
  const compiledPrompt = compilePrompt(blocks);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(compiledPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="border-t border-gray-200 bg-gray-50 p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">Compiled Prompt</h3>
        <button
          onClick={handleCopy}
          disabled={!compiledPrompt}
          className="rounded bg-blue-600 px-3 py-1 text-xs text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <textarea
        readOnly
        value={compiledPrompt || 'Add blocks to see the compiled prompt...'}
        className="h-32 w-full resize-none rounded border border-gray-300 bg-white p-2 font-mono text-sm text-gray-800"
      />
    </div>
  );
}
