import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { ArrowLeft, Save, Check, RefreshCw } from 'lucide-react';
import type { Program, BlockInstance, BlockType, BlockData } from '../types/blocks';
import { getProgram, saveProgram } from '../lib/storage';
import { generateId } from '../lib/ids';
import { compilePrompt } from '../lib/compiler';
import { BlockLibrary } from '../components/BlockLibrary';
import { Canvas } from '../components/Canvas';
import { CompiledPanel } from '../components/CompiledPanel';
import { BlockEditor } from '../components/BlockEditor';

const DEFAULT_DATA: Record<BlockType, BlockData> = {
  role: { role: '' },
  task: { task: '' },
  context: { context: '' },
  constraints: { constraints: [''] },
  tone: { tone: '' },
  output_format: { format: 'plain text' },
  examples: { examples: [{ input: '', output: '' }] },
};

export default function BuilderPage() {
  const { programId } = useParams<{ programId: string }>();
  const navigate = useNavigate();
  const [program, setProgram] = useState<Program | null>(null);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    if (programId) {
      const p = getProgram(programId);
      if (p) {
        setProgram(p);
        setLastSaved(new Date(p.updatedAt));
      } else {
        navigate('/programs');
      }
    }
  }, [programId, navigate]);

  const save = useCallback(
    (p: Program) => {
      setIsSaving(true);
      const updated = saveProgram(p);
      setProgram(updated);
      setLastSaved(new Date(updated.updatedAt));
      setTimeout(() => setIsSaving(false), 500);
    },
    []
  );

  useEffect(() => {
    if (!program) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      save(program);
    }, 500);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [program, save]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id && program) {
      const oldIndex = program.blocks.findIndex((b) => b.id === active.id);
      const newIndex = program.blocks.findIndex((b) => b.id === over.id);
      setProgram({
        ...program,
        blocks: arrayMove(program.blocks, oldIndex, newIndex),
      });
    }
  };

  const addBlock = (type: BlockType) => {
    if (!program) return;
    const newBlock: BlockInstance = {
      id: generateId(),
      type,
      data: structuredClone(DEFAULT_DATA[type]),
    };
    setProgram({ ...program, blocks: [...program.blocks, newBlock] });
    setEditingBlockId(newBlock.id);
  };

  const updateBlockData = (blockId: string, data: BlockInstance['data']) => {
    if (!program) return;
    setProgram({
      ...program,
      blocks: program.blocks.map((b) => (b.id === blockId ? { ...b, data } : b)),
    });
  };

  const removeBlock = (blockId: string) => {
    if (!program) return;
    setProgram({
      ...program,
      blocks: program.blocks.filter((b) => b.id !== blockId),
    });
    if (editingBlockId === blockId) setEditingBlockId(null);
  };

  const duplicateBlock = (block: BlockInstance) => {
    if (!program) return;
    const newBlock: BlockInstance = { ...block, id: generateId() };
    const index = program.blocks.findIndex((b) => b.id === block.id);
    const newBlocks = [...program.blocks];
    newBlocks.splice(index + 1, 0, newBlock);
    setProgram({ ...program, blocks: newBlocks });
  };

  if (!program) return null;

  const compiledPrompt = compilePrompt(program.blocks);

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/programs" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-gray-800">{program.name}</h1>
            <p className="text-xs text-gray-500">
              {isSaving ? (
                <span className="flex items-center gap-1 text-blue-500">
                  <RefreshCw size={10} className="animate-spin" /> Saving...
                </span>
              ) : (
                <span className="flex items-center gap-1 text-green-500">
                  <Check size={10} /> Saved {lastSaved?.toLocaleTimeString()}
                </span>
              )}
            </p>
          </div>
        </div>
        <button
          onClick={() => save(program)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <Save size={16} />
          Save Now
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <Canvas
              blocks={program.blocks}
              onEditBlock={setEditingBlockId}
              onRemoveBlock={removeBlock}
              onDuplicateBlock={duplicateBlock}
            />
          </DndContext>
        </main>

        <aside className="w-64 bg-white border-l border-gray-200 p-4 overflow-y-auto">
          <BlockLibrary onAddBlock={addBlock} />
        </aside>
      </div>

      <footer className="h-64 bg-white border-t border-gray-200 p-6 flex flex-col">
        <CompiledPanel prompt={compiledPrompt} />
      </footer>

      {editingBlockId && (
        <BlockEditor
          block={program.blocks.find((b) => b.id === editingBlockId) || null}
          onClose={() => setEditingBlockId(null)}
          onUpdate={(data) => updateBlockData(editingBlockId, data)}
        />
      )}
    </div>
  );
}
