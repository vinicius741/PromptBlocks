import { useState } from 'react';
import { getPrograms, createProgram, deleteProgram, duplicateProgram, renameProgram } from '@/lib/storage';
import { ProgramCard } from '@/components/ProgramCard';
import { useNavigate } from 'react-router-dom';

export function ProgramsPage() {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState(getPrograms());
  const [showNewModal, setShowNewModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('General');

  const handleCreate = () => {
    if (newName.trim()) {
      const program = createProgram(newName.trim(), newCategory);
      setPrograms(getPrograms());
      setShowNewModal(false);
      setNewName('');
      setNewCategory('General');
      navigate(`/builder/${program.id}`);
    }
  };

  const handleRename = (id: string, newName: string) => {
    renameProgram(id, newName);
    setPrograms(getPrograms());
  };

  const handleDuplicate = (id: string) => {
    duplicateProgram(id);
    setPrograms(getPrograms());
  };

  const handleDelete = (id: string) => {
    deleteProgram(id);
    setPrograms(getPrograms());
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">PromptBlocks</h1>
          <button
            onClick={() => setShowNewModal(true)}
            className="rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
          >
            + New Program
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl p-6">
        {programs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="mb-4 text-6xl text-gray-300">📦</div>
            <h2 className="mb-2 text-xl font-semibold text-gray-700">No programs yet</h2>
            <p className="mb-6 text-gray-500">Create your first prompt program to get started</p>
            <button
              onClick={() => setShowNewModal(true)}
              className="rounded bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
            >
              + Create Program
            </button>
          </div>
        ) : (
          <div>
            <h2 className="mb-4 text-lg font-semibold text-gray-700">Your Programs</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {programs
                .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                .map((program) => (
                  <ProgramCard
                    key={program.id}
                    program={program}
                    onRename={handleRename}
                    onDuplicate={handleDuplicate}
                    onDelete={handleDelete}
                  />
                ))}
            </div>
          </div>
        )}
      </main>

      {/* New Program Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">Create New Program</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="My Prompt Program"
                  className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCreate();
                  }}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="General"
                  className="w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowNewModal(false);
                  setNewName('');
                  setNewCategory('General');
                }}
                className="rounded border border-gray-300 px-4 py-2 text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!newName.trim()}
                className="rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
