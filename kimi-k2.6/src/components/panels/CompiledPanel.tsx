import { useMemo, useState } from 'react'
import type { BlockInstance } from '../../types/blocks'
import { compilePrompt } from '../../lib/compiler'

interface CompiledPanelProps {
  blocks: BlockInstance[]
}

export function CompiledPanel({ blocks }: CompiledPanelProps) {
  const text = useMemo(() => compilePrompt(blocks), [blocks])
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // ignore
    }
  }

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-700">Compiled Prompt</h3>
        <button
          onClick={handleCopy}
          className="text-xs px-3 py-1.5 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <textarea
        readOnly
        className="w-full h-40 rounded-md border-gray-300 bg-gray-50 text-sm px-3 py-2 font-mono resize-none focus:outline-none"
        value={text}
      />
    </div>
  )
}
