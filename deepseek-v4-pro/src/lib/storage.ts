import type { Program } from '../types/blocks';

const STORAGE_KEY = 'prompt_blocks_programs';

export const getPrograms = (): Program[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    console.error('Failed to parse programs from localStorage');
    return [];
  }
};

export const savePrograms = (programs: Program[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(programs));
};

export const getProgram = (id: string): Program | undefined => {
  return getPrograms().find((p) => p.id === id);
};

export const saveProgram = (program: Program): Program => {
  const programs = getPrograms();
  const index = programs.findIndex((p) => p.id === program.id);
  const updated = { ...program, updatedAt: new Date().toISOString() };

  if (index >= 0) {
    programs[index] = updated;
  } else {
    programs.push(updated);
  }

  savePrograms(programs);
  return updated;
};

export const deleteProgram = (id: string): void => {
  savePrograms(getPrograms().filter((p) => p.id !== id));
};
