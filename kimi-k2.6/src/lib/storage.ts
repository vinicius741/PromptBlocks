import type { Program } from '../types/blocks'

const STORAGE_KEY = 'promptblocks_programs'

export function loadPrograms(): Program[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Program[]
    return Array.isArray(parsed) ? parsed : []
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

export function saveProgram(program: Program): void {
  const programs = loadPrograms()
  const idx = programs.findIndex((p) => p.id === program.id)
  const updated = { ...program, updatedAt: Date.now() }
  if (idx >= 0) {
    programs[idx] = updated
  } else {
    programs.push(updated)
  }
  savePrograms(programs)
}

export function createProgram(name: string, category: string): Program {
  const now = Date.now()
  const program: Program = {
    id: `${now.toString(36)}-${Math.random().toString(36).slice(2, 9)}`,
    name: name || 'Untitled Program',
    category: category || 'General',
    createdAt: now,
    updatedAt: now,
    blocks: [],
  }
  saveProgram(program)
  return program
}

export function deleteProgram(id: string): void {
  const programs = loadPrograms().filter((p) => p.id !== id)
  savePrograms(programs)
}

export function duplicateProgram(id: string): Program | undefined {
  const original = getProgram(id)
  if (!original) return undefined
  const now = Date.now()
  const copy: Program = {
    ...original,
    id: `${now.toString(36)}-${Math.random().toString(36).slice(2, 9)}`,
    name: `${original.name} (Copy)`,
    createdAt: now,
    updatedAt: now,
  }
  saveProgram(copy)
  return copy
}
