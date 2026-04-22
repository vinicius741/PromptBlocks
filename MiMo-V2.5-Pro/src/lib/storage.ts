import type { Program } from '../types/blocks'

const STORAGE_KEY = 'promptblocks_programs'

export function loadPrograms(): Program[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function savePrograms(programs: Program[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(programs))
}

export function getProgram(id: string): Program | undefined {
  return loadPrograms().find((p) => p.id === id)
}

export function createProgram(name: string, category: string): Program {
  const now = new Date().toISOString()
  const program: Program = {
    id: crypto.randomUUID(),
    name,
    category,
    createdAt: now,
    updatedAt: now,
    blocks: [],
  }
  const programs = loadPrograms()
  programs.push(program)
  savePrograms(programs)
  return program
}

export function updateProgram(program: Program): void {
  const programs = loadPrograms()
  const index = programs.findIndex((p) => p.id === program.id)
  if (index >= 0) {
    programs[index] = { ...program, updatedAt: new Date().toISOString() }
    savePrograms(programs)
  }
}

export function deleteProgram(id: string): void {
  const programs = loadPrograms().filter((p) => p.id !== id)
  savePrograms(programs)
}

export function duplicateProgram(id: string): Program | undefined {
  const source = getProgram(id)
  if (!source) return undefined
  const now = new Date().toISOString()
  const copy: Program = {
    ...JSON.parse(JSON.stringify(source)),
    id: crypto.randomUUID(),
    name: `${source.name} (Copy)`,
    createdAt: now,
    updatedAt: now,
  }
  const programs = loadPrograms()
  programs.push(copy)
  savePrograms(programs)
  return copy
}

export function renameProgram(id: string, name: string, category: string): void {
  const programs = loadPrograms()
  const index = programs.findIndex((p) => p.id === id)
  if (index >= 0) {
    programs[index].name = name
    programs[index].category = category
    programs[index].updatedAt = new Date().toISOString()
    savePrograms(programs)
  }
}
