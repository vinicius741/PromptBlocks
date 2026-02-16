import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ProgramCard } from '../components/ProgramCard'
import {
  createProgram,
  deleteProgram,
  duplicateProgram,
  listPrograms,
  updateProgramMetadata,
} from '../lib/storage'
import type { Program } from '../types/blocks'

export function ProgramsPage() {
  const navigate = useNavigate()
  const [programs, setPrograms] = useState<Program[]>(() => listPrograms())
  const [draftName, setDraftName] = useState('Untitled Program')
  const [draftCategory, setDraftCategory] = useState('General')

  function refreshPrograms() {
    setPrograms(listPrograms())
  }

  function handleCreateProgram() {
    const created = createProgram({ name: draftName, category: draftCategory })
    setDraftName('Untitled Program')
    setDraftCategory('General')
    navigate(`/builder/${created.id}`)
  }

  return (
    <main className="mx-auto max-w-6xl p-6">
      <header className="mb-8 rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-sm backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">
          PromptBlocks
        </p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900">
          Prompt Programs
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Build reusable prompt recipes with drag-and-drop blocks. Everything is
          stored locally in your browser.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_220px_auto]">
          <input
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none ring-sky-300 focus:border-sky-400 focus:ring-2"
            onChange={(event) => setDraftName(event.target.value)}
            placeholder="Program name"
            type="text"
            value={draftName}
          />
          <input
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none ring-sky-300 focus:border-sky-400 focus:ring-2"
            onChange={(event) => setDraftCategory(event.target.value)}
            placeholder="Category"
            type="text"
            value={draftCategory}
          />
          <button
            className="rounded-xl bg-sky-600 px-4 py-2.5 font-semibold text-white hover:bg-sky-500"
            onClick={handleCreateProgram}
            type="button"
          >
            Create New
          </button>
        </div>
      </header>

      {programs.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-10 text-center">
          <h2 className="text-xl font-bold text-slate-900">No programs yet</h2>
          <p className="mt-2 text-slate-600">
            Create your first program above to start building prompts.
          </p>
        </section>
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {programs.map((program) => (
            <ProgramCard
              key={program.id}
              onDelete={() => {
                const shouldDelete = window.confirm(
                  `Delete "${program.name}"? This cannot be undone.`,
                )
                if (!shouldDelete) {
                  return
                }
                deleteProgram(program.id)
                refreshPrograms()
              }}
              onDuplicate={() => {
                duplicateProgram(program.id)
                refreshPrograms()
              }}
              onEdit={() => {
                const nextName = window.prompt('Program name', program.name)
                if (nextName === null) {
                  return
                }

                const nextCategory = window.prompt('Category', program.category)
                if (nextCategory === null) {
                  return
                }

                updateProgramMetadata(program.id, {
                  name: nextName,
                  category: nextCategory,
                })
                refreshPrograms()
              }}
              onOpen={() => navigate(`/builder/${program.id}`)}
              program={program}
            />
          ))}
        </section>
      )}
    </main>
  )
}
