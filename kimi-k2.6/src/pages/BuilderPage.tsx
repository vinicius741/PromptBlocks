import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import type { Program, BlockInstance, BlockType } from '../types/blocks'
import { getProgram, saveProgram } from '../lib/storage'
import { generateId } from '../lib/ids'
import { createDefaultBlockData } from '../lib/blocks'
import { BlockLibrary } from '../components/library/BlockLibrary'
import { Canvas } from '../components/canvas/Canvas'
import { BlockEditor } from '../components/editor/BlockEditor'
import { CompiledPanel } from '../components/panels/CompiledPanel'

export function BuilderPage() {
  const { programId } = useParams<{ programId: string }>()
  const navigate = useNavigate()

  const [program, setProgram] = useState<Program | null>(null)
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    if (!programId) return
    const loaded = getProgram(programId)
    if (!loaded) {
      navigate('/programs', { replace: true })
      return
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProgram(loaded)
    setSelectedBlockId(null)
    setDirty(false)
  }, [programId, navigate])

  // Auto-save debounce
  useEffect(() => {
    if (!program || !dirty) return
    const timer = setTimeout(() => {
      saveProgram(program)
      setDirty(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [program, dirty])

  const handleAddBlock = useCallback((type: BlockType) => {
    setProgram((prev) => {
      if (!prev) return prev
      const newBlock: BlockInstance = {
        id: generateId(),
        type,
        data: createDefaultBlockData(type),
      }
      return { ...prev, blocks: [...prev.blocks, newBlock] }
    })
    setDirty(true)
  }, [])

  const handleRemoveBlock = useCallback((id: string) => {
    setProgram((prev) => {
      if (!prev) return prev
      return { ...prev, blocks: prev.blocks.filter((b) => b.id !== id) }
    })
    setSelectedBlockId((prev) => (prev === id ? null : prev))
    setDirty(true)
  }, [])

  const handleDuplicateBlock = useCallback((id: string) => {
    setProgram((prev) => {
      if (!prev) return prev
      const idx = prev.blocks.findIndex((b) => b.id === id)
      if (idx === -1) return prev
      const original = prev.blocks[idx]
      const copy: BlockInstance = {
        ...original,
        id: generateId(),
      }
      const next = [...prev.blocks]
      next.splice(idx + 1, 0, copy)
      return { ...prev, blocks: next }
    })
    setDirty(true)
  }, [])

  const handleSelectBlock = useCallback((id: string) => {
    setSelectedBlockId(id)
  }, [])

  const handleUpdateBlock = useCallback((updated: BlockInstance) => {
    setProgram((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        blocks: prev.blocks.map((b) => (b.id === updated.id ? updated : b)),
      }
    })
    setDirty(true)
  }, [])

  const handleRenameProgram = useCallback(() => {
    if (!program) return
    const newName = window.prompt('Program name:', program.name)
    if (newName && newName.trim()) {
      const updated = { ...program, name: newName.trim() }
      setProgram(updated)
      saveProgram(updated)
      setDirty(false)
    }
  }, [program])

  const handleSaveNow = useCallback(() => {
    if (!program) return
    saveProgram(program)
    setDirty(false)
  }, [program])

  const selectedBlock = useMemo(() => {
    if (!program || !selectedBlockId) return null
    return program.blocks.find((b) => b.id === selectedBlockId) || null
  }, [program, selectedBlockId])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  )

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = String(active.id)
    const overId = String(over.id)

    if (activeId.startsWith('library-')) {
      const type = activeId.replace('library-', '') as BlockType
      setProgram((prev) => {
        if (!prev) return prev
        const newBlock: BlockInstance = {
          id: generateId(),
          type,
          data: createDefaultBlockData(type),
        }
        if (overId === 'canvas-drop') {
          return { ...prev, blocks: [...prev.blocks, newBlock] }
        }
        const idx = prev.blocks.findIndex((b) => b.id === overId)
        if (idx === -1) return { ...prev, blocks: [...prev.blocks, newBlock] }
        const next = [...prev.blocks]
        next.splice(idx, 0, newBlock)
        return { ...prev, blocks: next }
      })
      setDirty(true)
      return
    }

    if (overId === 'canvas-drop') {
      // Move to end by removing and pushing
      setProgram((prev) => {
        if (!prev) return prev
        const idx = prev.blocks.findIndex((b) => b.id === activeId)
        if (idx === -1) return prev
        const next = [...prev.blocks]
        const [moved] = next.splice(idx, 1)
        next.push(moved)
        return { ...prev, blocks: next }
      })
      setDirty(true)
      return
    }

    if (activeId !== overId) {
      setProgram((prev) => {
        if (!prev) return prev
        const oldIndex = prev.blocks.findIndex((b) => b.id === activeId)
        const newIndex = prev.blocks.findIndex((b) => b.id === overId)
        if (oldIndex === -1 || newIndex === -1) return prev
        return { ...prev, blocks: arrayMove(prev.blocks, oldIndex, newIndex) }
      })
      setDirty(true)
    }
  }, [])

  if (!program) {
    return <div className="flex items-center justify-center h-full text-gray-500">Loading...</div>
  }

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <div className="flex items-center gap-3">
          <button
            className="text-sm px-3 py-1.5 rounded border border-gray-200 hover:bg-gray-50 text-gray-700"
            onClick={() => navigate('/programs')}
          >
            Back
          </button>
          <div>
            <h1
              className="text-lg font-semibold text-gray-900 cursor-pointer hover:underline"
              onClick={handleRenameProgram}
              title="Click to rename"
            >
              {program.name}
            </h1>
            <span className="text-xs text-gray-500">{program.category}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={['text-xs font-medium', dirty ? 'text-amber-600' : 'text-green-600'].join(
              ' ',
            )}
          >
            {dirty ? 'Unsaved' : 'Saved'}
          </span>
          <button
            onClick={handleSaveNow}
            className="text-xs px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Save now
          </button>
        </div>
      </header>

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="flex-1 flex overflow-hidden">
          <BlockEditor block={selectedBlock} onChange={handleUpdateBlock} />

          <main className="flex-1 flex flex-col p-4 overflow-hidden">
            <Canvas
              blocks={program.blocks}
              selectedBlockId={selectedBlockId}
              onSelect={handleSelectBlock}
              onRemove={handleRemoveBlock}
              onDuplicate={handleDuplicateBlock}
            />
          </main>

          <BlockLibrary onAdd={handleAddBlock} />
        </div>
      </DndContext>

      <CompiledPanel blocks={program.blocks} />
    </div>
  )
}
