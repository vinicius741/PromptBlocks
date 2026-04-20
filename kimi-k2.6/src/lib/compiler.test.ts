import { describe, it, expect } from 'vitest'
import { compilePrompt, compileBlock } from './compiler'
import type { BlockInstance } from '../types/blocks'

describe('compileBlock', () => {
  it('compiles role block', () => {
    const block: BlockInstance = { id: '1', type: 'role', data: { role: 'Expert Developer' } }
    expect(compileBlock(block)).toBe('ROLE\nExpert Developer')
  })

  it('returns null for empty role', () => {
    const block: BlockInstance = { id: '1', type: 'role', data: { role: '' } }
    expect(compileBlock(block)).toBeNull()
  })

  it('compiles constraints as bullets', () => {
    const block: BlockInstance = {
      id: '2',
      type: 'constraints',
      data: { items: ['Be concise', 'Use TypeScript'] },
    }
    expect(compileBlock(block)).toBe('CONSTRAINTS\n- Be concise\n- Use TypeScript')
  })

  it('skips empty constraint items', () => {
    const block: BlockInstance = {
      id: '2',
      type: 'constraints',
      data: { items: ['Be concise', '', 'Use TypeScript'] },
    }
    expect(compileBlock(block)).toBe('CONSTRAINTS\n- Be concise\n- Use TypeScript')
  })

  it('returns null when all constraints are empty', () => {
    const block: BlockInstance = {
      id: '2',
      type: 'constraints',
      data: { items: ['', ' '] },
    }
    expect(compileBlock(block)).toBeNull()
  })

  it('compiles examples as numbered list', () => {
    const block: BlockInstance = {
      id: '3',
      type: 'examples',
      data: {
        examples: [
          { input: 'Hello', output: 'Hi' },
          { input: 'Bye', output: 'Goodbye' },
        ],
      },
    }
    expect(compileBlock(block)).toBe(
      'EXAMPLES\nExample 1:\nInput:\nHello\nOutput:\nHi\n\nExample 2:\nInput:\nBye\nOutput:\nGoodbye',
    )
  })
})

describe('compilePrompt', () => {
  it('respects canvas ordering', () => {
    const blocks: BlockInstance[] = [
      { id: '1', type: 'task', data: { task: 'Do this' } },
      { id: '2', type: 'role', data: { role: 'Expert' } },
    ]
    expect(compilePrompt(blocks)).toBe('TASK\nDo this\n\nROLE\nExpert')
  })

  it('skips empty sections', () => {
    const blocks: BlockInstance[] = [
      { id: '1', type: 'role', data: { role: '' } },
      { id: '2', type: 'task', data: { task: 'Do this' } },
      { id: '3', type: 'tone', data: { tone: '   ' } },
    ]
    expect(compilePrompt(blocks)).toBe('TASK\nDo this')
  })

  it('returns empty string for no blocks', () => {
    expect(compilePrompt([])).toBe('')
  })

  it('formats constraints as bullet list within full prompt', () => {
    const blocks: BlockInstance[] = [
      { id: '1', type: 'role', data: { role: 'Developer' } },
      { id: '2', type: 'constraints', data: { items: ['Use TS', 'Write tests'] } },
    ]
    expect(compilePrompt(blocks)).toBe('ROLE\nDeveloper\n\nCONSTRAINTS\n- Use TS\n- Write tests')
  })
})
