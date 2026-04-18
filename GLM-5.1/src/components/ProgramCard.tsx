import type { Program } from '@/types/blocks';
import { useNavigate } from 'react-router-dom';

interface ProgramCardProps {
  program: Program;
  onRename: (id: string, name: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function ProgramCard({ program, onRename, onDuplicate, onDelete }: ProgramCardProps) {
  const navigate = useNavigate();

  const handleRename = () => {
    const name = window.prompt('Rename program:', program.name);
    if (name && name.trim()) {
      onRename(program.id, name.trim());
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Delete "${program.name}"?`)) {
      onDelete(program.id);
    }
  };

  const dateStr = new Date(program.updatedAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="group rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div
        className="mb-2 cursor-pointer"
        onClick={() => navigate(`/builder/${program.id}`)}
      >
        <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600">
          {program.name}
        </h3>
        <p className="text-xs text-gray-500">{program.category || 'Uncategorized'}</p>
        <p className="mt-1 text-xs text-gray-400">{dateStr}</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => navigate(`/builder/${program.id}`)}
          className="rounded bg-blue-500 px-3 py-1 text-xs font-medium text-white hover:bg-blue-600"
        >
          Open
        </button>
        <button
          onClick={handleRename}
          className="rounded border border-gray-200 px-3 py-1 text-xs text-gray-600 hover:bg-gray-50"
        >
          Rename
        </button>
        <button
          onClick={() => onDuplicate(program.id)}
          className="rounded border border-gray-200 px-3 py-1 text-xs text-gray-600 hover:bg-gray-50"
        >
          Duplicate
        </button>
        <button
          onClick={handleDelete}
          className="rounded border border-gray-200 px-3 py-1 text-xs text-red-500 hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
