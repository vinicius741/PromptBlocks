import { useDraggable } from '@dnd-kit/core'
import { BLOCK_DEFINITIONS } from '../types/blocks'
import type { BlockDefinition } from '../types/blocks'

export function BlockLibrary() {
  return (
    <aside className="flex h-full w-64 flex-col border-l border-slate-200 bg-white">
      <div className="border-b border-slate-200 p-4">
        <h2 className="text-sm font-semibold text-slate-900">Block Library</h2>
        <p className="mt-0.5 text-xs text-slate-500">Drag blocks to the canvas</p>
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        <div className="space-y-2">
          {BLOCK_DEFINITIONS.map((def) => (
            <LibraryBlock key={def.type} definition={def} />
          ))}
        </div>
      </div>
    </aside>
  )
}

function LibraryBlock({ definition }: { definition: BlockDefinition }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `library-${definition.type}`,
    data: {
      source: 'library',
      blockType: definition.type,
    },
  })

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`flex cursor-grab items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 transition hover:border-slate-300 hover:bg-white active:cursor-grabbing ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className={`h-3 w-3 rounded-full ${definition.color}`} />
      <div>
        <p className="text-sm font-medium text-slate-800">{definition.label}</p>
        <p className="text-xs text-slate-500">{definition.description}</p>
      </div>
    </div>
  )
}
