import { useState } from 'react';
import { Clock, Edit2, Copy, Trash2, MoreVertical } from 'lucide-react';
import type { Program } from '@/types/blocks';

interface ProgramCardProps {
  program: Program;
  onClick: () => void;
  onRename: (newName: string) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export function ProgramCard({
  program,
  onClick,
  onRename,
  onDuplicate,
  onDelete,
}: ProgramCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(program.name);
  const [showMenu, setShowMenu] = useState(false);

  const handleSave = () => {
    if (editName.trim()) {
      onRename(editName.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditName(program.name);
      setIsEditing(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div
      className="group relative bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              className="w-full px-2 py-1 text-lg font-semibold border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {program.name}
            </h3>
          )}
          <span className="inline-flex items-center px-2 py-0.5 mt-2 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
            {program.category || 'General'}
          </span>
        </div>

        <div className="relative ml-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                }}
              />
              <div className="absolute right-0 mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                    setIsEditing(true);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Rename
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                    onDuplicate();
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Duplicate
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                    onDelete();
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center mt-4 text-sm text-gray-500">
        <Clock className="w-4 h-4 mr-1.5" />
        <span>Updated {formatDate(program.updatedAt)}</span>
      </div>

      <div className="mt-3 flex items-center text-sm text-gray-600">
        <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">
          {program.blocks.length} block{program.blocks.length !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  );
}
