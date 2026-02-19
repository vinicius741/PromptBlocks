import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Program } from "../types/blocks";
import { getPrograms, saveProgram, deleteProgram } from "../lib/storage";
import { generateId } from "../lib/ids";
import { Plus, Copy, Trash2, Edit } from "lucide-react";

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setPrograms(getPrograms());
  }, []);

  const handleCreate = () => {
    const newProgram: Program = {
      id: generateId(),
      name: "Untitled Program",
      category: "General",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      blocks: [],
    };
    saveProgram(newProgram);
    navigate(`/builder/${newProgram.id}`);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this program?")) {
      deleteProgram(id);
      setPrograms(getPrograms());
    }
  };

  const handleDuplicate = (e: React.MouseEvent, program: Program) => {
    e.stopPropagation();
    const newProgram: Program = {
      ...program,
      id: generateId(),
      name: `${program.name} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    saveProgram(newProgram);
    setPrograms(getPrograms());
  };

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">PromptBlocks</h1>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          <Plus size={20} />
          Create New Program
        </button>
      </div>

      {programs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-medium text-gray-600 mb-2">
            No programs yet
          </h2>
          <p className="text-gray-400">
            Create your first prompt block program to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program) => (
            <div
              key={program.id}
              onClick={() => navigate(`/builder/${program.id}`)}
              className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition cursor-pointer flex flex-col group"
            >
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg text-gray-900 truncate pr-2">
                    {program.name}
                  </h3>
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full whitespace-nowrap">
                    {program.category}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  Updated {new Date(program.updatedAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const newName = prompt("Enter new name", program.name);
                    if (newName) {
                      const updated = {
                        ...program,
                        name: newName,
                        updatedAt: Date.now(),
                      };
                      saveProgram(updated);
                      setPrograms(getPrograms());
                    }
                  }}
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                  title="Rename"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={(e) => handleDuplicate(e, program)}
                  className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded"
                  title="Duplicate"
                >
                  <Copy size={16} />
                </button>
                <button
                  onClick={(e) => handleDelete(e, program.id)}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
