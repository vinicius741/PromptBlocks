import { useDraggable } from '@dnd-kit/core'
import type { BlockType } from '../../types/blocks'

const BLOCK_TYPES: { type: BlockType; label: string; description: string }[] = [
  { type: 'role', label: 'Role', description: 'You are a {{role}}' },
  { type: 'task', label: 'Task', description: 'Your task: {{task}}' },
  { type: 'context', label: 'Context', description: 'Context: {{context}}' },
  { type: 'constraints', label: 'Constraints', description: 'List of bullet constraints' },
  { type: 'tone', label: 'Tone', description: 'Tone: {{tone}}' },
  { type: 'outputFormat', label: 'Output Format', description: 'Choose output format' },
  { type: 'examples', label: 'Examples', description: 'Input/output example pairs' },
]

interface BlockLibraryProps {
  onAdd: (type: BlockType) => void
}

function LibraryItem({
  type,
  label,
  description,
  onAdd,
}: {
  type: BlockType
  label: string
  description: string
  onAdd: (type: BlockType) => void
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `library-${type}`,
    data: { type },
  })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between gap-2 p-3 mb-2 bg-white border border-gray-200 rounded-md shadow-sm hover:border-blue-300 cursor-grab active:cursor-grabbing"
      {...listeners}
      {...attributes}
    >
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900">{label}</div>
        <div className="text-xs text-gray-500 truncate">{description}</div>
      </div>
      <button
        className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 shrink-0"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation()
          onAdd(type)
        }}
      >
        Add
      </button>
    </div>
  )
}

export function BlockLibrary({ onAdd }: BlockLibraryProps) {
  return (
    <div className="w-64 bg-gray-50 border-l border-gray-200 p-4 flex flex-col h-full">
      <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Library</h2>
      <div className="flex-1 overflow-y-auto">
        {BLOCK_TYPES.map((bt) => (
          <LibraryItem key={bt.type} {...bt} onAdd={onAdd} />
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-2">Drag or click to add blocks</p>
    </div>
  )
}
