import type { Program } from '@/types/blocks';

const STORAGE_KEY = 'promptblocks_programs';

function readStore(): Program[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeStore(programs: Program[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(programs));
}

export function getPrograms(): Program[] {
  return readStore();
}

export function getProgram(id: string): Program | undefined {
  return readStore().find((p) => p.id === id);
}

export function saveProgram(program: Program): void {
  const programs = readStore();
  const index = programs.findIndex((p) => p.id === program.id);
  if (index >= 0) {
    programs[index] = program;
  } else {
    programs.push(program);
  }
  writeStore(programs);
}

export function deleteProgram(id: string): void {
  const programs = readStore().filter((p) => p.id !== id);
  writeStore(programs);
}
