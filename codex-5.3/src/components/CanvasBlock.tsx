import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { blockLabel, summarizeBlock } from '../lib/blocks'
import type { BlockInstance } from '../types/blocks'

interface CanvasBlockProps {
  block: BlockInstance
  isSelected: boolean
  onSelect: () => void
  onDuplicate: () => void
  onRemove: () => void
}

export function CanvasBlock({
  block,
  isSelected,
  onSelect,
  onDuplicate,
  onRemove,
}: CanvasBlockProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: block.id,
    data: {
      source: 'canvas',
      blockId: block.id,
      blockType: block.type,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <li
      className={`rounded-xl border p-4 shadow-sm transition ${
        isSelected
          ? 'border-sky-500 bg-sky-50/70 shadow-sky-100'
          : 'border-slate-200 bg-white hover:border-sky-200'
      } ${isDragging ? 'opacity-50' : ''}`}
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-slate-900">
            {blockLabel(block.type)}
          </p>
          <p className="mt-1 text-sm text-slate-600">{summarizeBlock(block)}</p>
        </div>
        <button
          className="rounded-md border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100"
          type="button"
          {...attributes}
          {...listeners}
          onClick={(event) => {
            event.stopPropagation()
          }}
        >
          Drag
        </button>
      </div>

      <div className="flex gap-2">
        <button
          className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
          onClick={(event) => {
            event.stopPropagation()
            onDuplicate()
          }}
          type="button"
        >
          Duplicate
        </button>
        <button
          className="rounded-md border border-rose-200 px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-50"
          onClick={(event) => {
            event.stopPropagation()
            onRemove()
          }}
          type="button"
        >
          Remove
        </button>
      </div>
    </li>
  )
}
