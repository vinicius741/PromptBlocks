import { useState } from 'react'

interface CompiledPanelProps {
  compiledPrompt: string
}

export function CompiledPanel({ compiledPrompt }: CompiledPanelProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    if (!compiledPrompt.trim()) {
      return
    }

    await navigator.clipboard.writeText(compiledPrompt)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1200)
  }

  return (
    <section className="border-t border-slate-200 bg-white/95 p-4 backdrop-blur">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">Compiled Prompt</h2>
        <button
          className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
          disabled={!compiledPrompt.trim()}
          onClick={handleCopy}
          type="button"
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <textarea
        className="h-56 w-full resize-none rounded-xl border border-slate-300 bg-slate-50 p-3 font-mono text-sm leading-relaxed text-slate-800 outline-none"
        placeholder="Add content to blocks and the compiled prompt will appear here."
        readOnly
        value={compiledPrompt}
      />
    </section>
  )
}
