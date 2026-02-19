import React from 'react';
import { Program } from '../../types/blocks';
import { Card, Button } from '../ui';
import { Edit2, Copy, Trash2, FolderOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProgramCardProps {
  program: Program;
  onRename: (id: string, name: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ProgramCard: React.FC<ProgramCardProps> = ({
  program,
  onRename,
  onDuplicate,
  onDelete,
}) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = React.useState(false);
  const [editName, setEditName] = React.useState(program.name);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editName.trim()) {
      onRename(program.id, editName.trim());
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className="p-4 group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <FolderOpen size={18} className="text-primary" />
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              className="text-sm font-medium text-slate-800 bg-transparent border-b border-primary focus:outline-none"
            />
          ) : (
            <h3 className="text-sm font-semibold text-slate-800 truncate max-w-[150px]">
              {program.name}
            </h3>
          )}
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600"
            title="Rename"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => onDuplicate(program.id)}
            className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600"
            title="Duplicate"
          >
            <Copy size={14} />
          </button>
          <button
            onClick={() => onDelete(program.id)}
            className="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-500"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      
      <div className="mb-3">
        <span className="inline-block px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-600 rounded">
          {program.category || 'Uncategorized'}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">
          {formatDate(program.updatedAt)}
        </span>
        <Button
          size="sm"
          onClick={() => navigate(`/builder/${program.id}`)}
        >
          Open
        </Button>
      </div>
    </Card>
  );
};
