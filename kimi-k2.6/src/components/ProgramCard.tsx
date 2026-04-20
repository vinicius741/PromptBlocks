import type { Program } from '../types/blocks'

interface ProgramCardProps {
  program: Program
  onOpen: (id: string) => void
  onRename: (id: string) => void
  onDuplicate: (id: string) => void
  onDelete: (id: string) => void
}

export function ProgramCard({
  program,
  onOpen,
  onRename,
  onDuplicate,
  onDelete,
}: ProgramCardProps) {
  return (
    <div
      className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onOpen(program.id)}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{program.name}</h3>
          <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
            {program.category}
          </span>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-gray-500">
          Updated {new Date(program.updatedAt).toLocaleDateString()}
        </span>
        <div className="flex gap-2">
          <button
            className="text-xs px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 text-gray-700"
            onClick={(e) => {
              e.stopPropagation()
              onRename(program.id)
            }}
          >
            Rename
          </button>
          <button
            className="text-xs px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 text-gray-700"
            onClick={(e) => {
              e.stopPropagation()
              onDuplicate(program.id)
            }}
          >
            Duplicate
          </button>
          <button
            className="text-xs px-2 py-1 rounded border border-red-200 hover:bg-red-50 text-red-600"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(program.id)
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
