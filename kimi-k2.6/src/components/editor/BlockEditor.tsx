import type { BlockInstance, ExamplePair } from '../../types/blocks'

interface BlockEditorProps {
  block: BlockInstance | null
  onChange: (block: BlockInstance) => void
}

export function BlockEditor({ block, onChange }: BlockEditorProps) {
  if (!block) {
    return (
      <div className="w-80 bg-gray-50 border-r border-gray-200 p-4 h-full">
        <p className="text-sm text-gray-500">Select a block to edit its content.</p>
      </div>
    )
  }

  const updateData = (partial: Record<string, unknown>) => {
    onChange({ ...block, data: { ...block.data, ...partial } })
  }

  const renderFields = () => {
    switch (block.type) {
      case 'role': {
        const d = block.data as { role: string }
        return (
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Role</span>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm px-3 py-2"
              placeholder="e.g., Expert Developer"
              value={d.role}
              onChange={(e) => updateData({ role: e.target.value })}
            />
          </label>
        )
      }
      case 'task': {
        const d = block.data as { task: string }
        return (
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Task</span>
            <textarea
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm px-3 py-2"
              rows={4}
              placeholder="Describe the task..."
              value={d.task}
              onChange={(e) => updateData({ task: e.target.value })}
            />
          </label>
        )
      }
      case 'context': {
        const d = block.data as { context: string }
        return (
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Context</span>
            <textarea
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm px-3 py-2"
              rows={4}
              placeholder="Provide background context..."
              value={d.context}
              onChange={(e) => updateData({ context: e.target.value })}
            />
          </label>
        )
      }
      case 'constraints': {
        const d = block.data as { items: string[] }
        return (
          <div className="space-y-2">
            <span className="text-sm font-medium text-gray-700">Constraints</span>
            {d.items.map((item, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm px-3 py-2"
                  placeholder="Constraint"
                  value={item}
                  onChange={(e) => {
                    const next = [...d.items]
                    next[idx] = e.target.value
                    updateData({ items: next })
                  }}
                />
                <button
                  className="px-2 py-1 text-xs rounded border border-red-200 hover:bg-red-50 text-red-600"
                  onClick={() => {
                    const next = d.items.filter((_, i) => i !== idx)
                    updateData({ items: next })
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              className="text-xs px-3 py-1.5 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
              onClick={() => updateData({ items: [...d.items, ''] })}
            >
              Add Constraint
            </button>
          </div>
        )
      }
      case 'tone': {
        const d = block.data as { tone: string }
        return (
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Tone</span>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm px-3 py-2"
              placeholder="e.g., Professional and concise"
              value={d.tone}
              onChange={(e) => updateData({ tone: e.target.value })}
            />
          </label>
        )
      }
      case 'outputFormat': {
        const d = block.data as { format: 'plain' | 'bullets' | 'json'; schema?: string }
        return (
          <div className="space-y-3">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Format</span>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm px-3 py-2"
                value={d.format}
                onChange={(e) => updateData({ format: e.target.value })}
              >
                <option value="plain">Plain Text</option>
                <option value="bullets">Bullet List</option>
                <option value="json">JSON</option>
              </select>
            </label>
            {d.format === 'json' && (
              <label className="block">
                <span className="text-sm font-medium text-gray-700">JSON Schema (optional)</span>
                <textarea
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm px-3 py-2"
                  rows={4}
                  placeholder='e.g., { "type": "object", ... }'
                  value={d.schema || ''}
                  onChange={(e) => updateData({ schema: e.target.value })}
                />
              </label>
            )}
          </div>
        )
      }
      case 'examples': {
        const d = block.data as { examples: ExamplePair[] }
        return (
          <div className="space-y-4">
            <span className="text-sm font-medium text-gray-700">Examples</span>
            {d.examples.map((ex, idx) => (
              <div key={idx} className="border border-gray-200 rounded-md p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500">Example {idx + 1}</span>
                  <button
                    className="text-xs px-2 py-1 rounded border border-red-200 hover:bg-red-50 text-red-600"
                    onClick={() => {
                      const next = d.examples.filter((_, i) => i !== idx)
                      updateData({ examples: next })
                    }}
                  >
                    Remove
                  </button>
                </div>
                <label className="block">
                  <span className="text-xs text-gray-600">Input</span>
                  <textarea
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm px-3 py-2"
                    rows={2}
                    value={ex.input}
                    onChange={(e) => {
                      const next = [...d.examples]
                      next[idx] = { ...ex, input: e.target.value }
                      updateData({ examples: next })
                    }}
                  />
                </label>
                <label className="block">
                  <span className="text-xs text-gray-600">Output</span>
                  <textarea
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm px-3 py-2"
                    rows={2}
                    value={ex.output}
                    onChange={(e) => {
                      const next = [...d.examples]
                      next[idx] = { ...ex, output: e.target.value }
                      updateData({ examples: next })
                    }}
                  />
                </label>
              </div>
            ))}
            <button
              className="text-xs px-3 py-1.5 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
              onClick={() => updateData({ examples: [...d.examples, { input: '', output: '' }] })}
            >
              Add Example
            </button>
          </div>
        )
      }
      default:
        return null
    }
  }

  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 p-4 h-full overflow-y-auto">
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
        Edit Block
      </h3>
      <div className="space-y-4">{renderFields()}</div>
    </div>
  )
}
