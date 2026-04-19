/**
 * LocalStorage persistence for PromptBlocks
 * 
 * All program data is stored in localStorage under the key 'promptblocks_programs'.
 * This module provides CRUD operations for programs.
 */

import type { Program } from '@/types/blocks';

const STORAGE_KEY = 'promptblocks_programs';

/**
 * Get all programs from localStorage
 */
export function getAllPrograms(): Program[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const programs = JSON.parse(data) as Program[];
    return programs.sort((a, b) => b.updatedAt - a.updatedAt);
  } catch (error) {
    console.error('Failed to load programs from localStorage:', error);
    return [];
  }
}

/**
 * Get a single program by ID
 */
export function getProgram(id: string): Program | null {
  const programs = getAllPrograms();
  return programs.find((p) => p.id === id) || null;
}

/**
 * Save a program (create or update)
 */
export function saveProgram(program: Program): void {
  try {
    const programs = getAllPrograms();
    const existingIndex = programs.findIndex((p) => p.id === program.id);

    if (existingIndex >= 0) {
      // Update existing
      programs[existingIndex] = program;
    } else {
      // Create new
      programs.push(program);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(programs));
  } catch (error) {
    console.error('Failed to save program to localStorage:', error);
    throw new Error('Failed to save program');
  }
}

/**
 * Delete a program by ID
 */
export function deleteProgram(id: string): void {
  try {
    const programs = getAllPrograms();
    const filtered = programs.filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to delete program from localStorage:', error);
    throw new Error('Failed to delete program');
  }
}

/**
 * Duplicate a program
 */
export function duplicateProgram(id: string, newId: string, newName: string): Program | null {
  const program = getProgram(id);
  if (!program) return null;

  const now = Date.now();
  const duplicated: Program = {
    ...program,
    id: newId,
    name: newName,
    createdAt: now,
    updatedAt: now,
    blocks: program.blocks.map((block) => ({
      ...block,
      id: `${newId}_${Math.random().toString(36).substr(2, 9)}`,
    })),
  };

  saveProgram(duplicated);
  return duplicated;
}

/**
 * Export all programs as JSON
 */
export function exportPrograms(): string {
  const programs = getAllPrograms();
  return JSON.stringify(programs, null, 2);
}

/**
 * Import programs from JSON
 */
export function importPrograms(json: string): Program[] {
  try {
    const programs = JSON.parse(json) as Program[];
    if (!Array.isArray(programs)) {
      throw new Error('Invalid format: expected array');
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(programs));
    return programs;
  } catch (error) {
    console.error('Failed to import programs:', error);
    throw new Error('Failed to import programs: invalid format');
  }
}