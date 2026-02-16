import { useState, useEffect } from 'react';
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
import { getBlockTypeMeta } from '@/types/blocks';

interface BlockEditorProps {
  block: BlockInstance;
  onSave: (data: BlockData) => void;
  onClose: () => void;
}

export function BlockEditor({ block, onSave, onClose }: BlockEditorProps) {
  const [data, setData] = useState<BlockData>(block.data);
  const blockMeta = getBlockTypeMeta(block.type);

  useEffect(() => {
    setData(block.data);
  }, [block]);

  const handleSave = () => {
    onSave(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center gap-2">
          <div className={`h-4 w-4 rounded-full bg-${blockMeta.color}`} />
          <h2 className="text-lg font-semibold text-gray-800">Edit {blockMeta.label}</h2>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {block.type === 'role' && (
            <RoleEditor data={data as RoleData} onChange={setData} />
          )}
          {block.type === 'task' && (
            <TaskEditor data={data as TaskData} onChange={setData} />
          )}
          {block.type === 'context' && (
            <ContextEditor data={data as ContextData} onChange={setData} />
          )}
          {block.type === 'constraints' && (
            <ConstraintsEditor data={data as ConstraintsData} onChange={setData} />
          )}
          {block.type === 'tone' && (
            <ToneEditor data={data as ToneData} onChange={setData} />
          )}
          {block.type === 'output-format' && (
            <OutputFormatEditor data={data as OutputFormatData} onChange={setData} />
          )}
          {block.type === 'examples' && (
            <ExamplesEditor data={data as ExamplesData} onChange={setData} />
          )}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded border border-gray-300 px-4 py-2 text-gray-700 transition hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

// Role Editor
function RoleEditor({ data, onChange }: { data: RoleData; onChange: (data: RoleData) => void }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        Define the AI persona or expertise
      </label>
      <textarea
        value={data.role}
        onChange={(e) => onChange({ role: e.target.value })}
        placeholder="e.g., You are an expert software architect..."
        className="w-full rounded border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
        rows={4}
      />
    </div>
  );
}

// Task Editor
function TaskEditor({ data, onChange }: { data: TaskData; onChange: (data: TaskData) => void }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        Describe what the AI should do
      </label>
      <textarea
        value={data.task}
        onChange={(e) => onChange({ task: e.target.value })}
        placeholder="e.g., Write a comprehensive code review..."
        className="w-full rounded border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
        rows={4}
      />
    </div>
  );
}

// Context Editor
function ContextEditor({
  data,
  onChange,
}: {
  data: ContextData;
  onChange: (data: ContextData) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        Provide background information
      </label>
      <textarea
        value={data.context}
        onChange={(e) => onChange({ context: e.target.value })}
        placeholder="e.g., The application is a React-based dashboard..."
        className="w-full rounded border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
        rows={4}
      />
    </div>
  );
}

// Constraints Editor
function ConstraintsEditor({
  data,
  onChange,
}: {
  data: ConstraintsData;
  onChange: (data: ConstraintsData) => void;
}) {
  const addItem = () => {
    onChange({ items: [...data.items, ''] });
  };

  const updateItem = (index: number, value: string) => {
    const newItems = [...data.items];
    newItems[index] = value;
    onChange({ items: newItems });
  };

  const removeItem = (index: number) => {
    onChange({ items: data.items.filter((_, i) => i !== index) });
  };

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">Set rules and limitations</label>
      <div className="space-y-2">
        {data.items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
              placeholder="Enter a constraint..."
              className="flex-1 rounded border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
            />
            <button
              onClick={() => removeItem(index)}
              className="rounded bg-red-50 px-3 text-red-600 transition hover:bg-red-100"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={addItem}
        className="mt-2 rounded border border-dashed border-gray-300 px-4 py-2 text-sm text-gray-600 transition hover:border-gray-400"
      >
        + Add Constraint
      </button>
    </div>
  );
}

// Tone Editor
function ToneEditor({ data, onChange }: { data: ToneData; onChange: (data: ToneData) => void }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">Specify the writing style</label>
      <textarea
        value={data.tone}
        onChange={(e) => onChange({ tone: e.target.value })}
        placeholder="e.g., Professional, concise, and friendly..."
        className="w-full rounded border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
        rows={3}
      />
    </div>
  );
}

// Output Format Editor
function OutputFormatEditor({
  data,
  onChange,
}: {
  data: OutputFormatData;
  onChange: (data: OutputFormatData) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Format Type</label>
        <select
          value={data.format}
          onChange={(e) => onChange({ ...data, format: e.target.value as OutputFormatData['format'] })}
          className="w-full rounded border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
        >
          <option value="plain">Plain Text</option>
          <option value="bullet">Bullet Points</option>
          <option value="json">JSON</option>
        </select>
      </div>
      {data.format === 'json' && (
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            JSON Schema (optional)
          </label>
          <textarea
            value={data.jsonSchema || ''}
            onChange={(e) => onChange({ ...data, jsonSchema: e.target.value })}
            placeholder='{"type": "object", "properties": {...}}'
            className="w-full rounded border border-gray-300 p-2 font-mono text-sm focus:border-blue-500 focus:outline-none"
            rows={4}
          />
        </div>
      )}
    </div>
  );
}

// Examples Editor
function ExamplesEditor({
  data,
  onChange,
}: {
  data: ExamplesData;
  onChange: (data: ExamplesData) => void;
}) {
  const addExample = () => {
    onChange({ examples: [...data.examples, { input: '', output: '' }] });
  };

  const updateExample = (index: number, field: 'input' | 'output', value: string) => {
    const newExamples = [...data.examples];
    newExamples[index] = { ...newExamples[index], [field]: value };
    onChange({ examples: newExamples });
  };

  const removeExample = (index: number) => {
    onChange({ examples: data.examples.filter((_, i) => i !== index) });
  };

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        Provide input/output examples
      </label>
      <div className="space-y-4">
        {data.examples.map((example, index) => (
          <div key={index} className="rounded border border-gray-200 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">Example {index + 1}</span>
              <button
                onClick={() => removeExample(index)}
                className="text-xs text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
            <div className="space-y-2">
              <div>
                <label className="mb-1 block text-xs text-gray-500">Input</label>
                <textarea
                  value={example.input}
                  onChange={(e) => updateExample(index, 'input', e.target.value)}
                  className="w-full rounded border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                  rows={2}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-500">Output</label>
                <textarea
                  value={example.output}
                  onChange={(e) => updateExample(index, 'output', e.target.value)}
                  className="w-full rounded border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                  rows={2}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={addExample}
        className="mt-2 rounded border border-dashed border-gray-300 px-4 py-2 text-sm text-gray-600 transition hover:border-gray-400"
      >
        + Add Example
      </button>
    </div>
  );
}
