import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Program } from '@/types/blocks';

interface ProgramCardProps {
  program: Program;
  onRename: (id: string, newName: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ProgramCard({ program, onRename, onDuplicate, onDelete }: ProgramCardProps) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(program.name);
  const [showMenu, setShowMenu] = useState(false);

  const handleOpen = () => {
    navigate(`/builder/${program.id}`);
  };

  const handleRename = () => {
    if (editName.trim()) {
      onRename(program.id, editName.trim());
    }
    setIsEditing(false);
  };

  const handleDuplicate = () => {
    onDuplicate(program.id);
    setShowMenu(false);
  };

  const handleDelete = () => {
    if (confirm(`Delete "${program.name}"? This cannot be undone.`)) {
      onDelete(program.id);
    }
    setShowMenu(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="group relative rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div onClick={handleOpen} className="cursor-pointer">
        {isEditing ? (
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRename();
              if (e.key === 'Escape') {
                setEditName(program.name);
                setIsEditing(false);
              }
            }}
            onClick={(e) => e.stopPropagation()}
            className="w-full rounded border border-blue-500 px-2 py-1 text-lg font-semibold focus:outline-none"
            autoFocus
          />
        ) : (
          <h3 className="text-lg font-semibold text-gray-800">{program.name}</h3>
        )}
        <p className="mt-1 text-sm text-gray-500">{program.category}</p>
        <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
          <span>{program.blocks.length} blocks</span>
          <span>Updated {formatDate(program.updatedAt)}</span>
        </div>
      </div>

      {/* Menu */}
      <div className="absolute right-2 top-2">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="rounded p-1 text-gray-400 opacity-0 transition hover:bg-gray-100 hover:text-gray-600 group-hover:opacity-100"
        >
          ⋯
        </button>
        {showMenu && (
          <div className="absolute right-0 top-8 z-10 w-36 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
            <button
              onClick={() => {
                setIsEditing(true);
                setShowMenu(false);
              }}
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
            >
              Rename
            </button>
            <button
              onClick={handleDuplicate}
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
            >
              Duplicate
            </button>
            <button
              onClick={handleDelete}
              className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
