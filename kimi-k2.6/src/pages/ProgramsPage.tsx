import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Program } from '../types/blocks'
import {
  loadPrograms,
  createProgram,
  deleteProgram,
  duplicateProgram,
  saveProgram,
} from '../lib/storage'
import { ProgramCard } from '../components/ProgramCard'

export function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>(() => loadPrograms())
  const navigate = useNavigate()

  const refresh = useCallback(() => {
    setPrograms(loadPrograms())
  }, [])

  const handleCreate = useCallback(() => {
    const program = createProgram('New Program', 'General')
    refresh()
    navigate(`/builder/${program.id}`)
  }, [navigate, refresh])

  const handleRename = useCallback(
    (id: string) => {
      const program = programs.find((p) => p.id === id)
      if (!program) return
      const newName = window.prompt('Rename program:', program.name)
      if (newName && newName.trim()) {
        saveProgram({ ...program, name: newName.trim() })
        refresh()
      }
    },
    [programs, refresh],
  )

  const handleDuplicate = useCallback(
    (id: string) => {
      duplicateProgram(id)
      refresh()
    },
    [refresh],
  )

  const handleDelete = useCallback(
    (id: string) => {
      if (window.confirm('Delete this program?')) {
        deleteProgram(id)
        refresh()
      }
    },
    [refresh],
  )

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Programs</h1>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
        >
          Create New Program
        </button>
      </div>

      {programs.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="mb-4">No programs yet.</p>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
          >
            Create your first program
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {programs.map((program) => (
            <ProgramCard
              key={program.id}
              program={program}
              onOpen={(id) => navigate(`/builder/${id}`)}
              onRename={handleRename}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
