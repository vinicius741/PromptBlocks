import React from 'react';
import { Modal, Button, Input, Textarea, Select } from '../ui';
import {
  BlockInstance,
  RoleData,
  TaskData,
  ContextData,
  ConstraintsData,
  ToneData,
  OutputFormatData,
  ExamplesData,
  getBlockDefinition,
} from '../../types/blocks';
import { Plus, X } from 'lucide-react';

interface BlockEditorProps {
  block: BlockInstance | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (block: BlockInstance) => void;
}

export const BlockEditor: React.FC<BlockEditorProps> = ({
  block,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!block) return null;

  const definition = getBlockDefinition(block.type);
  const [data, setData] = React.useState(block.data);

  React.useEffect(() => {
    if (block) {
      setData(block.data);
    }
  }, [block]);

  const handleSave = () => {
    onSave({ ...block, data });
    onClose();
  };

  const renderFields = () => {
    switch (block.type) {
      case 'role':
        return (
          <Input
            label="Role"
            placeholder="e.g., a professional copywriter"
            value={(data as RoleData).role}
            onChange={(e) => setData({ ...data, role: e.target.value })}
          />
        );

      case 'task':
        return (
          <Textarea
            label="Task"
            placeholder="Describe the main task..."
            rows={4}
            value={(data as TaskData).task}
            onChange={(e) => setData({ ...data, task: e.target.value })}
          />
        );

      case 'context':
        return (
          <Textarea
            label="Context"
            placeholder="Provide background information..."
            rows={4}
            value={(data as ContextData).context}
            onChange={(e) => setData({ ...data, context: e.target.value })}
          />
        );

      case 'constraints': {
        const constraintsData = data as ConstraintsData;
        return (
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-700">Constraints</label>
            {constraintsData.constraints.map((constraint, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  placeholder={`Constraint ${index + 1}`}
                  value={constraint}
                  onChange={(e) => {
                    const newConstraints = [...constraintsData.constraints];
                    newConstraints[index] = e.target.value;
                    setData({ ...data, constraints: newConstraints });
                  }}
                  className="flex-1"
                />
                <button
                  onClick={() => {
                    const newConstraints = constraintsData.constraints.filter((_, i) => i !== index);
                    setData({ ...data, constraints: newConstraints });
                  }}
                  className="p-2 text-slate-400 hover:text-red-500"
                  disabled={constraintsData.constraints.length === 1}
                >
                  <X size={18} />
                </button>
              </div>
            ))}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setData({ ...data, constraints: [...constraintsData.constraints, ''] });
              }}
            >
              <Plus size={16} className="mr-1" />
              Add Constraint
            </Button>
          </div>
        );
      }

      case 'tone':
        return (
          <Input
            label="Tone"
            placeholder="e.g., professional, casual, friendly"
            value={(data as ToneData).tone}
            onChange={(e) => setData({ ...data, tone: e.target.value })}
          />
        );

      case 'outputFormat': {
        const formatData = data as OutputFormatData;
        return (
          <div className="space-y-4">
            <Select
              label="Format"
              value={formatData.format}
              onChange={(e) => setData({ ...data, format: e.target.value as OutputFormatData['format'] })}
              options={[
                { value: 'plainText', label: 'Plain Text' },
                { value: 'bulletList', label: 'Bullet List' },
                { value: 'json', label: 'JSON' },
              ]}
            />
            {formatData.format === 'json' && (
              <Textarea
                label="JSON Schema (optional)"
                placeholder='{"type": "object", "properties": {...}}'
                rows={6}
                value={formatData.schema}
                onChange={(e) => setData({ ...data, schema: e.target.value })}
              />
            )}
          </div>
        );
      }

      case 'examples': {
        const examplesData = data as ExamplesData;
        return (
          <div className="space-y-4">
            <label className="text-sm font-medium text-slate-700">Examples</label>
            {examplesData.examples.map((example, index) => (
              <div key={index} className="p-3 bg-slate-50 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">Example {index + 1}</span>
                  <button
                    onClick={() => {
                      const newExamples = examplesData.examples.filter((_, i) => i !== index);
                      setData({ ...data, examples: newExamples });
                    }}
                    className="text-slate-400 hover:text-red-500"
                    disabled={examplesData.examples.length === 1}
                  >
                    <X size={16} />
                  </button>
                </div>
                <Textarea
                  placeholder="Input"
                  rows={2}
                  value={example.input}
                  onChange={(e) => {
                    const newExamples = [...examplesData.examples];
                    newExamples[index] = { ...example, input: e.target.value };
                    setData({ ...data, examples: newExamples });
                  }}
                />
                <Textarea
                  placeholder="Output"
                  rows={2}
                  value={example.output}
                  onChange={(e) => {
                    const newExamples = [...examplesData.examples];
                    newExamples[index] = { ...example, output: e.target.value };
                    setData({ ...data, examples: newExamples });
                  }}
                />
              </div>
            ))}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setData({ ...data, examples: [...examplesData.examples, { input: '', output: '' }] });
              }}
            >
              <Plus size={16} className="mr-1" />
              Add Example
            </Button>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit ${definition.label}`}
    >
      <div className="space-y-4">
        {renderFields()}
        <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>
    </Modal>
  );
};
