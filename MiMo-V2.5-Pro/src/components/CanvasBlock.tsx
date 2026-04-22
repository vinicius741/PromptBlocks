import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type {
  BlockInstance,
  ConstraintsData,
  ExamplesData,
  OutputFormatData,
  RoleData,
  TaskData,
  ContextData,
  ToneData,
} from '../types/blocks'
import { BLOCK_DEFINITIONS } from '../types/blocks'

interface CanvasBlockProps {
  block: BlockInstance
  isSelected: boolean
  onSelect: () => void
  onDuplicate: () => void
  onRemove: () => void
}

function getBlockPreview(block: BlockInstance): string {
  switch (block.type) {
    case 'role': {
      const data = block.data as RoleData
      return data.role || 'Empty role'
    }
    case 'task': {
      const data = block.data as TaskData
      return data.task || 'Empty task'
    }
    case 'context': {
      const data = block.data as ContextData
      return data.context || 'Empty context'
    }
    case 'constraints': {
      const data = block.data as ConstraintsData
      const filled = data.items.filter((item) => item.trim() !== '')
      return filled.length > 0
        ? `${filled.length} constraint${filled.length > 1 ? 's' : ''}`
        : 'No constraints'
    }
    case 'tone': {
      const data = block.data as ToneData
      return data.tone || 'No tone set'
    }
    case 'output_format': {
      const data = block.data as OutputFormatData
      const labels: Record<string, string> = {
        plain_text: 'Plain text',
        bullet_list: 'Bullet list',
        json: 'JSON',
      }
      return labels[data.format] || data.format
    }
    case 'examples': {
      const data = block.data as ExamplesData
      const filled = data.examples.filter((ex) => ex.input.trim() || ex.output.trim())
      return filled.length > 0
        ? `${filled.length} example${filled.length > 1 ? 's' : ''}`
        : 'No examples'
    }
    default:
      return 'Unknown block'
  }
}

function getBlockColor(type: string): string {
  return BLOCK_DEFINITIONS.find((b) => b.type === type)?.color || 'bg-gray-500'
}

export function CanvasBlock({
  block,
  isSelected,
  onSelect,
  onDuplicate,
  onRemove,
}: CanvasBlockProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const preview = getBlockPreview(block)
  const color = getBlockColor(block.type)

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative cursor-pointer rounded-lg border bg-white p-3 shadow-sm transition-all hover:shadow-md ${
        isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-slate-200'
      } ${isDragging ? 'opacity-50' : ''}`}
      onClick={(e) => {
        e.stopPropagation()
        onSelect()
      }}
    >
      <div className="flex items-start gap-3">
        <div
          {...attributes}
          {...listeners}
          className="mt-0.5 flex h-6 w-6 shrink-0 cursor-grab items-center justify-center rounded text-slate-400 hover:bg-slate-100 active:cursor-grabbing"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8h16M4 16h16"
            />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${color}`} />
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {block.type.replace('_', ' ')}
            </span>
          </div>
          <p className="mt-1 truncate text-sm text-slate-700">{preview}</p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="absolute -right-1 -top-1 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDuplicate()
          }}
          className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm hover:bg-blue-50 hover:text-blue-600"
          title="Duplicate"
        >
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm hover:bg-red-50 hover:text-red-600"
          title="Remove"
        >
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
