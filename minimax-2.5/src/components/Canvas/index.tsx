import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { BlockInstance } from '../../types/blocks';
import { CanvasBlock } from '../CanvasBlock';
import { Blocks } from 'lucide-react';

interface CanvasProps {
  blocks: BlockInstance[];
  selectedBlockId: string | null;
  onSelectBlock: (id: string | null) => void;
  onDuplicateBlock: (id: string) => void;
  onDeleteBlock: (id: string) => void;
}

export const Canvas: React.FC<CanvasProps> = ({
  blocks,
  selectedBlockId,
  onSelectBlock,
  onDuplicateBlock,
  onDeleteBlock,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas',
    data: {
      type: 'canvas',
    },
  });

  return (
    <div className="flex-1 bg-slate-50 p-6 overflow-y-auto">
      <div
        ref={setNodeRef}
        className={`min-h-[500px] rounded-xl border-2 border-dashed transition-all ${
          isOver
            ? 'border-primary bg-primary/5'
            : blocks.length === 0
            ? 'border-slate-300 bg-slate-100'
            : 'border-transparent'
        }`}
        onClick={() => onSelectBlock(null)}
      >
        {blocks.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center py-20 text-slate-400">
            <Blocks size={48} className="mb-4 opacity-50" />
            <p className="text-lg font-medium">Drop blocks here</p>
            <p className="text-sm">Drag blocks from the library to get started</p>
          </div>
        ) : (
          <SortableContext
            items={blocks.map(b => b.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3 p-2">
              {blocks.map((block) => (
                <CanvasBlock
                  key={block.id}
                  block={block}
                  isSelected={selectedBlockId === block.id}
                  onSelect={() => onSelectBlock(block.id)}
                  onDuplicate={() => onDuplicateBlock(block.id)}
                  onDelete={() => onDeleteBlock(block.id)}
                />
              ))}
            </div>
          </SortableContext>
        )}
      </div>
    </div>
  );
};
