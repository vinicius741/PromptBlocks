import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Copy, Settings2 } from 'lucide-react';
import type { BlockInstance } from '../types/blocks';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CanvasBlockProps {
  block: BlockInstance;
  onEdit: () => void;
  onRemove: () => void;
  onDuplicate: () => void;
}

const CanvasBlock: React.FC<CanvasBlockProps> = ({ 
  block, 
  onEdit, 
  onRemove, 
  onDuplicate 
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getPreviewText = () => {
    switch (block.type) {
      case 'role': return (block.data as any).role || 'Enter role...';
      case 'task': return (block.data as any).task || 'Enter task...';
      case 'context': return (block.data as any).context || 'Enter context...';
      case 'constraints': {
        const items = (block.data as any).constraints || [];
        return items.length > 0 ? items.filter((i: string) => i).join(', ') : 'Add constraints...';
      }
      case 'tone': return (block.data as any).tone || 'Enter tone...';
      case 'output_format': return (block.data as any).format;
      case 'examples': {
        const items = (block.data as any).examples || [];
        return `${items.length} examples`;
      }
      default: return '';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group bg-white border border-gray-200 rounded-xl shadow-sm transition-all overflow-hidden",
        isDragging && "opacity-50 scale-[1.02] shadow-xl z-50 border-blue-400 ring-4 ring-blue-50",
        !isDragging && "hover:border-blue-300"
      )}
    >
      <div className="flex items-stretch min-h-[80px]">
        {/* Drag Handle */}
        <div 
          {...attributes} 
          {...listeners}
          className="w-10 flex items-center justify-center bg-gray-50 border-r border-gray-100 cursor-grab active:cursor-grabbing text-gray-400 hover:text-blue-500 transition-colors"
        >
          <GripVertical size={18} />
        </div>

        {/* Content Preview */}
        <div 
          className="flex-1 p-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
          onClick={onEdit}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              {block.type.replace('_', ' ')}
            </span>
          </div>
          <p className="text-sm text-gray-700 line-clamp-2 font-medium">
            {getPreviewText() || <span className="text-gray-300 italic">Empty</span>}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col border-l border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={onEdit}
            className="flex-1 px-3 hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
            title="Edit"
          >
            <Settings2 size={16} />
          </button>
          <button 
            onClick={onDuplicate}
            className="flex-1 px-3 hover:bg-gray-50 text-gray-400 hover:text-gray-700 transition-colors"
            title="Duplicate"
          >
            <Copy size={16} />
          </button>
          <button 
            onClick={onRemove}
            className="flex-1 px-3 hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
            title="Remove"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CanvasBlock;
