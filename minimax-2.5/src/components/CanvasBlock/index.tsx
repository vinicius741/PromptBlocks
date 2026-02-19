import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { BlockInstance, getBlockDefinition } from '../../types/blocks';
import { getBlockPreview } from '../../lib/compiler';
import { User, Target, FileText, AlertTriangle, Music, Layout, BookOpen, GripVertical, Copy, Trash2 } from 'lucide-react';

const iconMap: Record<string, React.ComponentType<any>> = {
  User,
  Target,
  FileText,
  AlertTriangle,
  Music,
  Layout,
  BookOpen,
};

interface CanvasBlockProps {
  block: BlockInstance;
  isSelected: boolean;
  onSelect: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export const CanvasBlock: React.FC<CanvasBlockProps> = ({
  block,
  isSelected,
  onSelect,
  onDuplicate,
  onDelete,
}) => {
  const definition = getBlockDefinition(block.type);
  const Icon = iconMap[definition.icon];
  const preview = getBlockPreview(block);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: block.id,
    data: {
      type: 'block',
      block,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative flex items-start gap-3 p-4 rounded-lg border transition-all ${
        isDragging
          ? 'shadow-lg border-primary opacity-90 z-50'
          : isSelected
          ? 'border-primary bg-primary/5'
          : 'border-slate-200 bg-white hover:border-slate-300'
      }`}
      onClick={onSelect}
    >
      <div
        {...attributes}
        {...listeners}
        className="mt-1 cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500"
      >
        <GripVertical size={18} />
      </div>

      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${definition.color}15` }}
      >
        <Icon size={20} style={{ color: definition.color }} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded"
            style={{ backgroundColor: `${definition.color}15`, color: definition.color }}
          >
            {definition.label}
          </span>
        </div>
        <div className="text-sm text-slate-600 truncate">{preview}</div>
      </div>

      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate();
          }}
          className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600"
          title="Duplicate"
        >
          <Copy size={16} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-500"
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};
