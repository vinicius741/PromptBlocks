import { useDraggable } from "@dnd-kit/core";
import type { BlockDefinition } from "../types/blocks";
("../types/blocks");
import { GripVertical } from "lucide-react";

interface LibraryBlockProps {
  def: BlockDefinition;
  onClick: () => void;
}

export default function LibraryBlock({ def, onClick }: LibraryBlockProps) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `lib-${def.type}`,
  });

  return (
    <div
      ref={setNodeRef}
      className="flex w-full text-left border border-gray-200 rounded-lg bg-white hover:border-blue-400 hover:shadow-sm transition group relative"
    >
      <div
        {...attributes}
        {...listeners}
        className="p-3 text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing border-r border-transparent group-hover:border-gray-100 flex items-center justify-center shrink-0"
      >
        <GripVertical size={16} />
      </div>
      <button
        onClick={onClick}
        className="flex-1 p-3 flex flex-col items-start min-w-0"
      >
        <div className="font-medium text-sm text-gray-800 group-hover:text-blue-700">
          {def.label}
        </div>
        <div className="text-xs text-gray-500 mt-1 truncate w-full text-left">
          {def.description}
        </div>
      </button>
    </div>
  );
}
