import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Save, ChevronLeft, Download } from "lucide-react";

import { BLOCK_DEFINITIONS } from "../types/blocks";
import type { BlockInstance, BlockType } from "../types/blocks";
import { getProgram, saveProgram } from "../lib/storage";
import { generateId } from "../lib/ids";
import { compilePrompt } from "../lib/compiler";

import Canvas from "../components/Canvas";
import BlockEditor from "../components/BlockEditor";
import LibraryBlock from "../components/LibraryBlock";

export default function BuilderPage() {
  const { programId } = useParams();
  const navigate = useNavigate();

  const [program, setProgram] = useState(() =>
    programId ? getProgram(programId) : null,
  );
  const [blocks, setBlocks] = useState<BlockInstance[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [compiledPrompt, setCompiledPrompt] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    if (programId) {
      const p = getProgram(programId);
      if (p) {
        setProgram(p);
        setBlocks(p.blocks);
        setCompiledPrompt(compilePrompt(p.blocks));
      } else {
        navigate("/programs");
      }
    }
  }, [programId, navigate]);

  const saveToStorage = useCallback(
    (updatedBlocks: BlockInstance[]) => {
      if (!program) return;
      setIsSaving(true);
      const updatedProgram = {
        ...program,
        blocks: updatedBlocks,
        updatedAt: Date.now(),
      };
      saveProgram(updatedProgram);
      setProgram(updatedProgram);
      setCompiledPrompt(compilePrompt(updatedBlocks));

      setTimeout(() => setIsSaving(false), 500);
    },
    [program],
  );

  // Auto-save debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      saveToStorage(blocks);
    }, 500);
    return () => clearTimeout(timer);
  }, [blocks, saveToStorage]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      // Check if it's from the library
      if ((active.id as string).startsWith("lib-")) {
        const type = (active.id as string).replace("lib-", "") as BlockType;
        const def = BLOCK_DEFINITIONS.find((d) => d.type === type);

        if (def) {
          const newBlock: BlockInstance = {
            id: generateId(),
            type,
            data: { ...def.defaultData },
          };

          if (over.id === "canvas-droppable") {
            setBlocks((items) => [...items, newBlock]);
          } else {
            setBlocks((items) => {
              const overIndex = items.findIndex((item) => item.id === over.id);
              return [
                ...items.slice(0, overIndex),
                newBlock,
                ...items.slice(overIndex),
              ];
            });
          }
        }
      } else {
        // Reordering
        setBlocks((items) => {
          const oldIndex = items.findIndex((item) => item.id === active.id);
          const newIndex = items.findIndex((item) => item.id === over.id);
          return arrayMove(items, oldIndex, newIndex);
        });
      }
    } else if (
      (active.id as string).startsWith("lib-") &&
      over.id === "canvas-droppable"
    ) {
      // Handle dragging library item onto empty canvas
      const type = (active.id as string).replace("lib-", "") as BlockType;
      const def = BLOCK_DEFINITIONS.find((d) => d.type === type);
      if (def) {
        const newBlock: BlockInstance = {
          id: generateId(),
          type,
          data: { ...def.defaultData },
        };
        setBlocks((items) => [...items, newBlock]);
      }
    }
  };

  const addBlock = (type: BlockType) => {
    const def = BLOCK_DEFINITIONS.find((d) => d.type === type);
    if (def) {
      const newBlock: BlockInstance = {
        id: generateId(),
        type,
        data: JSON.parse(JSON.stringify(def.defaultData)), // Deep copy
      };
      setBlocks([...blocks, newBlock]);
      setSelectedBlockId(newBlock.id);
    }
  };

  const updateBlock = (id: string, data: Record<string, any>) => {
    setBlocks(blocks.map((b) => (b.id === id ? { ...b, data } : b)));
  };

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter((b) => b.id !== id));
    if (selectedBlockId === id) setSelectedBlockId(null);
  };

  const duplicateBlock = (id: string) => {
    const blockToCopy = blocks.find((b) => b.id === id);
    if (!blockToCopy) return;

    const newBlock: BlockInstance = {
      ...blockToCopy,
      id: generateId(),
      data: JSON.parse(JSON.stringify(blockToCopy.data)),
    };

    const index = blocks.findIndex((b) => b.id === id);
    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, newBlock);

    setBlocks(newBlocks);
    setSelectedBlockId(newBlock.id);
  };

  if (!program) return <div>Loading...</div>;

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId);

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* Header */}
      <header className="flex justify-between items-center h-14 px-6 bg-white border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/programs")}
            className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-md transition"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-gray-900 leading-none">
              {program.name}
            </h1>
            <span className="text-xs text-gray-500 mt-1">
              {isSaving ? "Saving..." : "Saved"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => saveToStorage(blocks)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition"
          >
            <Save size={16} /> Save Now
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {/* Main Canvas Area */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex-1 overflow-y-auto p-8 flex justify-center">
              <div className="w-full max-w-2xl">
                <Canvas
                  blocks={blocks}
                  selectedBlockId={selectedBlockId}
                  onSelect={setSelectedBlockId}
                  onDelete={deleteBlock}
                  onDuplicate={duplicateBlock}
                />
              </div>
            </div>
            {/* Bottom Panel: Compiled Prompt */}
            <div className="h-64 border-t border-gray-200 bg-white flex flex-col shrink-0">
              <div className="flex justify-between items-center px-6 py-2 border-b border-gray-100 bg-gray-50">
                <h3 className="font-semibold text-gray-700 text-sm">
                  Compiled Prompt
                </h3>
                <button
                  onClick={() => navigator.clipboard.writeText(compiledPrompt)}
                  className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600 transition"
                >
                  <Download size={14} /> Copy Output
                </button>
              </div>
              <textarea
                className="flex-1 w-full p-4 resize-none focus:outline-none font-mono text-sm text-gray-800 bg-gray-50/50"
                readOnly
                value={compiledPrompt}
                placeholder="Your compiled prompt will appear here..."
              />
            </div>
          </div>

          {/* Right Sidebar: Editor or Library */}
          <div className="w-80 border-l border-gray-200 bg-white flex flex-col shrink-0">
            {selectedBlock ? (
              <BlockEditor
                block={selectedBlock}
                onUpdate={(data) => updateBlock(selectedBlock.id, data)}
                onClose={() => setSelectedBlockId(null)}
              />
            ) : (
              <div className="flex flex-col h-full">
                <div className="p-4 border-b border-gray-100 bg-gray-50/80">
                  <h2 className="font-semibold text-gray-800">Block Library</h2>
                  <p className="text-xs text-gray-500 mt-1">Click to add</p>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  {BLOCK_DEFINITIONS.map((def) => (
                    <LibraryBlock
                      key={def.type}
                      def={def}
                      onClick={() => addBlock(def.type)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          <DragOverlay>
            {activeId ? (
              <div className="bg-white border-2 border-blue-500 shadow-xl rounded-lg p-3 opacity-90 cursor-grabbing text-sm font-medium text-blue-700 flex items-center gap-2">
                {activeId.startsWith("lib-")
                  ? BLOCK_DEFINITIONS.find((d) => `lib-${d.type}` === activeId)
                      ?.label
                  : blocks.find((b) => b.id === activeId)?.type}{" "}
                Block
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
