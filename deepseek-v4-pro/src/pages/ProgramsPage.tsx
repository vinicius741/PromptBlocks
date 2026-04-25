import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import type { Program } from '../types/blocks';
import { getPrograms, saveProgram, deleteProgram } from '../lib/storage';
import { generateId } from '../lib/ids';
import { ProgramCard } from '../components/ProgramCard';

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setPrograms(getPrograms());
  }, []);

  const refreshPrograms = () => setPrograms(getPrograms());

  const handleCreateNew = () => {
    const newProgram: Program = {
      id: generateId(),
      name: 'New Program',
      category: 'General',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      blocks: [],
    };
    saveProgram(newProgram);
    navigate(`/builder/${newProgram.id}`);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this program?')) {
      deleteProgram(id);
      refreshPrograms();
    }
  };

  const handleDuplicate = (program: Program) => {
    const duplicated: Program = {
      ...program,
      id: generateId(),
      name: `${program.name} (Copy)`,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    saveProgram(duplicated);
    refreshPrograms();
  };

  const handleRename = (program: Program) => {
    const newName = prompt('Enter new name:', program.name);
    if (newName && newName !== program.name) {
      saveProgram({ ...program, name: newName });
      refreshPrograms();
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">PromptBlocks</h1>
        <button
          onClick={handleCreateNew}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Create New Program
        </button>
      </div>

      {programs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500 mb-4">
            No programs found. Start by creating your first one!
          </p>
          <button
            onClick={handleCreateNew}
            className="text-blue-600 font-semibold hover:underline"
          >
            Create your first program
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program) => (
            <ProgramCard
              key={program.id}
              program={program}
              onClick={() => navigate(`/builder/${program.id}`)}
              onRename={() => handleRename(program)}
              onDuplicate={() => handleDuplicate(program)}
              onDelete={() => handleDelete(program.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
