import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Edit2, Copy, Play } from 'lucide-react';
import type { Program } from '../types/blocks';
import { getPrograms, saveProgram, deleteProgram } from '../lib/storage';
import { generateId } from '../lib/ids';

const ProgramsPage: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setPrograms(getPrograms());
  }, []);

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

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this program?')) {
      deleteProgram(id);
      setPrograms(getPrograms());
    }
  };

  const handleDuplicate = (program: Program, e: React.MouseEvent) => {
    e.stopPropagation();
    const duplicated: Program = {
      ...program,
      id: generateId(),
      name: `${program.name} (Copy)`,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    saveProgram(duplicated);
    setPrograms(getPrograms());
  };

  const handleRename = (program: Program, e: React.MouseEvent) => {
    e.stopPropagation();
    const newName = prompt('Enter new name:', program.name);
    if (newName && newName !== program.name) {
      saveProgram({ ...program, name: newName });
      setPrograms(getPrograms());
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
          <p className="text-gray-500 mb-4">No programs found. Start by creating your first one!</p>
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
            <div
              key={program.id}
              onClick={() => navigate(`/builder/${program.id}`)}
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
                    onClick={(e) => handleRename(program, e)}
                    className="p-1 hover:bg-gray-100 rounded text-gray-600"
                    title="Rename"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={(e) => handleDuplicate(program, e)}
                    className="p-1 hover:bg-gray-100 rounded text-gray-600"
                    title="Duplicate"
                  >
                    <Copy size={16} />
                  </button>
                  <button
                    onClick={(e) => handleDelete(program.id, e)}
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
          ))}
        </div>
      )}
    </div>
  );
};

export default ProgramsPage;
