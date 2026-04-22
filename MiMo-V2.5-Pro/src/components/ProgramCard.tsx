import type { Program } from '../types/blocks'

interface ProgramCardProps {
  program: Program
  onOpen: () => void
  onRename: () => void
  onDuplicate: () => void
  onDelete: () => void
}

export function ProgramCard({
  program,
  onOpen,
  onRename,
  onDuplicate,
  onDelete,
}: ProgramCardProps) {
  const updatedAt = new Date(program.updatedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="mb-3 cursor-pointer" onClick={onOpen}>
        <h3 className="text-lg font-semibold text-slate-900">{program.name}</h3>
        <span className="mt-1 inline-block rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
          {program.category}
        </span>
        <p className="mt-2 text-xs text-slate-500">Updated {updatedAt}</p>
        <p className="mt-1 text-xs text-slate-400">
          {program.blocks.length} block{program.blocks.length !== 1 ? 's' : ''}
        </p>
      </div>
      <div className="flex gap-2 border-t border-slate-100 pt-3">
        <button
          onClick={onOpen}
          className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
        >
          Open
        </button>
        <button
          onClick={onRename}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
        >
          Rename
        </button>
        <button
          onClick={onDuplicate}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
        >
          Duplicate
        </button>
        <button
          onClick={onDelete}
          className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
