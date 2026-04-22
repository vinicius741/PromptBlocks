import { useState } from 'react'

interface CompiledPanelProps {
  compiledPrompt: string
}

export function CompiledPanel({ compiledPrompt }: CompiledPanelProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    if (!compiledPrompt) return
    await navigator.clipboard.writeText(compiledPrompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="border-t border-slate-200 bg-white">
      <div className="flex items-center justify-between px-4 py-2">
        <h3 className="text-sm font-semibold text-slate-700">Compiled Prompt</h3>
        <button
          onClick={handleCopy}
          disabled={!compiledPrompt}
          className="rounded-md bg-slate-900 px-3 py-1 text-xs font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="px-4 pb-4">
        <pre className="max-h-40 overflow-auto rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-xs leading-relaxed text-slate-700">
          {compiledPrompt || 'Your compiled prompt will appear here...'}
        </pre>
      </div>
    </div>
  )
}
