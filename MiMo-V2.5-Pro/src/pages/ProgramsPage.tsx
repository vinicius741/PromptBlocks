import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ProgramCard } from '../components/ProgramCard'
import {
  createProgram,
  deleteProgram,
  duplicateProgram,
  loadPrograms,
  renameProgram,
} from '../lib/storage'
import type { Program } from '../types/blocks'

export function ProgramsPage() {
  const navigate = useNavigate()
  const [programs, setPrograms] = useState<Program[]>(() => loadPrograms())
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [newCategory, setNewCategory] = useState('General')

  function refresh() {
    setPrograms(loadPrograms())
  }

  function handleCreate() {
    if (!newName.trim()) return
    const program = createProgram(newName.trim(), newCategory.trim())
    setNewName('')
    setNewCategory('General')
    setShowCreate(false)
    refresh()
    navigate(`/builder/${program.id}`)
  }

  function handleDelete(id: string) {
    if (confirm('Delete this program?')) {
      deleteProgram(id)
      refresh()
    }
  }

  function handleDuplicate(id: string) {
    duplicateProgram(id)
    refresh()
  }

  function handleRename(id: string) {
    const program = programs.find((p) => p.id === id)
    if (!program) return
    const name = prompt('New name:', program.name)
    if (!name) return
    const category = prompt('Category:', program.category)
    if (!category) return
    renameProgram(id, name, category)
    refresh()
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-10">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">PromptBlocks</h1>
            <p className="mt-1 text-slate-500">
              Build reusable prompt programs by assembling blocks.
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
          >
            + New Program
          </button>
        </div>

        {/* Create form */}
        {showCreate && (
          <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-slate-700">Create New Program</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              <input
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                placeholder="Program name"
                type="text"
                value={newName}
              />
              <input
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                placeholder="Category"
                type="text"
                value={newCategory}
              />
              <div className="flex gap-2">
                <button
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
                  onClick={handleCreate}
                >
                  Create
                </button>
                <button
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                  onClick={() => setShowCreate(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Program list */}
        {programs.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
            <p className="text-slate-500">No programs yet. Create your first one!</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {programs.map((program) => (
              <ProgramCard
                key={program.id}
                onDelete={() => handleDelete(program.id)}
                onDuplicate={() => handleDuplicate(program.id)}
                onOpen={() => navigate(`/builder/${program.id}`)}
                onRename={() => handleRename(program.id)}
                program={program}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
