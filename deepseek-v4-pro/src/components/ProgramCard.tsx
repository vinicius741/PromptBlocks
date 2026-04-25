import { Edit2, Copy, Trash2, Play } from 'lucide-react';
import type { Program } from '../types/blocks';

interface ProgramCardProps {
  program: Program;
  onClick: () => void;
  onRename: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export function ProgramCard({ program, onClick, onRename, onDuplicate, onDelete }: ProgramCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
            {program.name}
          </h3>
          <p className="text-sm text-gray-500 capitalize">{program.category}</p>
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRename();
            }}
            className="p-1 hover:bg-gray-100 rounded text-gray-600"
            title="Rename"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
            className="p-1 hover:bg-gray-100 rounded text-gray-600"
            title="Duplicate"
          >
            <Copy size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1 hover:bg-red-50 rounded text-red-600"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      <div className="flex justify-between items-center text-xs text-gray-400 mt-auto">
        <span>Updated: {new Date(program.updatedAt).toLocaleDateString()}</span>
        <span className="flex items-center gap-1 text-blue-500 font-medium">
          Open <Play size={12} />
        </span>
      </div>
    </div>
  );
}
