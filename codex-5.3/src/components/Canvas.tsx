import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { BlockInstance } from '../types/blocks'
import { CanvasBlock } from './CanvasBlock'

export const CANVAS_DROP_ID = 'canvas-drop'

interface CanvasProps {
  blocks: BlockInstance[]
  selectedBlockId: string | null
  onSelectBlock: (blockId: string) => void
  onDuplicateBlock: (blockId: string) => void
  onRemoveBlock: (blockId: string) => void
}

export function Canvas({
  blocks,
  selectedBlockId,
  onSelectBlock,
  onDuplicateBlock,
  onRemoveBlock,
}: CanvasProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: CANVAS_DROP_ID,
  })

  return (
    <section
      ref={setNodeRef}
      className={`h-full min-h-[340px] overflow-y-auto rounded-2xl border-2 border-dashed p-4 ${
        isOver ? 'border-sky-500 bg-sky-50/70' : 'border-slate-300 bg-white/70'
      }`}
    >
      <header className="mb-4">
        <h2 className="text-lg font-bold text-slate-900">Canvas</h2>
        <p className="text-sm text-slate-600">
          Arrange blocks top-to-bottom. The compiled prompt follows this order.
        </p>
      </header>

      <SortableContext
        items={blocks.map((block) => block.id)}
        strategy={verticalListSortingStrategy}
      >
        <ul className="space-y-3">
          {blocks.map((block) => (
            <CanvasBlock
              key={block.id}
              block={block}
              isSelected={selectedBlockId === block.id}
              onSelect={() => onSelectBlock(block.id)}
              onDuplicate={() => onDuplicateBlock(block.id)}
              onRemove={() => onRemoveBlock(block.id)}
            />
          ))}
        </ul>
      </SortableContext>

      {blocks.length === 0 ? (
        <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-600">
          Drop blocks here to start building your prompt.
        </div>
      ) : null}
    </section>
  )
}
