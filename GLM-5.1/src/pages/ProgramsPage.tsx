import { useState, useCallback } from 'react';
import { getPrograms, saveProgram, deleteProgram } from '@/lib/storage';
import { generateId } from '@/lib/ids';
import type { Program } from '@/types/blocks';
import ProgramCard from '@/components/ProgramCard';

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>(() => getPrograms());

  const refresh = useCallback(() => setPrograms(getPrograms()), []);

  const handleCreate = () => {
    const name = window.prompt('Program name:');
    if (!name?.trim()) return;
    const now = new Date().toISOString();
    const program: Program = {
      id: generateId(),
      name: name.trim(),
      category: '',
      createdAt: now,
      updatedAt: now,
      blocks: [],
    };
    saveProgram(program);
    refresh();
  };

  const handleRename = (id: string, name: string) => {
    const program = getPrograms().find((p) => p.id === id);
    if (!program) return;
    saveProgram({ ...program, name, updatedAt: new Date().toISOString() });
    refresh();
  };

  const handleDuplicate = (id: string) => {
    const program = getPrograms().find((p) => p.id === id);
    if (!program) return;
    const now = new Date().toISOString();
    const dup: Program = {
      ...program,
      id: generateId(),
      name: `${program.name} (copy)`,
      createdAt: now,
      updatedAt: now,
    };
    saveProgram(dup);
    refresh();
  };

  const handleDelete = (id: string) => {
    deleteProgram(id);
    refresh();
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">PromptBlocks</h1>
          <p className="text-sm text-gray-500">Build AI prompts visually with drag-and-drop blocks</p>
        </div>
        <button
          onClick={handleCreate}
          className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
        >
          + New Program
        </button>
      </div>

      {programs.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-200 py-16 text-center text-gray-400">
          <p className="mb-2 text-lg">No programs yet</p>
          <p className="text-sm">Click "New Program" to get started.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => (
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
    </div>
  );
}
