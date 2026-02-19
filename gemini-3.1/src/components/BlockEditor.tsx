import { X, Plus, Trash2 } from "lucide-react";
import { BLOCK_DEFINITIONS } from "../types/blocks";
import type { BlockInstance } from "../types/blocks";

interface BlockEditorProps {
  block: BlockInstance;
  onUpdate: (data: Record<string, any>) => void;
  onClose: () => void;
}

export default function BlockEditor({
  block,
  onUpdate,
  onClose,
}: BlockEditorProps) {
  const definition = BLOCK_DEFINITIONS.find((d) => d.type === block.type);
  const data = block.data;

  const handleUpdate = (key: string, value: any) => {
    onUpdate({ ...data, [key]: value });
  };

  const renderFields = () => {
    switch (block.type) {
      case "Role":
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role Description
            </label>
            <textarea
              value={data.role || ""}
              onChange={(e) => handleUpdate("role", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 h-32 text-sm"
              placeholder="e.g. Expert Software Engineer"
            />
          </div>
        );
      case "Task":
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Task
            </label>
            <textarea
              value={data.task || ""}
              onChange={(e) => handleUpdate("task", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 h-32 text-sm"
              placeholder="e.g. Write a script to..."
            />
          </div>
        );
      case "Context":
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Context
            </label>
            <textarea
              value={data.context || ""}
              onChange={(e) => handleUpdate("context", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 h-40 text-sm"
              placeholder="Background information..."
            />
          </div>
        );
      case "Tone":
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tone
            </label>
            <input
              type="text"
              value={data.tone || ""}
              onChange={(e) => handleUpdate("tone", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="e.g. Professional and concise"
            />
          </div>
        );
      case "Constraints": {
        const constraints = data.constraints || [""];
        return (
          <div className="flex flex-col h-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Constraints
            </label>
            <div className="space-y-2 flex-1 overflow-y-auto">
              {constraints.map((c: string, i: number) => (
                <div key={i} className="flex gap-2 items-start">
                  <textarea
                    value={c}
                    onChange={(e) => {
                      const newConstraints = [...constraints];
                      newConstraints[i] = e.target.value;
                      handleUpdate("constraints", newConstraints);
                    }}
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm min-h-[40px]"
                    placeholder="Constraint..."
                  />
                  <button
                    onClick={() => {
                      const newConstraints = constraints.filter(
                        (_: any, index: number) => index !== i,
                      );
                      handleUpdate("constraints", newConstraints);
                    }}
                    className="p-2 text-gray-400 hover:text-red-500 mt-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => handleUpdate("constraints", [...constraints, ""])}
              className="mt-3 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium py-2"
            >
              <Plus size={16} /> Add Constraint
            </button>
          </div>
        );
      }
      case "OutputFormat":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Format Type
              </label>
              <select
                value={data.format || "plain text"}
                onChange={(e) => handleUpdate("format", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
              >
                <option value="plain text">Plain Text</option>
                <option value="bullet list">Bullet List</option>
                <option value="JSON">JSON</option>
                <option value="markdown">Markdown</option>
              </select>
            </div>
            {(data.format === "JSON" || data.format === "markdown") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Schema / Details
                </label>
                <textarea
                  value={data.schema || ""}
                  onChange={(e) => handleUpdate("schema", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 h-32 text-sm font-mono"
                  placeholder={
                    data.format === "JSON"
                      ? '{"type": "object", ...}'
                      : "Expected markdown structure"
                  }
                />
              </div>
            )}
          </div>
        );
      case "Examples": {
        const examples = data.examples || [];
        return (
          <div className="flex flex-col h-full overflow-hidden">
            <label className="block text-sm font-medium text-gray-700 mb-2 shrink-0">
              Examples
            </label>
            <div className="space-y-4 flex-1 overflow-y-auto pr-1">
              {examples.map((ex: any, i: number) => (
                <div
                  key={i}
                  className="bg-gray-50 border border-gray-200 p-3 rounded-lg relative group"
                >
                  <button
                    onClick={() => {
                      const newEx = examples.filter(
                        (_: any, index: number) => index !== i,
                      );
                      handleUpdate("examples", newEx);
                    }}
                    className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                  >
                    <X size={14} />
                  </button>
                  <div className="text-xs font-semibold text-gray-500 mb-2 uppercase">
                    Example {i + 1}
                  </div>
                  <div className="space-y-2">
                    <textarea
                      value={ex.input}
                      onChange={(e) => {
                        const newEx = [...examples];
                        newEx[i] = { ...newEx[i], input: e.target.value };
                        handleUpdate("examples", newEx);
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm min-h-[60px]"
                      placeholder="Input..."
                    />
                    <textarea
                      value={ex.output}
                      onChange={(e) => {
                        const newEx = [...examples];
                        newEx[i] = { ...newEx[i], output: e.target.value };
                        handleUpdate("examples", newEx);
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm min-h-[60px]"
                      placeholder="Expected Output..."
                    />
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() =>
                handleUpdate("examples", [
                  ...examples,
                  { input: "", output: "" },
                ])
              }
              className="mt-3 shrink-0 flex items-center justify-center gap-1 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md py-2 w-full transition font-medium"
            >
              <Plus size={16} /> Add Example
            </button>
          </div>
        );
      }
      default:
        return (
          <div className="text-gray-500 text-sm">
            No editor available for this block type.
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/80 shrink-0">
        <div>
          <h2 className="font-semibold text-gray-800">
            {definition?.label || block.type}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">Edit block content</p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-md transition"
        >
          <X size={18} />
        </button>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">{renderFields()}</div>
    </div>
  );
}
