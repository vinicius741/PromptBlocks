import type { Program } from '@/types/blocks';

const STORAGE_KEY = 'promptblocks_programs';

/**
 * Get all programs from localStorage
 */
export function getPrograms(): Program[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data) as Program[];
  } catch (error) {
    console.error('Failed to load programs:', error);
    return [];
  }
}

/**
 * Get a single program by ID
 */
export function getProgram(id: string): Program | null {
  const programs = getPrograms();
  return programs.find((p) => p.id === id) || null;
}

/**
 * Save a program (create or update)
 */
export function saveProgram(program: Program): void {
  const programs = getPrograms();
  const index = programs.findIndex((p) => p.id === program.id);

  if (index >= 0) {
    programs[index] = { ...program, updatedAt: new Date().toISOString() };
  } else {
    programs.push({
      ...program,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(programs));
}

/**
 * Create a new program with default values
 */
export function createProgram(name: string, category = 'General'): Program {
  const program: Program = {
    id: crypto.randomUUID(),
    name,
    category,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    blocks: [],
  };

  saveProgram(program);
  return program;
}

/**
 * Delete a program by ID
 */
export function deleteProgram(id: string): void {
  const programs = getPrograms();
  const filtered = programs.filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

/**
 * Duplicate a program
 */
export function duplicateProgram(id: string): Program | null {
  const original = getProgram(id);
  if (!original) return null;

  const duplicate: Program = {
    ...original,
    id: crypto.randomUUID(),
    name: `${original.name} (Copy)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    blocks: original.blocks.map((block) => ({
      ...block,
      id: crypto.randomUUID(),
    })),
  };

  saveProgram(duplicate);
  return duplicate;
}

/**
 * Rename a program
 */
export function renameProgram(id: string, newName: string): Program | null {
  const program = getProgram(id);
  if (!program) return null;

  const updated = { ...program, name: newName };
  saveProgram(updated);
  return updated;
}
