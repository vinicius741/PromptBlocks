import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { BlockInstance } from "../types/blocks";
import CanvasBlock from "./CanvasBlock";

interface CanvasProps {
  blocks: BlockInstance[];
  selectedBlockId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
}

export default function Canvas({
  blocks,
  selectedBlockId,
  onSelect,
  onDelete,
  onDuplicate,
}: CanvasProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: "canvas-droppable",
  });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[400px] border-2 border-dashed rounded-xl p-4 transition ${
        blocks.length === 0
          ? "border-gray-300 bg-white/50 flex flex-col items-center justify-center"
          : isOver
            ? "border-blue-400 bg-blue-50/20"
            : "border-transparent"
      }`}
    >
      {blocks.length === 0 && (
        <div className="text-center text-gray-400 p-8">
          <p className="mb-2 font-medium">Canvas is empty</p>
          <p className="text-sm">
            Drag blocks here or click to add from library
          </p>
        </div>
      )}

      <SortableContext
        items={blocks.map((b) => b.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3 w-full">
          {blocks.map((block) => (
            <CanvasBlock
              key={block.id}
              block={block}
              isSelected={selectedBlockId === block.id}
              onSelect={() => onSelect(block.id)}
              onDelete={() => onDelete(block.id)}
              onDuplicate={() => onDuplicate(block.id)}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
