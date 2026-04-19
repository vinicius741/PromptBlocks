import type {
  BlockInstance,
  RoleBlockData,
  TaskBlockData,
  ContextBlockData,
  ConstraintsBlockData,
  ToneBlockData,
  OutputFormatBlockData,
  ExamplesBlockData,
  OutputFormatType,
  Example,
} from '@/types/blocks';
import { BLOCK_TYPE_REGISTRY } from '@/types/blocks';
import { X, Plus, Trash2 } from 'lucide-react';

interface BlockEditorProps {
  block: BlockInstance | null;
  onChange: (block: BlockInstance) => void;
  onClose: () => void;
}

export function BlockEditor({ block, onChange, onClose }: BlockEditorProps) {
  if (!block) {
    return (
      <div className="h-full flex flex-col bg-gray-50 border-r border-gray-200 p-6">
        <div className="flex-1 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <p className="text-lg font-medium">No block selected</p>
            <p className="text-sm mt-1">Click a block on the canvas to edit it</p>
          </div>
        </div>
      </div>
    );
  }

  const config = BLOCK_TYPE_REGISTRY[block.type];

  const handleDataChange = (newData: BlockInstance['data']) => {
    onChange({
      ...block,
      data: newData,
    });
  };

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{config.label}</h2>
          <p className="text-sm text-gray-500">{config.description}</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <BlockTypeEditor block={block} onChange={handleDataChange} />
      </div>
    </div>
  );
}

function BlockTypeEditor({
  block,
  onChange,
}: {
  block: BlockInstance;
  onChange: (data: BlockInstance['data']) => void;
}) {
  switch (block.type) {
    case 'role':
      return <RoleEditor data={block.data as RoleBlockData} onChange={onChange} />;
    case 'task':
      return <TaskEditor data={block.data as TaskBlockData} onChange={onChange} />;
    case 'context':
      return <ContextEditor data={block.data as ContextBlockData} onChange={onChange} />;
    case 'constraints':
      return <ConstraintsEditor data={block.data as ConstraintsBlockData} onChange={onChange} />;
    case 'tone':
      return <ToneEditor data={block.data as ToneBlockData} onChange={onChange} />;
    case 'output_format':
      return <OutputFormatEditor data={block.data as OutputFormatBlockData} onChange={onChange} />;
    case 'examples':
      return <ExamplesEditor data={block.data as ExamplesBlockData} onChange={onChange} />;
    default:
      return <div>Unknown block type</div>;
  }
}

function RoleEditor({
  data,
  onChange,
}: {
  data: RoleBlockData;
  onChange: (data: RoleBlockData) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Role Description
        </label>
        <input
          type="text"
          value={data.role}
          onChange={(e) => onChange({ ...data, role: e.target.value })}
          placeholder="e.g., Expert Python Developer"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          This will compile to: &quot;You are a [role]&quot;
        </p>
      </div>
    </div>
  );
}

function TaskEditor({
  data,
  onChange,
}: {
  data: TaskBlockData;
  onChange: (data: TaskBlockData) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Task Description
        </label>
        <textarea
          value={data.task}
          onChange={(e) => onChange({ ...data, task: e.target.value })}
          placeholder="e.g., Write a function to calculate fibonacci numbers"
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          This will compile to: &quot;Your task: [task]&quot;
        </p>
      </div>
    </div>
  );
}

function ContextEditor({
  data,
  onChange,
}: {
  data: ContextBlockData;
  onChange: (data: ContextBlockData) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Context Information
        </label>
        <textarea
          value={data.context}
          onChange={(e) => onChange({ ...data, context: e.target.value })}
          placeholder="Provide background information, constraints, or relevant details..."
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}

function ConstraintsEditor({
  data,
  onChange,
}: {
  data: ConstraintsBlockData;
  onChange: (data: ConstraintsBlockData) => void;
}) {
  const addConstraint = () => {
    onChange({ ...data, constraints: [...data.constraints, ''] });
  };

  const updateConstraint = (index: number, value: string) => {
    const newConstraints = [...data.constraints];
    newConstraints[index] = value;
    onChange({ ...data, constraints: newConstraints });
  };

  const removeConstraint = (index: number) => {
    const newConstraints = data.constraints.filter((_, i) => i !== index);
    onChange({ ...data, constraints: newConstraints });
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">Constraints</label>
      <div className="space-y-2">
        {data.constraints.map((constraint, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={constraint}
              onChange={(e) => updateConstraint(index, e.target.value)}
              placeholder={`Constraint ${index + 1}`}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => removeConstraint(index)}
              className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
              disabled={data.constraints.length === 1}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={addConstraint}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add Constraint
      </button>
      <p className="text-xs text-gray-500">
        Constraints will be compiled as a bullet list
      </p>
    </div>
  );
}

function ToneEditor({
  data,
  onChange,
}: {
  data: ToneBlockData;
  onChange: (data: ToneBlockData) => void;
}) {
  const tonePresets = [
    'Professional',
    'Casual',
    'Friendly',
    'Formal',
    'Enthusiastic',
    'Empathetic',
    'Direct',
    'Technical',
  ];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tone</label>
        <input
          type="text"
          value={data.tone}
          onChange={(e) => onChange({ ...data, tone: e.target.value })}
          placeholder="e.g., Professional and concise"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Presets</label>
        <div className="flex flex-wrap gap-2">
          {tonePresets.map((tone) => (
            <button
              key={tone}
              onClick={() => onChange({ ...data, tone })}
              className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
            >
              {tone}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function OutputFormatEditor({
  data,
  onChange,
}: {
  data: OutputFormatBlockData;
  onChange: (data: OutputFormatBlockData) => void;
}) {
  const formats: { value: OutputFormatType; label: string }[] = [
    { value: 'plain_text', label: 'Plain Text' },
    { value: 'bullet_list', label: 'Bullet List' },
    { value: 'json', label: 'JSON' },
  ];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Output Format
        </label>
        <div className="space-y-2">
          {formats.map((format) => (
            <label
              key={format.value}
              className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
            >
              <input
                type="radio"
                name="outputFormat"
                value={format.value}
                checked={data.format === format.value}
                onChange={(e) =>
                  onChange({ ...data, format: e.target.value as OutputFormatType })
                }
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm font-medium text-gray-700">{format.label}</span>
            </label>
          ))}
        </div>
      </div>

      {data.format === 'json' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            JSON Schema (Optional)
          </label>
          <textarea
            value={data.jsonSchema || ''}
            onChange={(e) => onChange({ ...data, jsonSchema: e.target.value })}
            placeholder={`{\n  "type": "object",\n  "properties": {\n    "result": { "type": "string" }\n  }\n}`}
            rows={8}
            className="w-full px-3 py-2 font-mono text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}
    </div>
  );
}

function ExamplesEditor({
  data,
  onChange,
}: {
  data: ExamplesBlockData;
  onChange: (data: ExamplesBlockData) => void;
}) {
  const addExample = () => {
    onChange({
      ...data,
      examples: [...data.examples, { input: '', output: '' }],
    });
  };

  const updateExample = (index: number, field: keyof Example, value: string) => {
    const newExamples = [...data.examples];
    newExamples[index] = { ...newExamples[index], [field]: value };
    onChange({ ...data, examples: newExamples });
  };

  const removeExample = (index: number) => {
    const newExamples = data.examples.filter((_, i) => i !== index);
    onChange({ ...data, examples: newExamples });
  };

  return (
    <div className="space-y-6">
      {data.examples.map((example, index) => (
        <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">Example {index + 1}</span>
            <button
              onClick={() => removeExample(index)}
              className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
              disabled={data.examples.length === 1}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Input</label>
              <textarea
                value={example.input}
                onChange={(e) => updateExample(index, 'input', e.target.value)}
                placeholder="Example input..."
                rows={2}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Output</label>
              <textarea
                value={example.output}
                onChange={(e) => updateExample(index, 'output', e.target.value)}
                placeholder="Expected output..."
                rows={3}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={addExample}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add Example
      </button>
    </div>
  );
}