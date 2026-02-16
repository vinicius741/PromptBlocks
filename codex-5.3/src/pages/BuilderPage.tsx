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
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { BlockEditor } from '../components/BlockEditor'
import { BlockLibrary } from '../components/BlockLibrary'
import { CANVAS_DROP_ID, Canvas } from '../components/Canvas'
import { CompiledPanel } from '../components/CompiledPanel'
import { createBlockInstance, duplicateBlockInstance } from '../lib/blocks'
import { compilePrompt } from '../lib/compiler'
import { getProgramById, saveProgram } from '../lib/storage'
import type { BlockInstance, BlockType, Program } from '../types/blocks'

type SaveState = 'saved' | 'saving' | 'unsaved'

type DragData =
  | {
      source: 'library'
      blockType: BlockType
    }
  | {
      source: 'canvas'
      blockId: string
      blockType: BlockType
    }

export function BuilderPage() {
  const navigate = useNavigate()
  const { programId } = useParams()

  const [program, setProgram] = useState<Program | null | undefined>(undefined)
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
  const [saveState, setSaveState] = useState<SaveState>('saved')
  const [isDirty, setIsDirty] = useState(false)
  const [activeDragData, setActiveDragData] = useState<DragData | null>(null)

  useEffect(() => {
    if (!programId) {
      setProgram(null)
      return
    }

    const loaded = getProgramById(programId)
    setProgram(loaded ?? null)
    setSelectedBlockId(null)
    setSaveState('saved')
    setIsDirty(false)
  }, [programId])

  useEffect(() => {
    if (!program || !selectedBlockId) {
      return
    }

    const blockStillExists = program.blocks.some(
      (block) => block.id === selectedBlockId,
    )
    if (!blockStillExists) {
      setSelectedBlockId(null)
    }
  }, [program, selectedBlockId])

  useEffect(() => {
    if (!program || !isDirty) {
      return
    }

    setSaveState('saving')
    const timeoutId = window.setTimeout(() => {
      const saved = saveProgram(program)
      setProgram(saved)
      setIsDirty(false)
      setSaveState('saved')
    }, 500)

    return () => window.clearTimeout(timeoutId)
  }, [program, isDirty])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 4,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const selectedBlock = useMemo(() => {
    if (!program || !selectedBlockId) {
      return null
    }

    return program.blocks.find((block) => block.id === selectedBlockId) ?? null
  }, [program, selectedBlockId])

  const compiledPrompt = useMemo(() => {
    return compilePrompt(program?.blocks ?? [])
  }, [program?.blocks])

  if (program === undefined) {
    return <main className="p-6 text-slate-700">Loading program...</main>
  }

  if (!program) {
    return (
      <main className="mx-auto max-w-xl p-8">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">
            Program not found
          </h1>
          <p className="mt-2 text-slate-600">
            The program may have been deleted. Return to your program list.
          </p>
          <Link
            className="mt-4 inline-flex rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-800"
            to="/programs"
          >
            Back to Programs
          </Link>
        </section>
      </main>
    )
  }

  const activeProgram = program

  function updateBlocks(nextBlocks: BlockInstance[]) {
    setProgram((current) =>
      current ? { ...current, blocks: nextBlocks } : current,
    )
    setIsDirty(true)
    setSaveState('unsaved')
  }

  function handleBlockChange(nextBlock: BlockInstance) {
    const nextBlocks = activeProgram.blocks.map((block) =>
      block.id === nextBlock.id ? nextBlock : block,
    )
    updateBlocks(nextBlocks)
  }

  function handleRemoveBlock(blockId: string) {
    const nextBlocks = activeProgram.blocks.filter(
      (block) => block.id !== blockId,
    )
    updateBlocks(nextBlocks)
  }

  function handleDuplicateBlock(blockId: string) {
    const sourceBlock = activeProgram.blocks.find(
      (block) => block.id === blockId,
    )
    if (!sourceBlock) {
      return
    }

    const sourceIndex = activeProgram.blocks.findIndex(
      (block) => block.id === blockId,
    )
    const duplicate = duplicateBlockInstance(sourceBlock)
    const nextBlocks = [...activeProgram.blocks]
    nextBlocks.splice(sourceIndex + 1, 0, duplicate)
    updateBlocks(nextBlocks)
    setSelectedBlockId(duplicate.id)
  }

  function handleSaveNow() {
    const saved = saveProgram(activeProgram)
    setProgram(saved)
    setIsDirty(false)
    setSaveState('saved')
  }

  function handleDragStart(event: DragStartEvent) {
    const dragData = event.active.data.current as DragData | undefined
    setActiveDragData(dragData ?? null)
  }

  function handleDragEnd(event: DragEndEvent) {
    const activeData = event.active.data.current as DragData | undefined
    const overId = event.over?.id?.toString()

    setActiveDragData(null)

    if (!activeData || !overId) {
      return
    }

    if (activeData.source === 'library') {
      const nextBlocks = [...activeProgram.blocks]
      const newBlock = createBlockInstance(activeData.blockType)
      let insertionIndex = nextBlocks.length

      if (overId !== CANVAS_DROP_ID) {
        const overIndex = nextBlocks.findIndex((block) => block.id === overId)
        if (overIndex >= 0) {
          insertionIndex = overIndex
        }
      }

      nextBlocks.splice(insertionIndex, 0, newBlock)
      updateBlocks(nextBlocks)
      setSelectedBlockId(newBlock.id)
      return
    }

    const currentBlocks = [...activeProgram.blocks]
    const oldIndex = currentBlocks.findIndex(
      (block) => block.id === activeData.blockId,
    )
    if (oldIndex < 0) {
      return
    }

    if (overId === CANVAS_DROP_ID) {
      const moved = arrayMove(currentBlocks, oldIndex, currentBlocks.length - 1)
      updateBlocks(moved)
      return
    }

    const newIndex = currentBlocks.findIndex((block) => block.id === overId)
    if (newIndex < 0 || newIndex === oldIndex) {
      return
    }

    const moved = arrayMove(currentBlocks, oldIndex, newIndex)
    updateBlocks(moved)
  }

  const statusColor =
    saveState === 'saved'
      ? 'text-emerald-700'
      : saveState === 'saving'
        ? 'text-amber-700'
        : 'text-rose-700'

  const statusText =
    saveState === 'saved'
      ? 'All changes saved'
      : saveState === 'saving'
        ? 'Saving...'
        : 'Unsaved changes'

  return (
    <main className="flex h-screen flex-col">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-5 py-3 backdrop-blur">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">
            {activeProgram.category}
          </p>
          <h1 className="text-2xl font-bold text-slate-900">
            {activeProgram.name}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <p className={`text-sm font-semibold ${statusColor}`}>{statusText}</p>
          <button
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            onClick={handleSaveNow}
            type="button"
          >
            Save now
          </button>
          <button
            className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white hover:bg-slate-800"
            onClick={() => navigate('/programs')}
            type="button"
          >
            Back to programs
          </button>
        </div>
      </header>

      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        sensors={sensors}
      >
        <div className="flex min-h-0 flex-1">
          <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 p-4 lg:grid-cols-[340px_1fr]">
            <BlockEditor block={selectedBlock} onChange={handleBlockChange} />
            <Canvas
              blocks={activeProgram.blocks}
              onDuplicateBlock={handleDuplicateBlock}
              onRemoveBlock={handleRemoveBlock}
              onSelectBlock={setSelectedBlockId}
              selectedBlockId={selectedBlockId}
            />
          </div>
          <div className="w-[320px]">
            <BlockLibrary />
          </div>
        </div>

        <DragOverlay>
          {activeDragData ? (
            <div className="rounded-lg border border-sky-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-lg">
              {activeDragData.source === 'library'
                ? `Add ${activeDragData.blockType.replace('_', ' ')} block`
                : 'Move block'}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <CompiledPanel compiledPrompt={compiledPrompt} />
    </main>
  )
}
