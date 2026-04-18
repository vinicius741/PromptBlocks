import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { BlockInstance } from '@/types/blocks';
import { BLOCK_TYPES } from '@/types/blocks';

interface CanvasBlockProps {
  block: BlockInstance;
  onEdit: (id: string) => void;
  onRemove: (id: string) => void;
  onDuplicate: (id: string) => void;
  isSelected: boolean;
}

export default function CanvasBlock({
  block,
  onEdit,
  onRemove,
  onDuplicate,
  isSelected,
}: CanvasBlockProps) {
  const meta = BLOCK_TYPES.find((m) => m.type === block.type);
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

  const label = meta?.label ?? block.type;
  const color = meta?.color ?? 'bg-gray-400';

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 rounded-lg border bg-white p-3 shadow-sm transition-all ${
        isDragging ? 'z-10 opacity-60 shadow-lg' : ''
      } ${isSelected ? 'border-blue-400 ring-2 ring-blue-100' : 'border-gray-200'}`}
    >
      <div
        className="cursor-grab select-none text-gray-400 hover:text-gray-600"
        {...attributes}
        {...listeners}
      >
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm6 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm6 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm6 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" />
        </svg>
      </div>
      <div className={`h-3 w-3 shrink-0 rounded-full ${color}`} />
      <button
        onClick={() => onEdit(block.id)}
        className="flex-1 text-left text-sm font-medium text-gray-800 hover:text-blue-600"
      >
        {label}
      </button>
      <div className="flex shrink-0 gap-1">
        <button
          onClick={() => onDuplicate(block.id)}
          className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          title="Duplicate"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H3m0 0l4-4m-4 4l4 4m11-4h-4m0 0l4-4m-4 4l4 4" />
          </svg>
        </button>
        <button
          onClick={() => onRemove(block.id)}
          className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
          title="Remove"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
