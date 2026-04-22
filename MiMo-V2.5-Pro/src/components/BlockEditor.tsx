import type {
  BlockInstance,
  ConstraintsData,
  ExamplesData,
  OutputFormatData,
  RoleData,
  TaskData,
  ContextData,
  ToneData,
} from '../types/blocks'

interface BlockEditorProps {
  block: BlockInstance | null
  onChange: (updated: BlockInstance) => void
}

export function BlockEditor({ block, onChange }: BlockEditorProps) {
  if (!block) {
    return (
      <div className="p-4">
        <h2 className="mb-2 text-sm font-semibold text-slate-700">Block Editor</h2>
        <p className="text-sm text-slate-400">Select a block to edit its content</p>
      </div>
    )
  }

  return (
    <div className="p-4">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
        Edit {block.type.replace('_', ' ')}
      </h2>
      {block.type === 'role' && <RoleEditor block={block} onChange={onChange} />}
      {block.type === 'task' && <TaskEditor block={block} onChange={onChange} />}
      {block.type === 'context' && <ContextEditor block={block} onChange={onChange} />}
      {block.type === 'constraints' && <ConstraintsEditor block={block} onChange={onChange} />}
      {block.type === 'tone' && <ToneEditor block={block} onChange={onChange} />}
      {block.type === 'output_format' && <OutputFormatEditor block={block} onChange={onChange} />}
      {block.type === 'examples' && <ExamplesEditor block={block} onChange={onChange} />}
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="mb-1 block text-xs font-medium text-slate-600">{children}</label>
}

function RoleEditor({
  block,
  onChange,
}: {
  block: BlockInstance
  onChange: (b: BlockInstance) => void
}) {
  const data = block.data as RoleData
  return (
    <div>
      <Label>Role</Label>
      <textarea
        value={data.role}
        onChange={(e) => onChange({ ...block, data: { ...data, role: e.target.value } })}
        placeholder="e.g., Senior Python Developer"
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        rows={3}
      />
    </div>
  )
}

function TaskEditor({
  block,
  onChange,
}: {
  block: BlockInstance
  onChange: (b: BlockInstance) => void
}) {
  const data = block.data as TaskData
  return (
    <div>
      <Label>Task</Label>
      <textarea
        value={data.task}
        onChange={(e) => onChange({ ...block, data: { ...data, task: e.target.value } })}
        placeholder="e.g., Write unit tests for the given function"
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        rows={3}
      />
    </div>
  )
}

function ContextEditor({
  block,
  onChange,
}: {
  block: BlockInstance
  onChange: (b: BlockInstance) => void
}) {
  const data = block.data as ContextData
  return (
    <div>
      <Label>Context</Label>
      <textarea
        value={data.context}
        onChange={(e) => onChange({ ...block, data: { ...data, context: e.target.value } })}
        placeholder="e.g., We're building a React app with TypeScript"
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        rows={3}
      />
    </div>
  )
}

function ToneEditor({
  block,
  onChange,
}: {
  block: BlockInstance
  onChange: (b: BlockInstance) => void
}) {
  const data = block.data as ToneData
  return (
    <div>
      <Label>Tone</Label>
      <input
        type="text"
        value={data.tone}
        onChange={(e) => onChange({ ...block, data: { ...data, tone: e.target.value } })}
        placeholder="e.g., Professional, concise, friendly"
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </div>
  )
}

function ConstraintsEditor({
  block,
  onChange,
}: {
  block: BlockInstance
  onChange: (b: BlockInstance) => void
}) {
  const data = block.data as ConstraintsData

  function updateItem(index: number, value: string) {
    const items = [...data.items]
    items[index] = value
    onChange({ ...block, data: { ...data, items } })
  }

  function addItem() {
    onChange({ ...block, data: { ...data, items: [...data.items, ''] } })
  }

  function removeItem(index: number) {
    const items = data.items.filter((_, i) => i !== index)
    onChange({ ...block, data: { ...data, items } })
  }

  return (
    <div>
      <Label>Constraints</Label>
      <div className="space-y-2">
        {data.items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => updateItem(i, e.target.value)}
              placeholder={`Constraint ${i + 1}`}
              className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              onClick={() => removeItem(i)}
              className="rounded px-2 text-slate-400 hover:bg-red-50 hover:text-red-500"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={addItem}
        className="mt-2 text-xs font-medium text-blue-600 hover:text-blue-700"
      >
        + Add constraint
      </button>
    </div>
  )
}

function OutputFormatEditor({
  block,
  onChange,
}: {
  block: BlockInstance
  onChange: (b: BlockInstance) => void
}) {
  const data = block.data as OutputFormatData

  return (
    <div className="space-y-3">
      <div>
        <Label>Format</Label>
        <select
          value={data.format}
          onChange={(e) =>
            onChange({
              ...block,
              data: { ...data, format: e.target.value as OutputFormatData['format'] },
            })
          }
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="plain_text">Plain text</option>
          <option value="bullet_list">Bullet list</option>
          <option value="json">JSON</option>
        </select>
      </div>
      {data.format === 'json' && (
        <div>
          <Label>JSON Schema (optional)</Label>
          <textarea
            value={data.jsonSchema}
            onChange={(e) => onChange({ ...block, data: { ...data, jsonSchema: e.target.value } })}
            placeholder='{"type":"object","properties":{...}}'
            className="w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            rows={4}
          />
        </div>
      )}
    </div>
  )
}

function ExamplesEditor({
  block,
  onChange,
}: {
  block: BlockInstance
  onChange: (b: BlockInstance) => void
}) {
  const data = block.data as ExamplesData

  function updateExample(index: number, field: 'input' | 'output', value: string) {
    const examples = [...data.examples]
    examples[index] = { ...examples[index], [field]: value }
    onChange({ ...block, data: { ...data, examples } })
  }

  function addExample() {
    onChange({
      ...block,
      data: {
        ...data,
        examples: [...data.examples, { id: crypto.randomUUID(), input: '', output: '' }],
      },
    })
  }

  function removeExample(index: number) {
    const examples = data.examples.filter((_, i) => i !== index)
    onChange({ ...block, data: { ...data, examples } })
  }

  return (
    <div>
      <Label>Examples</Label>
      <div className="space-y-3">
        {data.examples.map((ex, i) => (
          <div key={ex.id} className="rounded-lg border border-slate-200 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Example {i + 1}</span>
              <button
                onClick={() => removeExample(i)}
                className="text-xs text-slate-400 hover:text-red-500"
              >
                Remove
              </button>
            </div>
            <div className="space-y-2">
              <input
                type="text"
                value={ex.input}
                onChange={(e) => updateExample(i, 'input', e.target.value)}
                placeholder="Input"
                className="w-full rounded border border-slate-200 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
              />
              <input
                type="text"
                value={ex.output}
                onChange={(e) => updateExample(i, 'output', e.target.value)}
                placeholder="Output"
                className="w-full rounded border border-slate-200 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={addExample}
        className="mt-2 text-xs font-medium text-blue-600 hover:text-blue-700"
      >
        + Add example
      </button>
    </div>
  )
}
