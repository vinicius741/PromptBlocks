import type {
  BlockInstance,
  BlockData,
  RoleData,
  TaskData,
  ContextData,
  ConstraintsData,
  ToneData,
  OutputFormatData,
  ExamplesData,
} from '@/types/blocks';
import { BLOCK_TYPES } from '@/types/blocks';

interface BlockEditorProps {
  block: BlockInstance;
  onChange: (data: BlockData) => void;
  onClose: () => void;
}

export default function BlockEditor({ block, onChange, onClose }: BlockEditorProps) {
  const meta = BLOCK_TYPES.find((m) => m.type === block.type);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-800">
          <div className={`h-3 w-3 rounded-full ${meta?.color ?? 'bg-gray-400'}`} />
          Edit {meta?.label ?? block.type}
        </h3>
        <button
          onClick={onClose}
          className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {block.type === 'role' && (
        <RoleEditor data={block.data as RoleData} onChange={onChange} />
      )}
      {block.type === 'task' && (
        <TaskEditor data={block.data as TaskData} onChange={onChange} />
      )}
      {block.type === 'context' && (
        <ContextEditor data={block.data as ContextData} onChange={onChange} />
      )}
      {block.type === 'constraints' && (
        <ConstraintsEditor data={block.data as ConstraintsData} onChange={onChange} />
      )}
      {block.type === 'tone' && (
        <ToneEditor data={block.data as ToneData} onChange={onChange} />
      )}
      {block.type === 'output-format' && (
        <OutputFormatEditor data={block.data as OutputFormatData} onChange={onChange} />
      )}
      {block.type === 'examples' && (
        <ExamplesEditor data={block.data as ExamplesData} onChange={onChange} />
      )}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="mb-1 block text-xs font-medium text-gray-600">{children}</label>;
}

const inputCls = 'w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-200';

function RoleEditor({ data, onChange }: { data: RoleData; onChange: (d: BlockData) => void }) {
  return (
    <div>
      <Label>Role</Label>
      <input
        className={inputCls}
        value={data.role}
        onChange={(e) => onChange({ role: e.target.value })}
        placeholder="e.g. senior software engineer"
      />
    </div>
  );
}

function TaskEditor({ data, onChange }: { data: TaskData; onChange: (d: BlockData) => void }) {
  return (
    <div>
      <Label>Task</Label>
      <textarea
        className={`${inputCls} min-h-[80px]`}
        value={data.task}
        onChange={(e) => onChange({ task: e.target.value })}
        placeholder="Describe what the AI should do"
      />
    </div>
  );
}

function ContextEditor({ data, onChange }: { data: ContextData; onChange: (d: BlockData) => void }) {
  return (
    <div>
      <Label>Context</Label>
      <textarea
        className={`${inputCls} min-h-[80px]`}
        value={data.context}
        onChange={(e) => onChange({ context: e.target.value })}
        placeholder="Provide background information"
      />
    </div>
  );
}

function ConstraintsEditor({ data, onChange }: { data: ConstraintsData; onChange: (d: BlockData) => void }) {
  const items = data.items;
  return (
    <div className="flex flex-col gap-2">
      <Label>Constraints</Label>
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <input
            className={inputCls}
            value={item}
            onChange={(e) => {
              const next = [...items];
              next[i] = e.target.value;
              onChange({ items: next });
            }}
            placeholder={`Constraint ${i + 1}`}
          />
          {items.length > 1 && (
            <button
              onClick={() => onChange({ items: items.filter((_, j) => j !== i) })}
              className="rounded p-2 text-gray-400 hover:bg-red-50 hover:text-red-500"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      ))}
      <button
        onClick={() => onChange({ items: [...items, ''] })}
        className="self-start rounded border border-dashed border-gray-300 px-3 py-1 text-xs text-gray-500 hover:border-gray-400 hover:text-gray-700"
      >
        + Add constraint
      </button>
    </div>
  );
}

function ToneEditor({ data, onChange }: { data: ToneData; onChange: (d: BlockData) => void }) {
  return (
    <div>
      <Label>Tone</Label>
      <input
        className={inputCls}
        value={data.tone}
        onChange={(e) => onChange({ tone: e.target.value })}
        placeholder="e.g. professional, friendly, formal"
      />
    </div>
  );
}

function OutputFormatEditor({ data, onChange }: { data: OutputFormatData; onChange: (d: BlockData) => void }) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <Label>Format</Label>
        <select
          className={inputCls}
          value={data.format}
          onChange={(e) =>
            onChange({ ...data, format: e.target.value as OutputFormatData['format'] })
          }
        >
          <option value="plain-text">Plain text</option>
          <option value="bullet-list">Bullet list</option>
          <option value="json">JSON</option>
        </select>
      </div>
      {data.format === 'json' && (
        <div>
          <Label>JSON Schema (optional)</Label>
          <textarea
            className={`${inputCls} min-h-[100px] font-mono text-xs`}
            value={data.jsonSchema}
            onChange={(e) => onChange({ ...data, jsonSchema: e.target.value })}
            placeholder='{"type": "object", "properties": { ... }}'
          />
        </div>
      )}
    </div>
  );
}

function ExamplesEditor({ data, onChange }: { data: ExamplesData; onChange: (d: BlockData) => void }) {
  const pairs = data.pairs;
  return (
    <div className="flex flex-col gap-3">
      <Label>Example pairs</Label>
      {pairs.map((pair, i) => (
        <div key={i} className="flex flex-col gap-1 rounded border border-gray-100 p-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Example {i + 1}</span>
            {pairs.length > 1 && (
              <button
                onClick={() => onChange({ pairs: pairs.filter((_, j) => j !== i) })}
                className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
              >
                <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <input
            className={inputCls}
            value={pair.input}
            onChange={(e) => {
              const next = [...pairs];
              next[i] = { ...next[i], input: e.target.value };
              onChange({ pairs: next });
            }}
            placeholder="Input"
          />
          <input
            className={inputCls}
            value={pair.output}
            onChange={(e) => {
              const next = [...pairs];
              next[i] = { ...next[i], output: e.target.value };
              onChange({ pairs: next });
            }}
            placeholder="Output"
          />
        </div>
      ))}
      <button
        onClick={() => onChange({ pairs: [...pairs, { input: '', output: '' }] })}
        className="self-start rounded border border-dashed border-gray-300 px-3 py-1 text-xs text-gray-500 hover:border-gray-400 hover:text-gray-700"
      >
        + Add example
      </button>
    </div>
  );
}
