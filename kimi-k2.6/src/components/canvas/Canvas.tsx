import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { BlockInstance } from '../../types/blocks'
import { CanvasBlock } from './CanvasBlock'

interface CanvasProps {
  blocks: BlockInstance[]
  selectedBlockId: string | null
  onSelect: (id: string) => void
  onRemove: (id: string) => void
  onDuplicate: (id: string) => void
}

export function Canvas({ blocks, selectedBlockId, onSelect, onRemove, onDuplicate }: CanvasProps) {
  const { setNodeRef, isOver } = useDroppable({ id: 'canvas-drop' })

  return (
    <div
      ref={setNodeRef}
      className={[
        'flex-1 bg-white border border-gray-200 rounded-lg p-4 overflow-y-auto',
        isOver ? 'bg-blue-50 border-blue-300' : '',
      ].join(' ')}
    >
      {blocks.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-gray-400 min-h-[12rem]">
          <p className="text-sm mb-2">Canvas is empty</p>
          <p className="text-xs">Drag blocks from the library or click Add</p>
        </div>
      ) : (
        <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
          {blocks.map((block) => (
            <CanvasBlock
              key={block.id}
              block={block}
              isSelected={selectedBlockId === block.id}
              onSelect={onSelect}
              onRemove={onRemove}
              onDuplicate={onDuplicate}
            />
          ))}
        </SortableContext>
      )}
    </div>
  )
}
