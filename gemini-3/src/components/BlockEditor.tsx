import React from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import type { BlockInstance, RoleData, TaskData, ContextData, ConstraintsData, ToneData, OutputFormatData, ExamplesData } from '../types/blocks';

interface BlockEditorProps {
  block: BlockInstance | null;
  onClose: () => void;
  onUpdate: (data: any) => void;
}

const BlockEditor: React.FC<BlockEditorProps> = ({ block, onClose, onUpdate }) => {
  if (!block) return null;

  const renderFields = () => {
    switch (block.type) {
      case 'role': {
        const data = block.data as RoleData;
        return (
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-semibold text-gray-700">Role Name</span>
              <input
                type="text"
                value={data.role}
                onChange={(e) => onUpdate({ ...data, role: e.target.value })}
                placeholder="e.g. Senior Software Engineer"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              />
            </label>
            <p className="text-xs text-gray-500 italic">"You are a {"{{role}}"}"</p>
          </div>
        );
      }
      case 'task': {
        const data = block.data as TaskData;
        return (
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-semibold text-gray-700">Task Description</span>
              <textarea
                rows={4}
                value={data.task}
                onChange={(e) => onUpdate({ ...data, task: e.target.value })}
                placeholder="e.g. write a Python script that scrapes headlines from a news site."
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              />
            </label>
            <p className="text-xs text-gray-500 italic">"Your task: {"{{task}}"}"</p>
          </div>
        );
      }
      case 'context': {
        const data = block.data as ContextData;
        return (
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-semibold text-gray-700">Context / Background</span>
              <textarea
                rows={4}
                value={data.context}
                onChange={(e) => onUpdate({ ...data, context: e.target.value })}
                placeholder="e.g. The user is a beginner learning programming."
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              />
            </label>
            <p className="text-xs text-gray-500 italic">"Context: {"{{context}}"}"</p>
          </div>
        );
      }
      case 'constraints': {
        const data = block.data as ConstraintsData;
        const updateConstraint = (index: number, value: string) => {
          const newList = [...data.constraints];
          newList[index] = value;
          onUpdate({ ...data, constraints: newList });
        };
        const removeConstraint = (index: number) => {
          const newList = data.constraints.filter((_, i) => i !== index);
          onUpdate({ ...data, constraints: newList });
        };
        const addConstraint = () => {
          onUpdate({ ...data, constraints: [...data.constraints, ''] });
        };

        return (
          <div className="space-y-4">
            <span className="text-sm font-semibold text-gray-700">List of Constraints</span>
            <div className="space-y-2">
              {data.constraints.map((c, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={c}
                    onChange={(e) => updateConstraint(i, e.target.value)}
                    placeholder="e.g. Use simple language"
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  />
                  <button onClick={() => removeConstraint(i)} className="text-gray-400 hover:text-red-500">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={addConstraint}
              className="flex items-center gap-1 text-sm text-blue-600 font-medium hover:text-blue-700"
            >
              <Plus size={16} /> Add Constraint
            </button>
          </div>
        );
      }
      case 'tone': {
        const data = block.data as ToneData;
        return (
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-semibold text-gray-700">Tone</span>
              <input
                type="text"
                value={data.tone}
                onChange={(e) => onUpdate({ ...data, tone: e.target.value })}
                placeholder="e.g. Professional and concise"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              />
            </label>
            <p className="text-xs text-gray-500 italic">"Tone: {"{{tone}}"}"</p>
          </div>
        );
      }
      case 'output_format': {
        const data = block.data as OutputFormatData;
        return (
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-semibold text-gray-700">Format</span>
              <select
                value={data.format}
                onChange={(e) => onUpdate({ ...data, format: e.target.value as any })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border bg-white"
              >
                <option value="plain text">Plain Text</option>
                <option value="bullet list">Bullet List</option>
                <option value="JSON">JSON</option>
              </select>
            </label>
            {data.format === 'JSON' && (
              <label className="block mt-4">
                <span className="text-sm font-semibold text-gray-700">JSON Schema (Optional)</span>
                <textarea
                  rows={4}
                  value={data.schema || ''}
                  onChange={(e) => onUpdate({ ...data, schema: e.target.value })}
                  placeholder='{ "type": "object", ... }'
                  className="mt-1 block w-full font-mono text-xs rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                />
              </label>
            )}
          </div>
        );
      }
      case 'examples': {
        const data = block.data as ExamplesData;
        const updateExample = (index: number, field: 'input' | 'output', value: string) => {
          const newList = [...data.examples];
          newList[index] = { ...newList[index], [field]: value };
          onUpdate({ ...data, examples: newList });
        };
        const removeExample = (index: number) => {
          const newList = data.examples.filter((_, i) => i !== index);
          onUpdate({ ...data, examples: newList });
        };
        const addExample = () => {
          onUpdate({ ...data, examples: [...data.examples, { input: '', output: '' }] });
        };

        return (
          <div className="space-y-6">
            <span className="text-sm font-semibold text-gray-700">Examples (Few-shot)</span>
            <div className="space-y-4">
              {data.examples.map((ex, i) => (
                <div key={i} className="p-3 border border-gray-100 bg-gray-50 rounded-lg space-y-2 relative group">
                  <button 
                    onClick={() => removeExample(i)} 
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={14} />
                  </button>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Example {i + 1}</span>
                  </div>
                  <textarea
                    rows={2}
                    value={ex.input}
                    onChange={(e) => updateExample(i, 'input', e.target.value)}
                    placeholder="Input..."
                    className="w-full text-xs rounded border-gray-300 p-2 border"
                  />
                  <textarea
                    rows={2}
                    value={ex.output}
                    onChange={(e) => updateExample(i, 'output', e.target.value)}
                    placeholder="Output..."
                    className="w-full text-xs rounded border-gray-300 p-2 border"
                  />
                </div>
              ))}
            </div>
            <button
              onClick={addExample}
              className="flex items-center gap-1 text-sm text-blue-600 font-medium hover:text-blue-700"
            >
              <Plus size={16} /> Add Example
            </button>
          </div>
        );
      }
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-end bg-black/20 backdrop-blur-sm">
      <div className="w-full max-w-md h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-lg font-bold text-gray-800 capitalize">{block.type.replace('_', ' ')} Block</h2>
            <p className="text-xs text-gray-500">Edit the properties of this block</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {renderFields()}
        </div>
        <div className="p-4 border-t bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlockEditor;
