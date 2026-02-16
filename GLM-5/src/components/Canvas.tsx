import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { BlockInstance } from '@/types/blocks';
import { CanvasBlock } from './CanvasBlock';

interface CanvasProps {
  blocks: BlockInstance[];
  onEditBlock: (block: BlockInstance) => void;
  onDuplicateBlock: (blockId: string) => void;
  onRemoveBlock: (blockId: string) => void;
}

export function Canvas({ blocks, onEditBlock, onDuplicateBlock, onRemoveBlock }: CanvasProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas',
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 overflow-y-auto p-6 ${
        isOver ? 'bg-blue-50' : 'bg-gray-100'
      } transition-colors`}
    >
      {blocks.length === 0 ? (
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <div className="mb-2 text-4xl text-gray-300">📦</div>
            <p className="text-gray-500">Drag blocks from the library to start building</p>
          </div>
        </div>
      ) : (
        <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
          <div className="mx-auto max-w-2xl space-y-3">
            {blocks.map((block) => (
              <CanvasBlock
                key={block.id}
                block={block}
                onEdit={() => onEditBlock(block)}
                onDuplicate={() => onDuplicateBlock(block.id)}
                onRemove={() => onRemoveBlock(block.id)}
              />
            ))}
          </div>
        </SortableContext>
      )}
    </div>
  );
}
