import type { Program } from "../types/blocks";

const STORAGE_KEY = "promptblocks_programs";

export function getPrograms(): Program[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to parse programs from localStorage", e);
    return [];
  }
}

export function savePrograms(programs: Program[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(programs));
  } catch (e) {
    console.error("Failed to save programs to localStorage", e);
  }
}

export function getProgram(id: string): Program | undefined {
  return getPrograms().find((p) => p.id === id);
}

export function saveProgram(program: Program) {
  const programs = getPrograms();
  const index = programs.findIndex((p) => p.id === program.id);
  if (index >= 0) {
    programs[index] = program;
  } else {
    programs.push(program);
  }
  savePrograms(programs);
}

export function deleteProgram(id: string) {
  const programs = getPrograms();
  savePrograms(programs.filter((p) => p.id !== id));
}
