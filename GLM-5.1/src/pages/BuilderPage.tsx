import { useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { getProgram, saveProgram } from '@/lib/storage';
import { generateId } from '@/lib/ids';
import { compilePrompt } from '@/lib/compiler';
import { useAutoSave } from '@/hooks/useAutoSave';
import { BLOCK_TYPES } from '@/types/blocks';
import type { Program, BlockInstance, BlockData } from '@/types/blocks';
import BlockLibrary from '@/components/BlockLibrary';
import Canvas from '@/components/Canvas';
import BlockEditor from '@/components/BlockEditor';
import CompiledPanel from '@/components/CompiledPanel';

export default function BuilderPage() {
  const { programId } = useParams<{ programId: string }>();
  const navigate = useNavigate();

  const [program, setProgram] = useState<Program>(() => {
    const p = getProgram(programId!);
    if (!p) {
      navigate('/programs', { replace: true });
      return {} as Program;
    }
    return p;
  });

  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const handleSave = useCallback(
    (p: Program) => {
      saveProgram({ ...p, updatedAt: new Date().toISOString() });
    },
    [],
  );

  const { saved, saveNow } = useAutoSave(program, handleSave);

  const compiled = useMemo(() => compilePrompt(program.blocks), [program.blocks]);

  const editingBlock = useMemo(
    () => program.blocks.find((b) => b.id === editingBlockId) ?? null,
    [program.blocks, editingBlockId],
  );

  const updateBlocks = useCallback(
    (blocks: BlockInstance[]) => {
      setProgram((prev) => ({ ...prev, blocks, updatedAt: new Date().toISOString() }));
    },
    [],
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    // Dropping from library
    if (active.data.current?.fromLibrary) {
      const blockType = active.data.current.blockType;
      const meta = BLOCK_TYPES.find((m) => m.type === blockType);
      if (!meta) return;
      const newBlock: BlockInstance = {
        id: generateId(),
        type: meta.type,
        data: meta.defaultData(),
      };
      updateBlocks([...program.blocks, newBlock]);
      setEditingBlockId(newBlock.id);
      return;
    }

    // Reordering within canvas
    if (active.id !== over.id) {
      const oldIndex = program.blocks.findIndex((b) => b.id === active.id);
      const newIndex = program.blocks.findIndex((b) => b.id === over.id);
      if (oldIndex >= 0 && newIndex >= 0) {
        updateBlocks(arrayMove(program.blocks, oldIndex, newIndex));
      }
    }
  };

  const handleEdit = (id: string) => {
    setEditingBlockId(editingBlockId === id ? null : id);
  };

  const handleRemove = (id: string) => {
    updateBlocks(program.blocks.filter((b) => b.id !== id));
    if (editingBlockId === id) setEditingBlockId(null);
  };

  const handleDuplicate = (id: string) => {
    const block = program.blocks.find((b) => b.id === id);
    if (!block) return;
    const idx = program.blocks.indexOf(block);
    const dup: BlockInstance = {
      ...block,
      id: generateId(),
      data: structuredClone(block.data),
    };
    const next = [...program.blocks];
    next.splice(idx + 1, 0, dup);
    updateBlocks(next);
  };

  const handleBlockDataChange = (data: BlockData) => {
    if (!editingBlockId) return;
    updateBlocks(
      program.blocks.map((b) => (b.id === editingBlockId ? { ...b, data } : b)),
    );
  };

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/programs')}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-gray-900">{program.name}</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs ${saved ? 'text-green-600' : 'text-amber-500'}`}>
            {saved ? 'Saved' : 'Saving...'}
          </span>
          <button
            onClick={saveNow}
            className="rounded border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50"
          >
            Save now
          </button>
        </div>
      </div>

      {/* Main content */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-1 overflow-hidden">
          {/* Editor panel */}
          <div className="w-80 shrink-0 overflow-y-auto border-r border-gray-200 bg-gray-50 p-4">
            {editingBlock ? (
              <BlockEditor
                block={editingBlock}
                onChange={handleBlockDataChange}
                onClose={() => setEditingBlockId(null)}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-center text-sm text-gray-400">
                Select a block to edit
              </div>
            )}
          </div>

          {/* Canvas */}
          <div className="flex-1 overflow-y-auto p-4">
            <Canvas
              blocks={program.blocks}
              onEdit={handleEdit}
              onRemove={handleRemove}
              onDuplicate={handleDuplicate}
              selectedId={editingBlockId}
            />
          </div>

          {/* Block Library */}
          <BlockLibrary />
        </div>
        <DragOverlay>
          {activeId?.startsWith('library-') ? (
            <div className="rounded-lg border border-gray-300 bg-white p-3 shadow-lg opacity-80">
              Drag to canvas
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Compiled prompt panel */}
      <div className="border-t border-gray-200 bg-white p-4">
        <CompiledPanel text={compiled} />
      </div>
    </div>
  );
}
