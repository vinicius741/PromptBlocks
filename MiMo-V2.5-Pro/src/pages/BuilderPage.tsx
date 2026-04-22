import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BlockEditor } from '../components/BlockEditor'
import { BlockLibrary } from '../components/BlockLibrary'
import { Canvas } from '../components/Canvas'
import { CompiledPanel } from '../components/CompiledPanel'
import { createBlockInstance, duplicateBlockInstance } from '../lib/blocks'
import { compilePrompt } from '../lib/compiler'
import { getProgram, updateProgram } from '../lib/storage'
import type { BlockInstance, BlockType, Program } from '../types/blocks'

type SaveStatus = 'saved' | 'unsaved' | 'saving'

export function BuilderPage() {
  const navigate = useNavigate()
  const { programId } = useParams<{ programId: string }>()

  const [program, setProgram] = useState<Program | null>(null)
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved')
  const [activeDragType, setActiveDragType] = useState<BlockType | null>(null)

  // Load program
  useEffect(() => {
    if (!programId) return
    const p = getProgram(programId)
    if (p) {
      setProgram(p)
      setSelectedBlockId(null)
      setSaveStatus('saved')
    }
  }, [programId])

  // Auto-save with debounce
  useEffect(() => {
    if (!program || saveStatus !== 'unsaved') return
    setSaveStatus('saving')
    const timer = setTimeout(() => {
      updateProgram(program)
      setSaveStatus('saved')
    }, 500)
    return () => clearTimeout(timer)
  }, [program, saveStatus])

  const updateBlocks = useCallback((blocks: BlockInstance[]) => {
    setProgram((prev) => (prev ? { ...prev, blocks } : prev))
    setSaveStatus('unsaved')
  }, [])

  const compiledPrompt = useMemo(() => (program ? compilePrompt(program.blocks) : ''), [program])

  const selectedBlock = useMemo(
    () => program?.blocks.find((b) => b.id === selectedBlockId) ?? null,
    [program, selectedBlockId],
  )

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  function handleDragStart(event: DragStartEvent) {
    const data = event.active.data.current
    if (data?.source === 'library') {
      setActiveDragType(data.blockType as BlockType)
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveDragType(null)

    if (!over || !program) return

    const activeData = active.data.current

    // Dropping from library onto canvas or a block
    if (activeData?.source === 'library') {
      const blockType = activeData.blockType as BlockType
      const newBlock = createBlockInstance(blockType)

      if (over.id === 'canvas') {
        updateBlocks([...program.blocks, newBlock])
      } else {
        // Insert before the block being hovered over
        const overIndex = program.blocks.findIndex((b) => b.id === over.id)
        if (overIndex >= 0) {
          const newBlocks = [...program.blocks]
          newBlocks.splice(overIndex, 0, newBlock)
          updateBlocks(newBlocks)
        } else {
          updateBlocks([...program.blocks, newBlock])
        }
      }
      setSelectedBlockId(newBlock.id)
      return
    }

    // Reordering within canvas
    if (active.id !== over.id && over.id !== 'canvas') {
      const oldIndex = program.blocks.findIndex((b) => b.id === active.id)
      const newIndex = program.blocks.findIndex((b) => b.id === over.id)
      if (oldIndex !== -1 && newIndex !== -1) {
        updateBlocks(arrayMove(program.blocks, oldIndex, newIndex))
      }
    }
  }

  function handleBlockChange(updated: BlockInstance) {
    if (!program) return
    const newBlocks = program.blocks.map((b) => (b.id === updated.id ? updated : b))
    setProgram({ ...program, blocks: newBlocks })
    setSaveStatus('unsaved')
  }

  function handleDuplicateBlock(blockId: string) {
    if (!program) return
    const block = program.blocks.find((b) => b.id === blockId)
    if (!block) return
    const dup = duplicateBlockInstance(block)
    const index = program.blocks.findIndex((b) => b.id === blockId)
    const newBlocks = [...program.blocks]
    newBlocks.splice(index + 1, 0, dup)
    updateBlocks(newBlocks)
    setSelectedBlockId(dup.id)
  }

  function handleRemoveBlock(blockId: string) {
    if (!program) return
    updateBlocks(program.blocks.filter((b) => b.id !== blockId))
    if (selectedBlockId === blockId) setSelectedBlockId(null)
  }

  function handleSaveNow() {
    if (!program) return
    setSaveStatus('saving')
    updateProgram(program)
    setSaveStatus('saved')
  }

  if (!program) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="text-slate-500">Loading program...</p>
          <button
            className="mt-4 text-sm text-blue-600 hover:underline"
            onClick={() => navigate('/programs')}
          >
            Back to programs
          </button>
        </div>
      </div>
    )
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      sensors={sensors}
    >
      <div className="flex h-screen flex-col bg-slate-50">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
              onClick={() => navigate('/programs')}
            >
              ← Programs
            </button>
            <div>
              <h1 className="text-lg font-bold text-slate-900">{program.name}</h1>
              <p className="text-xs text-slate-500">{program.category}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`text-xs font-medium ${
                saveStatus === 'saved'
                  ? 'text-green-600'
                  : saveStatus === 'saving'
                    ? 'text-amber-600'
                    : 'text-slate-400'
              }`}
            >
              {saveStatus === 'saved'
                ? '✓ Saved'
                : saveStatus === 'saving'
                  ? 'Saving...'
                  : '● Unsaved'}
            </span>
            <button
              className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-500"
              onClick={handleSaveNow}
            >
              Save now
            </button>
          </div>
        </header>

        {/* Main area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Editor panel (left side) */}
          <div className="w-80 overflow-y-auto border-r border-slate-200 bg-white">
            <BlockEditor block={selectedBlock} onChange={handleBlockChange} />
          </div>

          {/* Canvas (center) */}
          <div className="flex flex-1 flex-col">
            <div className="flex-1 overflow-hidden">
              <Canvas
                blocks={program.blocks}
                onDuplicateBlock={handleDuplicateBlock}
                onRemoveBlock={handleRemoveBlock}
                onSelectBlock={setSelectedBlockId}
                selectedBlockId={selectedBlockId}
              />
            </div>

            {/* Compiled prompt panel (bottom) */}
            <CompiledPanel compiledPrompt={compiledPrompt} />
          </div>

          {/* Block library (right sidebar) */}
          <BlockLibrary />
        </div>
      </div>

      <DragOverlay>
        {activeDragType ? (
          <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-lg">
            <div className="flex items-center gap-2">
              <div
                className={`h-2 w-2 rounded-full ${
                  activeDragType === 'role'
                    ? 'bg-violet-500'
                    : activeDragType === 'task'
                      ? 'bg-blue-500'
                      : activeDragType === 'context'
                        ? 'bg-cyan-500'
                        : activeDragType === 'constraints'
                          ? 'bg-amber-500'
                          : activeDragType === 'tone'
                            ? 'bg-pink-500'
                            : activeDragType === 'output_format'
                              ? 'bg-emerald-500'
                              : 'bg-orange-500'
                }`}
              />
              <span className="text-sm font-medium text-slate-700">
                {activeDragType.replace('_', ' ')}
              </span>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
