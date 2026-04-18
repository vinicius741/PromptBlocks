import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { BlockInstance } from '@/types/blocks';
import CanvasBlock from './CanvasBlock';

interface CanvasProps {
  blocks: BlockInstance[];
  onEdit: (id: string) => void;
  onRemove: (id: string) => void;
  onDuplicate: (id: string) => void;
  selectedId: string | null;
}

export default function Canvas({
  blocks,
  onEdit,
  onRemove,
  onDuplicate,
  selectedId,
}: CanvasProps) {
  const { setNodeRef, isOver } = useDroppable({ id: 'canvas' });

  return (
    <div
      ref={setNodeRef}
      className={`flex min-h-[400px] flex-1 flex-col gap-2 overflow-y-auto rounded-lg border-2 border-dashed p-4 transition-colors ${
        isOver ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white'
      }`}
    >
      <SortableContext
        items={blocks.map((b) => b.id)}
        strategy={verticalListSortingStrategy}
      >
        {blocks.length === 0 ? (
          <div className="flex flex-1 items-center justify-center text-gray-400">
            <p>Drag blocks here from the library</p>
          </div>
        ) : (
          blocks.map((block) => (
            <CanvasBlock
              key={block.id}
              block={block}
              onEdit={onEdit}
              onRemove={onRemove}
              onDuplicate={onDuplicate}
              isSelected={block.id === selectedId}
            />
          ))
        )}
      </SortableContext>
    </div>
  );
}
