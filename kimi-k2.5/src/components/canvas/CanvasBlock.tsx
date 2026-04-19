import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import type { BlockInstance, BlockTypeConfig } from '@/types/blocks';
import { BLOCK_TYPE_REGISTRY } from '@/types/blocks';
import {
  User,
  Target,
  Info,
  Shield,
  MessageSquare,
  FileOutput,
  BookOpen,
  GripVertical,
  Trash2,
  Copy,
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  User,
  Target,
  Info,
  Shield,
  MessageSquare,
  FileOutput,
  BookOpen,
};

interface CanvasBlockProps {
  block: BlockInstance;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
  onDuplicate: () => void;
}

export function CanvasBlock({
  block,
  isSelected,
  onSelect,
  onRemove,
  onDuplicate,
}: CanvasBlockProps) {
  const [showActions, setShowActions] = useState(false);

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
      type: 'block-instance',
      instanceId: block.id,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const config: BlockTypeConfig = BLOCK_TYPE_REGISTRY[block.type];
  const Icon = iconMap[config.icon];

  const getBlockPreview = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = block.data as Record<string, any>;

    switch (block.type) {
      case 'role':
        return (data.role as string) || 'No role defined';
      case 'task':
        return (data.task as string) || 'No task defined';
      case 'context':
        return (data.context as string) || 'No context provided';
      case 'constraints': {
        const constraints = (data.constraints as string[]) || [];
        return constraints.filter((c: string) => c.trim()).length > 0
          ? `${constraints.filter((c: string) => c.trim()).length} constraint(s)`
          : 'No constraints';
      }
      case 'tone':
        return (data.tone as string) || 'No tone set';
      case 'output_format': {
        const format = (data.format as string) || 'plain_text';
        return `Format: ${format.replace('_', ' ')}`;
      }
      case 'examples': {
        const examples = (data.examples as { input: string; output: string }[]) || [];
        return `${examples.length} example(s)`;
      }
      default:
        return '';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      className={`
        relative group mb-3 bg-white border-2 rounded-lg p-4 cursor-pointer
        transition-all duration-150
        ${isSelected ? 'border-blue-500 shadow-md' : 'border-gray-200 hover:border-gray-300'}
        ${isDragging ? 'opacity-50 rotate-2' : 'opacity-100'}
      `}
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute left-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="w-5 h-5" />
      </div>

      {/* Content */}
      <div className="pl-8 pr-20">
        <div className="flex items-center gap-2 mb-1">
          <div className={`w-6 h-6 rounded ${config.color} flex items-center justify-center`}>
            {Icon && <Icon className="w-3.5 h-3.5 text-white" />}
          </div>
          <span className="text-sm font-medium text-gray-900">{config.label}</span>
        </div>
        <p className="text-sm text-gray-500 truncate">{getBlockPreview()}</p>
      </div>

      {/* Actions */}
      <div
        className={`
          absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1
          transition-opacity duration-150
          ${showActions || isSelected ? 'opacity-100' : 'opacity-0'}
        `}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate();
          }}
          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
          title="Duplicate"
        >
          <Copy className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
          title="Remove"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}