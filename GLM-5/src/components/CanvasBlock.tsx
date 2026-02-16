import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { getBlockTypeMeta, type BlockInstance } from '@/types/blocks';

interface CanvasBlockProps {
  block: BlockInstance;
  onEdit: () => void;
  onDuplicate: () => void;
  onRemove: () => void;
}

function getBlockPreview(block: BlockInstance): string {
  switch (block.type) {
    case 'role':
      return (block.data as { role: string }).role || 'No role defined';
    case 'task':
      return (block.data as { task: string }).task || 'No task defined';
    case 'context':
      return (block.data as { context: string }).context || 'No context provided';
    case 'constraints':
      return `${(block.data as { items: string[] }).items.length} constraints`;
    case 'tone':
      return (block.data as { tone: string }).tone || 'No tone specified';
    case 'output-format': {
      const formatData = block.data as { format: string };
      return `Format: ${formatData.format}`;
    }
    case 'examples':
      return `${(block.data as { examples: unknown[] }).examples.length} examples`;
    default:
      return 'Unknown block type';
  }
}

export function CanvasBlock({ block, onEdit, onDuplicate, onRemove }: CanvasBlockProps) {
  const blockMeta = getBlockTypeMeta(block.type);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
    data: { block },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className={`h-3 w-3 rounded-full bg-${blockMeta.color}`} />
            <span className="font-medium text-gray-800">{blockMeta.label}</span>
          </div>
          <p className="mt-1 line-clamp-2 text-sm text-gray-600">{getBlockPreview(block)}</p>
        </div>
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab px-2 py-1 text-gray-400 hover:text-gray-600 active:cursor-grabbing"
        >
          ⋮⋮
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <button
          onClick={onEdit}
          className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700 transition hover:bg-gray-200"
        >
          Edit
        </button>
        <button
          onClick={onDuplicate}
          className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700 transition hover:bg-gray-200"
        >
          Duplicate
        </button>
        <button
          onClick={onRemove}
          className="rounded bg-red-50 px-2 py-1 text-xs text-red-600 transition hover:bg-red-100"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
