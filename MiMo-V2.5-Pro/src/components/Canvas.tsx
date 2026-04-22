import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { BlockInstance } from '../types/blocks'
import { CanvasBlock } from './CanvasBlock'

interface CanvasProps {
  blocks: BlockInstance[]
  selectedBlockId: string | null
  onSelectBlock: (id: string | null) => void
  onDuplicateBlock: (id: string) => void
  onRemoveBlock: (id: string) => void
}

export function Canvas({
  blocks,
  selectedBlockId,
  onSelectBlock,
  onDuplicateBlock,
  onRemoveBlock,
}: CanvasProps) {
  const { setNodeRef, isOver } = useDroppable({ id: 'canvas' })

  return (
    <div ref={setNodeRef} className="flex-1 overflow-y-auto p-4">
      <div
        className={`min-h-full rounded-xl border-2 border-dashed p-3 transition-colors ${
          isOver ? 'border-blue-400 bg-blue-50' : 'border-slate-200 bg-white'
        }`}
        onClick={() => onSelectBlock(null)}
      >
        {blocks.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-slate-400">
            <p className="text-sm">Drag blocks here to build your prompt</p>
          </div>
        ) : (
          <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {blocks.map((block) => (
                <CanvasBlock
                  key={block.id}
                  block={block}
                  isSelected={block.id === selectedBlockId}
                  onSelect={() => onSelectBlock(block.id)}
                  onDuplicate={() => onDuplicateBlock(block.id)}
                  onRemove={() => onRemoveBlock(block.id)}
                />
              ))}
            </div>
          </SortableContext>
        )}
      </div>
    </div>
  )
}
