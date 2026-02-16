import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { BLOCK_LIBRARY } from '../types/blocks'
import type { BlockDefinition } from '../types/blocks'

interface LibraryDragData {
  source: 'library'
  blockType: BlockDefinition['type']
}

export function BlockLibrary() {
  return (
    <aside className="h-full overflow-y-auto border-l border-slate-200 bg-white/90 p-4 backdrop-blur">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-900">Block Library</h2>
        <p className="text-sm text-slate-600">
          Drag a block into the canvas to assemble your prompt.
        </p>
      </div>

      <div className="space-y-3">
        {BLOCK_LIBRARY.map((definition) => (
          <LibraryItem key={definition.type} definition={definition} />
        ))}
      </div>
    </aside>
  )
}

function LibraryItem({ definition }: { definition: BlockDefinition }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `library-${definition.type}`,
      data: {
        source: 'library',
        blockType: definition.type,
      } satisfies LibraryDragData,
    })

  const style = {
    transform: CSS.Translate.toString(transform),
  }

  return (
    <button
      className={`w-full rounded-xl border p-3 text-left shadow-sm transition ${
        isDragging
          ? 'border-sky-400 bg-sky-50 opacity-70'
          : 'border-slate-200 bg-slate-50 hover:border-sky-300 hover:bg-sky-50/60'
      }`}
      ref={setNodeRef}
      style={style}
      type="button"
      {...attributes}
      {...listeners}
    >
      <p className="font-semibold text-slate-900">{definition.label}</p>
      <p className="mt-1 text-xs text-slate-600">{definition.description}</p>
    </button>
  )
}
