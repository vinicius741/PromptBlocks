import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ProgramCard } from '../components/ProgramCard';
import { Button } from '../components/ui';
import { Plus, Blocks } from 'lucide-react';
import { Program } from '../types/blocks';
import { generateId } from '../lib/ids';
import { saveProgram, deleteProgram } from '../lib/storage';

interface ProgramsPageProps {
  programs: Program[];
  onProgramsChange: () => void;
}

export const ProgramsPage: React.FC<ProgramsPageProps> = ({ programs, onProgramsChange }) => {
  const navigate = useNavigate();

  const handleCreate = () => {
    const now = new Date().toISOString();
    const newProgram: Program = {
      id: generateId(),
      name: 'Untitled Program',
      category: '',
      createdAt: now,
      updatedAt: now,
      blocks: [],
    };
    saveProgram(newProgram);
    onProgramsChange();
    navigate(`/builder/${newProgram.id}`);
  };

  const handleRename = (id: string, name: string) => {
    const program = programs.find(p => p.id === id);
    if (program) {
      program.name = name;
      saveProgram(program);
      onProgramsChange();
    }
  };

  const handleDuplicate = (id: string) => {
    const program = programs.find(p => p.id === id);
    if (program) {
      const now = new Date().toISOString();
      const duplicate: Program = {
        ...program,
        id: generateId(),
        name: `${program.name} (copy)`,
        createdAt: now,
        updatedAt: now,
      };
      saveProgram(duplicate);
      onProgramsChange();
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this program?')) {
      deleteProgram(id);
      onProgramsChange();
    }
  };

  const sortedPrograms = [...programs].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Blocks size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">PromptBlocks</h1>
                <p className="text-sm text-slate-500">Build better AI prompts with blocks</p>
              </div>
            </div>
            <Button onClick={handleCreate}>
              <Plus size={18} className="mr-2" />
              New Program
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {sortedPrograms.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Blocks size={32} className="text-slate-300" />
            </div>
            <h2 className="text-lg font-semibold text-slate-700 mb-2">No programs yet</h2>
            <p className="text-sm text-slate-500 mb-6">Create your first prompt program to get started</p>
            <Button onClick={handleCreate}>
              <Plus size={18} className="mr-2" />
              Create your first program
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedPrograms.map((program) => (
              <ProgramCard
                key={program.id}
                program={program}
                onRename={handleRename}
                onDuplicate={handleDuplicate}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
