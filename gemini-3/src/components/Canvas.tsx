import React from 'react';
import { 
  SortableContext, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import type { BlockInstance } from '../types/blocks';
import CanvasBlock from './CanvasBlock';

interface CanvasProps {
  blocks: BlockInstance[];
  onEditBlock: (id: string) => void;
  onRemoveBlock: (id: string) => void;
  onDuplicateBlock: (block: BlockInstance) => void;
}

const Canvas: React.FC<CanvasProps> = ({ 
  blocks, 
  onEditBlock, 
  onRemoveBlock, 
  onDuplicateBlock 
}) => {
  if (blocks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl bg-white/50">
        <div className="bg-white p-4 rounded-full shadow-sm mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <p className="text-gray-500 font-medium">Drag blocks from the library to start building</p>
        <p className="text-xs text-gray-400 mt-1">Order matters! Blocks compile from top to bottom.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4 pb-20">
      <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
        {blocks.map((block) => (
          <CanvasBlock 
            key={block.id} 
            block={block} 
            onEdit={() => onEditBlock(block.id)}
            onRemove={() => onRemoveBlock(block.id)}
            onDuplicate={() => onDuplicateBlock(block)}
          />
        ))}
      </SortableContext>
    </div>
  );
};

export default Canvas;
