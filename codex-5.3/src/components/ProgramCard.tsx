import type { Program } from '../types/blocks'

interface ProgramCardProps {
  program: Program
  onOpen: () => void
  onEdit: () => void
  onDuplicate: () => void
  onDelete: () => void
}

export function ProgramCard({
  program,
  onOpen,
  onEdit,
  onDuplicate,
  onDelete,
}: ProgramCardProps) {
  const updatedAt = new Date(program.updatedAt).toLocaleString()

  return (
    <article
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          onOpen()
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="space-y-1">
        <h3 className="line-clamp-1 text-lg font-bold text-slate-900">
          {program.name}
        </h3>
        <p className="text-sm font-medium text-sky-700">{program.category}</p>
        <p className="text-xs text-slate-500">Updated {updatedAt}</p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white hover:bg-slate-800"
          onClick={(event) => {
            event.stopPropagation()
            onOpen()
          }}
          type="button"
        >
          Open
        </button>
        <button
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          onClick={(event) => {
            event.stopPropagation()
            onEdit()
          }}
          type="button"
        >
          Rename/Edit
        </button>
        <button
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          onClick={(event) => {
            event.stopPropagation()
            onDuplicate()
          }}
          type="button"
        >
          Duplicate
        </button>
        <button
          className="rounded-lg border border-rose-200 px-3 py-1.5 text-sm font-semibold text-rose-700 hover:bg-rose-50"
          onClick={(event) => {
            event.stopPropagation()
            onDelete()
          }}
          type="button"
        >
          Delete
        </button>
      </div>
    </article>
  )
}
