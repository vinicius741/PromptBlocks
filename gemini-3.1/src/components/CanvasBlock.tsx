import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, Copy, Edit2 } from "lucide-react";
import { BLOCK_DEFINITIONS } from "../types/blocks";
import type { BlockInstance } from "../types/blocks";

interface CanvasBlockProps {
  block: BlockInstance;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export default function CanvasBlock({
  block,
  isSelected,
  onSelect,
  onDelete,
  onDuplicate,
}: CanvasBlockProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const definition = BLOCK_DEFINITIONS.find((d) => d.type === block.type);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group bg-white border rounded-xl overflow-hidden shadow-sm transition-all ${
        isSelected
          ? "border-blue-500 ring-2 ring-blue-100"
          : "border-gray-200 hover:border-blue-300"
      }`}
      onClick={(e) => {
        // Prevent sorting events from triggering click
        if (e.defaultPrevented) return;
        onSelect();
      }}
    >
      <div className="flex items-center">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="p-3 text-gray-400 cursor-grab hover:text-gray-600 active:cursor-grabbing hover:bg-gray-50 h-full flex items-center justify-center shrink-0 border-r border-transparent group-hover:border-gray-100 transition"
        >
          <GripVertical size={16} />
        </div>

        {/* Content Preview */}
        <div className="flex-1 p-3 px-4 min-w-0 flex flex-col justify-center">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-800 text-sm">
              {definition?.label || block.type}
            </span>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              {block.type}
            </span>
          </div>
          <div className="text-sm text-gray-500 truncate mt-1">
            {Object.values(block.data).find(
              (v) => typeof v === "string" && v.trim() !== "",
            ) || "Empty block"}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 p-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-l from-white via-white to-transparent pl-6 pr-3 h-full shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
            title="Edit"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
            className="p-1.5 text-green-600 hover:bg-green-50 rounded"
            title="Duplicate"
          >
            <Copy size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
