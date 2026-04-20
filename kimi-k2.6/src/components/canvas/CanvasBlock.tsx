import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { BlockInstance, BlockType } from '../../types/blocks'

const TYPE_LABELS: Record<BlockType, string> = {
  role: 'Role',
  task: 'Task',
  context: 'Context',
  constraints: 'Constraints',
  tone: 'Tone',
  outputFormat: 'Output Format',
  examples: 'Examples',
}

function summarizeBlock(block: BlockInstance): string {
  const d = block.data as unknown as Record<string, unknown>
  switch (block.type) {
    case 'role':
      return (d.role as string) || 'Empty role'
    case 'task':
      return (d.task as string) || 'Empty task'
    case 'context':
      return (d.context as string) || 'Empty context'
    case 'constraints': {
      const items = (d.items as string[]) || []
      const count = items.filter((i) => i.trim()).length
      return count ? `${count} constraint(s)` : 'Empty constraints'
    }
    case 'tone':
      return (d.tone as string) || 'Empty tone'
    case 'outputFormat':
      return `Format: ${(d.format as string) || 'plain'}`
    case 'examples': {
      const ex = (d.examples as { input?: string; output?: string }[]) || []
      return `${ex.length} example(s)`
    }
    default:
      return ''
  }
}

interface CanvasBlockProps {
  block: BlockInstance
  isSelected: boolean
  onSelect: (id: string) => void
  onRemove: (id: string) => void
  onDuplicate: (id: string) => void
}

export function CanvasBlock({
  block,
  isSelected,
  onSelect,
  onRemove,
  onDuplicate,
}: CanvasBlockProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={[
        'relative flex items-start gap-3 p-3 mb-2 bg-white border rounded-md shadow-sm group',
        isSelected
          ? 'border-blue-500 ring-1 ring-blue-500'
          : 'border-gray-200 hover:border-gray-300',
      ].join(' ')}
      onClick={() => onSelect(block.id)}
    >
      <button
        className="mt-1 p-1 rounded text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <circle cx="4" cy="4" r="1.5" />
          <circle cx="8" cy="4" r="1.5" />
          <circle cx="12" cy="4" r="1.5" />
          <circle cx="4" cy="8" r="1.5" />
          <circle cx="8" cy="8" r="1.5" />
          <circle cx="12" cy="8" r="1.5" />
          <circle cx="4" cy="12" r="1.5" />
          <circle cx="8" cy="12" r="1.5" />
          <circle cx="12" cy="12" r="1.5" />
        </svg>
      </button>

      <div className="flex-1 min-w-0">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          {TYPE_LABELS[block.type]}
        </div>
        <div className="text-sm text-gray-800 truncate">{summarizeBlock(block)}</div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          className="text-xs px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 text-gray-600"
          onClick={(e) => {
            e.stopPropagation()
            onDuplicate(block.id)
          }}
        >
          Duplicate
        </button>
        <button
          className="text-xs px-2 py-1 rounded border border-red-200 hover:bg-red-50 text-red-600"
          onClick={(e) => {
            e.stopPropagation()
            onRemove(block.id)
          }}
        >
          Remove
        </button>
      </div>
    </div>
  )
}
