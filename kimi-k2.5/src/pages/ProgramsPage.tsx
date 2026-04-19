import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, LayoutGrid, List, Sparkles } from 'lucide-react';
import { ProgramCard } from '@/components/ProgramCard';
import { getAllPrograms, saveProgram, deleteProgram, duplicateProgram } from '@/lib/storage';
import { generateTimestampId } from '@/lib/ids';
import type { Program } from '@/types/blocks';

export function ProgramsPage() {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    setPrograms(getAllPrograms());
  }, []);

  const filteredPrograms = programs.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = useCallback(() => {
    const id = generateTimestampId();
    const newProgram: Program = {
      id,
      name: `New Program ${programs.length + 1}`,
      category: 'General',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      blocks: [],
    };
    saveProgram(newProgram);
    navigate(`/builder/${id}`);
  }, [navigate, programs.length]);

  const handleRename = useCallback(
    (id: string, newName: string) => {
      const program = programs.find((p) => p.id === id);
      if (!program) return;

      const updated = { ...program, name: newName, updatedAt: Date.now() };
      saveProgram(updated);
      setPrograms(getAllPrograms());
    },
    [programs]
  );

  const handleDuplicate = useCallback(
    (id: string) => {
      const program = programs.find((p) => p.id === id);
      if (!program) return;

      const newId = generateTimestampId();
      const newName = `${program.name} (Copy)`;
      duplicateProgram(id, newId, newName);
      setPrograms(getAllPrograms());
    },
    [programs]
  );

  const handleDelete = useCallback(
    (id: string) => {
      if (confirm('Are you sure you want to delete this program?')) {
        deleteProgram(id);
        setPrograms(getAllPrograms());
      }
    },
    []
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">PromptBlocks</h1>
                <p className="text-xs text-gray-500">Visual Prompt Builder</p>
              </div>
            </div>

            <button
              onClick={handleCreate}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Program
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search programs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Programs Grid/List */}
        {filteredPrograms.length > 0 ? (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
                : 'space-y-3'
            }
          >
            {filteredPrograms.map((program) => (
              <ProgramCard
                key={program.id}
                program={program}
                onClick={() => navigate(`/builder/${program.id}`)}
                onRename={(newName) => handleRename(program.id, newName)}
                onDuplicate={() => handleDuplicate(program.id)}
                onDelete={() => handleDelete(program.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? 'No programs found' : 'No programs yet'}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              {searchQuery
                ? 'Try adjusting your search query to find what you\'re looking for.'
                : 'Create your first program to start building AI prompts with blocks.'}
            </p>
            {!searchQuery && (
              <button
                onClick={handleCreate}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors mx-auto"
              >
                <Plus className="w-4 h-4" />
                Create Program
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
