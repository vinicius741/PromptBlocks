import { Program } from '../types/blocks';

const STORAGE_KEY = 'promptblocks_programs';

export const getAllPrograms = (): Program[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data) as Program[];
  } catch {
    console.error('Failed to load programs from localStorage');
    return [];
  }
};

export const getProgram = (id: string): Program | undefined => {
  const programs = getAllPrograms();
  return programs.find(p => p.id === id);
};

export const saveProgram = (program: Program): void => {
  try {
    const programs = getAllPrograms();
    const index = programs.findIndex(p => p.id === program.id);
    
    program.updatedAt = new Date().toISOString();
    
    if (index >= 0) {
      programs[index] = program;
    } else {
      programs.push(program);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(programs));
  } catch (error) {
    console.error('Failed to save program:', error);
    throw new Error('Failed to save program. Storage may be full.');
  }
};

export const deleteProgram = (id: string): void => {
  try {
    const programs = getAllPrograms();
    const filtered = programs.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to delete program:', error);
    throw new Error('Failed to delete program.');
  }
};

export const duplicateProgram = (id: string): Program | undefined => {
  const program = getProgram(id);
  if (!program) return undefined;
  
  const now = new Date().toISOString();
  const duplicate: Program = {
    ...program,
    id: `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 9)}`,
    name: `${program.name} (copy)`,
    createdAt: now,
    updatedAt: now,
  };
  
  saveProgram(duplicate);
  return duplicate;
};
