import { useState, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  type DragOverEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { BlockInstance, BlockType } from '@/types/blocks';
import { BLOCK_TYPE_REGISTRY } from '@/types/blocks';
import { generateId } from '@/lib/ids';
import { CanvasBlock } from './CanvasBlock';
import { Plus } from 'lucide-react';

interface CanvasProps {
  blocks: BlockInstance[];
  selectedBlockId: string | null;
  onBlocksChange: (blocks: BlockInstance[]) => void;
  onSelectBlock: (id: string | null) => void;
}

export function Canvas({
  blocks,
  selectedBlockId,
  onBlocksChange,
  onSelectBlock,
}: CanvasProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) {
      setDragOverIndex(null);
      return;
    }

    // If dragging from library, calculate drop index
    if (active.data.current?.type === 'block-type' && over.id !== 'canvas-empty') {
      const overIndex = blocks.findIndex((b) => b.id === over.id);
      setDragOverIndex(overIndex >= 0 ? overIndex : blocks.length);
    }
  }, [blocks]);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);
      setDragOverIndex(null);

      if (!over) return;

      // Handle dropping a new block from the library
      if (active.data.current?.type === 'block-type') {
        const blockType = active.data.current.blockType as BlockType;
        const config = BLOCK_TYPE_REGISTRY[blockType];

        const newBlock: BlockInstance = {
          id: generateId(),
          type: blockType,
          data: { ...config.defaultData },
        };

        let newBlocks: BlockInstance[];
        if (over.id === 'canvas-empty') {
          // Drop on empty canvas
          newBlocks = [newBlock];
        } else {
          // Drop at specific position
          const overIndex = blocks.findIndex((b) => b.id === over.id);
          const insertIndex = overIndex >= 0 ? overIndex + 1 : blocks.length;
          newBlocks = [...blocks];
          newBlocks.splice(insertIndex, 0, newBlock);
        }

        onBlocksChange(newBlocks);
        onSelectBlock(newBlock.id);
        return;
      }

      // Handle reordering existing blocks
      if (active.data.current?.type === 'block-instance') {
        if (active.id !== over.id) {
          const oldIndex = blocks.findIndex((b) => b.id === active.id);
          const newIndex = blocks.findIndex((b) => b.id === over.id);

          if (oldIndex !== -1 && newIndex !== -1) {
            onBlocksChange(arrayMove(blocks, oldIndex, newIndex));
          }
        }
      }
    },
    [blocks, onBlocksChange, onSelectBlock]
  );

  const handleRemoveBlock = useCallback(
    (id: string) => {
      const newBlocks = blocks.filter((b) => b.id !== id);
      onBlocksChange(newBlocks);
      if (selectedBlockId === id) {
        onSelectBlock(null);
      }
    },
    [blocks, selectedBlockId, onBlocksChange, onSelectBlock]
  );

  const handleDuplicateBlock = useCallback(
    (id: string) => {
      const block = blocks.find((b) => b.id === id);
      if (!block) return;

      const blockIndex = blocks.findIndex((b) => b.id === id);
      const duplicatedBlock: BlockInstance = {
        ...block,
        id: generateId(),
      };

      const newBlocks = [...blocks];
      newBlocks.splice(blockIndex + 1, 0, duplicatedBlock);
      onBlocksChange(newBlocks);
      onSelectBlock(duplicatedBlock.id);
    },
    [blocks, onBlocksChange, onSelectBlock]
  );

  const activeBlock = activeId ? blocks.find((b) => b.id === activeId) : null;

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Canvas</h2>
        <span className="text-sm text-gray-500">
          {blocks.length} block{blocks.length !== 1 ? 's' : ''}
        </span>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div
          className="flex-1 overflow-y-auto p-4"
          onClick={() => onSelectBlock(null)}
        >
          {blocks.length === 0 ? (
            <EmptyCanvas dragOverIndex={dragOverIndex} />
          ) : (
            <SortableContext
              items={blocks.map((b) => b.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="max-w-2xl mx-auto">
                {blocks.map((block) => (
                  <CanvasBlock
                    key={block.id}
                    block={block}
                    isSelected={block.id === selectedBlockId}
                    onSelect={() => onSelectBlock(block.id)}
                    onRemove={() => handleRemoveBlock(block.id)}
                    onDuplicate={() => handleDuplicateBlock(block.id)}
                  />
                ))}
                {/* Drop zone at the end */}
                <div
                  id="canvas-end"
                  className={`
                    h-12 rounded-lg border-2 border-dashed flex items-center justify-center
                    transition-colors duration-150
                    ${dragOverIndex === blocks.length ? 'border-blue-400 bg-blue-50' : 'border-gray-300'}
                  `}
                >
                  <span className="text-sm text-gray-400">Drop blocks here</span>
                </div>
              </div>
            </SortableContext>
          )}
        </div>

        <DragOverlay>
          {activeBlock ? (
            <CanvasBlock
              block={activeBlock}
              isSelected={false}
              onSelect={() => {}}
              onRemove={() => {}}
              onDuplicate={() => {}}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

function EmptyCanvas({ dragOverIndex }: { dragOverIndex: number | null }) {
  return (
    <div className="h-full flex items-center justify-center">
      <div
        id="canvas-empty"
        className={`
          w-full max-w-md p-12 rounded-xl border-2 border-dashed text-center
          transition-colors duration-150
          ${dragOverIndex === 0 ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-white'}
        `}
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <Plus className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Start Building</h3>
        <p className="text-sm text-gray-500">
          Drag blocks from the library on the right, or click a block to add it
        </p>
      </div>
    </div>
  );
}