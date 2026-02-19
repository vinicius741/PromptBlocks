import React from 'react';
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
import { ArrowLeft, Save } from 'lucide-react';
import { BlockLibrary } from '../components/BlockLibrary';
import { Canvas } from '../components/Canvas';
import { BlockEditor } from '../components/BlockEditor';
import { CompiledPanel } from '../components/CompiledPanel';
import { SaveIndicator } from '../components/SaveIndicator';
import { Button, Input } from '../components/ui';
import { Program, BlockInstance, BlockTypeDefinition } from '../types/blocks';
import { getProgram, saveProgram } from '../lib/storage';
import { compileBlocks } from '../lib/compiler';
import { generateId } from '../lib/ids';

export const BuilderPage: React.FC = () => {
  const { programId } = useParams<{ programId: string }>();
  const navigate = useNavigate();
  
  const [program, setProgram] = React.useState<Program | null>(null);
  const [blocks, setBlocks] = React.useState<BlockInstance[]>([]);
  const [selectedBlockId, setSelectedBlockId] = React.useState<string | null>(null);
  const [saveStatus, setSaveStatus] = React.useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [isEditingName, setIsEditingName] = React.useState(false);
  const [editName, setEditName] = React.useState('');
  const [activeBlockType, setActiveBlockType] = React.useState<BlockTypeDefinition | null>(null);
  
  const saveTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  React.useEffect(() => {
    if (programId) {
      const loadedProgram = getProgram(programId);
      if (loadedProgram) {
        setProgram(loadedProgram);
        setBlocks(loadedProgram.blocks);
        setEditName(loadedProgram.name);
      } else {
        navigate('/programs');
      }
    }
  }, [programId, navigate]);

  const handleSave = React.useCallback(() => {
    if (!program) return;
    
    setSaveStatus('saving');
    const updatedProgram: Program = {
      ...program,
      name: editName || program.name,
      blocks,
    };
    saveProgram(updatedProgram);
    setProgram(updatedProgram);
    setSaveStatus('saved');
  }, [program, blocks, editName]);

  const debouncedSave = React.useCallback(() => {
    setSaveStatus('unsaved');
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      handleSave();
    }, 500);
  }, [handleSave]);

  React.useEffect(() => {
    if (blocks !== program?.blocks && saveStatus !== 'saving') {
      debouncedSave();
    }
  }, [blocks]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (active.data.current?.type === 'blockType') {
      setActiveBlockType(active.data.current.definition);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveBlockType(null);

    if (!over) return;

    const activeData = active.data.current;
    const overId = over.id as string;

    if (activeData?.type === 'blockType') {
      const definition = activeData.definition as BlockTypeDefinition;
      const newBlock: BlockInstance = {
        id: generateId(),
        type: definition.type,
        data: definition.getDefaultData(),
      };
      
      setBlocks((prev) => [...prev, newBlock]);
      setSelectedBlockId(newBlock.id);
    } else if (activeData?.type === 'block') {
      const activeBlock = activeData.block as BlockInstance;
      
      if (overId === 'canvas') {
        return;
      }
      
      const oldIndex = blocks.findIndex((b) => b.id === activeBlock.id);
      const newIndex = blocks.findIndex((b) => b.id === overId);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        setBlocks((prev) => arrayMove(prev, oldIndex, newIndex));
      }
    }
  };

  const handleBlockSelect = (id: string | null) => {
    setSelectedBlockId(id);
  };

  const handleBlockUpdate = (updatedBlock: BlockInstance) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === updatedBlock.id ? updatedBlock : b))
    );
  };

  const handleBlockDuplicate = (id: string) => {
    const block = blocks.find((b) => b.id === id);
    if (block) {
      const newBlock: BlockInstance = {
        ...block,
        id: generateId(),
      };
      const index = blocks.findIndex((b) => b.id === id);
      const newBlocks = [...blocks];
      newBlocks.splice(index + 1, 0, newBlock);
      setBlocks(newBlocks);
    }
  };

  const handleBlockDelete = (id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
    if (selectedBlockId === id) {
      setSelectedBlockId(null);
    }
  };

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId) || null;

  const compiledText = React.useMemo(() => {
    return compileBlocks(blocks);
  }, [blocks]);

  const handleNameSave = () => {
    if (editName.trim() && program) {
      const updatedProgram: Program = {
        ...program,
        name: editName.trim(),
      };
      setProgram(updatedProgram);
      saveProgram(updatedProgram);
    }
    setIsEditingName(false);
  };

  if (!program) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500">Loading...</div>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="h-screen flex flex-col bg-slate-50">
        <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/programs')}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"
            >
              <ArrowLeft size={20} />
            </button>
            
            {isEditingName ? (
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onBlur={handleNameSave}
                onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
                className="w-64"
                autoFocus
              />
            ) : (
              <h1
                className="text-lg font-semibold text-slate-800 cursor-pointer hover:text-primary"
                onClick={() => {
                  setEditName(program.name);
                  setIsEditingName(true);
                }}
              >
                {program.name}
              </h1>
            )}
            
            <SaveIndicator status={saveStatus} />
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={handleSave}>
              <Save size={16} className="mr-1" />
              Save
            </Button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <Canvas
            blocks={blocks}
            selectedBlockId={selectedBlockId}
            onSelectBlock={handleBlockSelect}
            onDuplicateBlock={handleBlockDuplicate}
            onDeleteBlock={handleBlockDelete}
          />
          
          <BlockLibrary className="w-72 flex-shrink-0" />
        </div>

        <CompiledPanel compiledText={compiledText} />

        <BlockEditor
          block={selectedBlock}
          isOpen={selectedBlock !== null}
          onClose={() => setSelectedBlockId(null)}
          onSave={handleBlockUpdate}
        />

        <DragOverlay>
          {activeBlockType ? (
            <div className="flex items-center gap-3 p-3 rounded-lg border border-primary bg-white shadow-lg">
              <div
                className="w-8 h-8 rounded-md flex items-center justify-center"
                style={{ backgroundColor: `${activeBlockType.color}15` }}
              >
                <span style={{ color: activeBlockType.color }}>{activeBlockType.label[0]}</span>
              </div>
              <span className="text-sm font-medium text-slate-800">
                {activeBlockType.label}
              </span>
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
};
