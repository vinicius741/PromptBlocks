import type { Program } from '../types/blocks';

const STORAGE_KEY = 'prompt_blocks_programs';

export const getPrograms = (): Program[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to parse programs from localStorage', e);
    return [];
  }
};

export const savePrograms = (programs: Program[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(programs));
};

export const getProgram = (id: string): Program | undefined => {
  const programs = getPrograms();
  return programs.find((p) => p.id === id);
};

export const saveProgram = (program: Program) => {
  const programs = getPrograms();
  const index = programs.findIndex((p) => p.id === program.id);
  const updatedProgram = { ...program, updatedAt: new Date().toISOString() };
  
  if (index >= 0) {
    programs[index] = updatedProgram;
  } else {
    programs.push(updatedProgram);
  }
  savePrograms(programs);
  return updatedProgram;
};

export const deleteProgram = (id: string) => {
  const programs = getPrograms();
  const filtered = programs.filter((p) => p.id !== id);
  savePrograms(filtered);
};
