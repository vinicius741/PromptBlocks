import { useState } from 'react';

interface CompiledPanelProps {
  text: string;
}

export default function CompiledPanel({ text }: CompiledPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          Compiled Prompt
        </h3>
        <button
          onClick={handleCopy}
          disabled={!text}
          className="rounded bg-blue-500 px-3 py-1 text-xs font-medium text-white hover:bg-blue-600 disabled:opacity-40"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <textarea
        readOnly
        value={text || '(Add blocks to see your compiled prompt)'}
        className="min-h-[180px] w-full rounded-lg border border-gray-200 bg-gray-50 p-3 font-mono text-sm text-gray-700 focus:outline-none"
      />
    </div>
  );
}
