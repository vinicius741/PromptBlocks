import { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { getProgram, saveProgram } from '@/lib/storage';
import { generateId } from '@/lib/ids';
import { BLOCK_TYPES, type BlockInstance, type BlockType, type BlockData } from '@/types/blocks';
import { BlockLibrary } from '@/components/BlockLibrary';
import { Canvas } from '@/components/Canvas';
import { CompiledPanel } from '@/components/CompiledPanel';
import { BlockEditor } from '@/components/BlockEditor';

export function BuilderPage() {
  const { programId } = useParams<{ programId: string }>();
  const navigate = useNavigate();
  const [program, setProgram] = useState(getProgram(programId || ''));
  const [editingBlock, setEditingBlock] = useState<BlockInstance | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Load program
  useEffect(() => {
    const loaded = getProgram(programId || '');
    if (!loaded) {
      navigate('/programs');
      return;
    }
    setProgram(loaded);
  }, [programId, navigate]);

  // Save program
  const handleSave = useCallback(() => {
    if (program) {
      saveProgram(program);
      setLastSaved(new Date());
    }
  }, [program]);

  // Auto-save with debounce
  useEffect(() => {
    if (!program) return;
    const timeout = setTimeout(() => {
      handleSave();
    }, 500);
    return () => clearTimeout(timeout);
  }, [program, handleSave]);

  // Drag handlers
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!program) return;

    // Dropping from library (create new block)
    if (active.data.current?.isNew) {
      const blockType = active.data.current.type as BlockType;
      const blockMeta = BLOCK_TYPES.find((b) => b.type === blockType);
      if (!blockMeta) return;

      const newBlock: BlockInstance = {
        id: generateId(),
        type: blockType,
        data: blockMeta.defaultData,
      };

      // Determine insert position
      let insertIndex = program.blocks.length;
      if (over && over.id !== 'canvas') {
        const overIndex = program.blocks.findIndex((b) => b.id === over.id);
        if (overIndex >= 0) {
          insertIndex = overIndex;
        }
      }

      const newBlocks = [...program.blocks];
      newBlocks.splice(insertIndex, 0, newBlock);

      setProgram({ ...program, blocks: newBlocks });
      setEditingBlock(newBlock);
      return;
    }

    // Reordering existing blocks
    if (over && active.id !== over.id && over.id !== 'canvas') {
      const oldIndex = program.blocks.findIndex((b) => b.id === active.id);
      const newIndex = program.blocks.findIndex((b) => b.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        setProgram({
          ...program,
          blocks: arrayMove(program.blocks, oldIndex, newIndex),
        });
      }
    }
  };

  // Block actions
  const handleEditBlock = (block: BlockInstance) => {
    setEditingBlock(block);
  };

  const handleSaveBlock = (data: BlockData) => {
    if (!program || !editingBlock) return;
    setProgram({
      ...program,
      blocks: program.blocks.map((b) =>
        b.id === editingBlock.id ? { ...b, data } : b
      ),
    });
  };

  const handleDuplicateBlock = (blockId: string) => {
    if (!program) return;
    const blockIndex = program.blocks.findIndex((b) => b.id === blockId);
    if (blockIndex === -1) return;

    const block = program.blocks[blockIndex];
    const newBlock: BlockInstance = {
      ...block,
      id: generateId(),
    };

    const newBlocks = [...program.blocks];
    newBlocks.splice(blockIndex + 1, 0, newBlock);
    setProgram({ ...program, blocks: newBlocks });
  };

  const handleRemoveBlock = (blockId: string) => {
    if (!program) return;
    setProgram({
      ...program,
      blocks: program.blocks.filter((b) => b.id !== blockId),
    });
  };

  if (!program) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-screen flex-col">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/programs')}
              className="text-gray-600 hover:text-gray-800"
            >
              ← Back
            </button>
            <h1 className="text-lg font-semibold text-gray-800">{program.name}</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">
              {lastSaved ? `Saved ${lastSaved.toLocaleTimeString()}` : 'Not saved'}
            </span>
            <button
              onClick={handleSave}
              className="rounded bg-blue-600 px-3 py-1 text-sm text-white transition hover:bg-blue-700"
            >
              Save Now
            </button>
          </div>
        </header>

        {/* Main content */}
        <div className="flex flex-1 overflow-hidden">
          <Canvas
            blocks={program.blocks}
            onEditBlock={handleEditBlock}
            onDuplicateBlock={handleDuplicateBlock}
            onRemoveBlock={handleRemoveBlock}
          />
          <BlockLibrary />
        </div>

        {/* Compiled panel */}
        <CompiledPanel blocks={program.blocks} />
      </div>

      {/* Block Editor Modal */}
      {editingBlock && (
        <BlockEditor
          block={editingBlock}
          onSave={handleSaveBlock}
          onClose={() => setEditingBlock(null)}
        />
      )}

      {/* Drag Overlay */}
      <DragOverlay>
        {activeId && (
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
            <p className="text-gray-600">Moving block...</p>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
