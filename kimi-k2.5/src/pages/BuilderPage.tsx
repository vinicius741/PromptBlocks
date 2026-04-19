import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  DndContext,
  type DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { ArrowLeft, Save, Sparkles } from 'lucide-react';
import { BlockLibrary } from '@/components/library/BlockLibrary';
import { Canvas } from '@/components/canvas/Canvas';
import { BlockEditor } from '@/components/editor/BlockEditor';
import { CompiledPanel } from '@/components/panels/CompiledPanel';
import { getProgram, saveProgram } from '@/lib/storage';
import { generateId } from '@/lib/ids';
import type {
  Program,
  BlockInstance,
  BlockType,
} from '@/types/blocks';
import { BLOCK_TYPE_REGISTRY } from '@/types/blocks';

const AUTOSAVE_DELAY = 500;

export function BuilderPage() {
  const { programId } = useParams<{ programId: string }>();
  const navigate = useNavigate();

  const [program, setProgram] = useState<Program | null>(null);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize sensors at the top level
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    })
  );

  // Load program
  useEffect(() => {
    if (!programId) return;

    const loaded = getProgram(programId);
    if (!loaded) {
      navigate('/');
      return;
    }
    setProgram(loaded);
  }, [programId, navigate]);

  // Auto-save with debounce
  const scheduleSave = useCallback((updatedProgram: Program) => {
    setSaveStatus('unsaved');

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      setSaveStatus('saving');
      const toSave = { ...updatedProgram, updatedAt: Date.now() };
      saveProgram(toSave);
      setSaveStatus('saved');
    }, AUTOSAVE_DELAY);
  }, []);

  // Handle manual save
  const handleSaveNow = useCallback(() => {
    if (!program) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    setSaveStatus('saving');
    const toSave = { ...program, updatedAt: Date.now() };
    saveProgram(toSave);
    setSaveStatus('saved');
  }, [program]);

  // Update blocks
  const handleBlocksChange = useCallback(
    (blocks: BlockInstance[]) => {
      if (!program) return;
      const updated = { ...program, blocks };
      setProgram(updated);
      scheduleSave(updated);
    },
    [program, scheduleSave]
  );

  // Update block data
  const handleBlockChange = useCallback(
    (updatedBlock: BlockInstance) => {
      if (!program) return;
      const newBlocks = program.blocks.map((b) =>
        b.id === updatedBlock.id ? updatedBlock : b
      );
      handleBlocksChange(newBlocks);
    },
    [program, handleBlocksChange]
  );

  // Handle drag from library to canvas
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over || !program) return;

      // Only handle drops from library (not reordering)
      if (active.data.current?.type !== 'block-type') return;

      const blockType = active.data.current.blockType as BlockType;
      const config = BLOCK_TYPE_REGISTRY[blockType];

      const newBlock: BlockInstance = {
        id: generateId(),
        type: blockType,
        data: { ...config.defaultData },
      };

      let newBlocks: BlockInstance[];
      if (over.id === 'canvas-empty') {
        newBlocks = [newBlock];
      } else {
        const overIndex = program.blocks.findIndex((b) => b.id === over.id);
        const insertIndex = overIndex >= 0 ? overIndex + 1 : program.blocks.length;
        newBlocks = [...program.blocks];
        newBlocks.splice(insertIndex, 0, newBlock);
      }

      handleBlocksChange(newBlocks);
      setSelectedBlockId(newBlock.id);
    },
    [program, handleBlocksChange]
  );

  // Add block from library click
  const handleAddBlock = useCallback(
    (type: BlockType) => {
      if (!program) return;
      const config = BLOCK_TYPE_REGISTRY[type];

      const newBlock: BlockInstance = {
        id: generateId(),
        type,
        data: { ...config.defaultData },
      };

      const newBlocks = [...program.blocks, newBlock];
      handleBlocksChange(newBlocks);
      setSelectedBlockId(newBlock.id);
    },
    [program, handleBlocksChange]
  );

  // Update program name
  const handleNameChange = useCallback(
    (newName: string) => {
      if (!program) return;
      const updated = { ...program, name: newName };
      setProgram(updated);
      scheduleSave(updated);
    },
    [program, scheduleSave]
  );

  // Cleanup timeout
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Save on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (saveStatus === 'unsaved' && program) {
        saveProgram({ ...program, updatedAt: Date.now() });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [saveStatus, program]);

  if (!program) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  const selectedBlock =
    program.blocks.find((b) => b.id === selectedBlockId) || null;

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="h-screen flex flex-col bg-white">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back</span>
            </Link>

            <div className="h-6 w-px bg-gray-200" />

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <input
                type="text"
                value={program.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="text-lg font-semibold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 -ml-2 min-w-[200px]"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {saveStatus === 'unsaved' && (
              <button
                onClick={handleSaveNow}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                Save now
              </button>
            )}
            <div
              className={`flex items-center gap-1.5 text-sm ${
                saveStatus === 'saved'
                  ? 'text-green-600'
                  : saveStatus === 'saving'
                  ? 'text-yellow-600'
                  : 'text-orange-600'
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  saveStatus === 'saved'
                    ? 'bg-green-500'
                    : saveStatus === 'saving'
                    ? 'bg-yellow-500 animate-pulse'
                    : 'bg-orange-500'
                }`}
              />
              <span className="capitalize">{saveStatus}</span>
            </div>
          </div>
        </header>

        {/* Main Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Block Editor */}
          <div className="w-80 shrink-0">
            <BlockEditor
              block={selectedBlock}
              onChange={handleBlockChange}
              onClose={() => setSelectedBlockId(null)}
            />
          </div>

          {/* Center: Canvas */}
          <div className="flex-1 min-w-0">
            <Canvas
              blocks={program.blocks}
              selectedBlockId={selectedBlockId}
              onBlocksChange={handleBlocksChange}
              onSelectBlock={setSelectedBlockId}
            />
          </div>

          {/* Right: Block Library */}
          <div className="w-72 shrink-0">
            <BlockLibrary onBlockClick={handleAddBlock} />
          </div>
        </div>

        {/* Bottom: Compiled Panel */}
        <div className="h-64 shrink-0 border-t border-gray-200">
          <CompiledPanel
            blocks={program.blocks}
            saveStatus={saveStatus}
            onSaveNow={handleSaveNow}
          />
        </div>
      </div>
    </DndContext>
  );
}
