import type { Program } from '../types/blocks'
import { randomId } from './ids'

const STORAGE_KEY = 'promptblocks.programs.v1'

export function listPrograms(): Program[] {
  return loadPrograms().sort(
    (left, right) =>
      new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime(),
  )
}

export function getProgramById(programId: string): Program | undefined {
  return loadPrograms().find((program) => program.id === programId)
}

export function createProgram(input?: {
  name?: string
  category?: string
}): Program {
  const now = new Date().toISOString()
  const program: Program = {
    id: randomId(),
    name: input?.name?.trim() || 'Untitled Program',
    category: input?.category?.trim() || 'General',
    createdAt: now,
    updatedAt: now,
    blocks: [],
  }

  const programs = loadPrograms()
  persistPrograms([program, ...programs])
  return program
}

export function saveProgram(program: Program): Program {
  const now = new Date().toISOString()
  const nextProgram: Program = {
    ...cloneValue(program),
    updatedAt: now,
  }

  const programs = loadPrograms()
  const index = programs.findIndex((item) => item.id === nextProgram.id)

  if (index >= 0) {
    programs[index] = nextProgram
  } else {
    programs.unshift(nextProgram)
  }

  persistPrograms(programs)
  return nextProgram
}

export function updateProgramMetadata(
  programId: string,
  updates: {
    name?: string
    category?: string
  },
): Program | undefined {
  const programs = loadPrograms()
  const index = programs.findIndex((item) => item.id === programId)

  if (index < 0) {
    return undefined
  }

  const existing = programs[index]
  const now = new Date().toISOString()
  const nextProgram: Program = {
    ...existing,
    name: updates.name?.trim() || existing.name,
    category: updates.category?.trim() || existing.category,
    updatedAt: now,
  }

  programs[index] = nextProgram
  persistPrograms(programs)
  return nextProgram
}

export function deleteProgram(programId: string): void {
  const programs = loadPrograms().filter((program) => program.id !== programId)
  persistPrograms(programs)
}

export function duplicateProgram(programId: string): Program | undefined {
  const existing = getProgramById(programId)

  if (!existing) {
    return undefined
  }

  const now = new Date().toISOString()
  const duplicate: Program = {
    ...cloneValue(existing),
    id: randomId(),
    name: `${existing.name} (Copy)`,
    createdAt: now,
    updatedAt: now,
  }

  const programs = loadPrograms()
  persistPrograms([duplicate, ...programs])
  return duplicate
}

function loadPrograms(): Program[] {
  if (!canUseLocalStorage()) {
    return []
  }

  const raw = window.localStorage.getItem(STORAGE_KEY)

  if (!raw) {
    return []
  }

  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.filter(isProgramLike).map((program) => cloneValue(program))
  } catch {
    return []
  }
}

function persistPrograms(programs: Program[]): void {
  if (!canUseLocalStorage()) {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(programs))
}

function canUseLocalStorage(): boolean {
  return (
    typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
  )
}

function isProgramLike(program: unknown): program is Program {
  if (!program || typeof program !== 'object') {
    return false
  }

  const candidate = program as Record<string, unknown>
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.name === 'string' &&
    typeof candidate.category === 'string' &&
    typeof candidate.createdAt === 'string' &&
    typeof candidate.updatedAt === 'string' &&
    Array.isArray(candidate.blocks)
  )
}

function cloneValue<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}
