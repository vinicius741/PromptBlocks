import { describe, expect, test } from 'vitest'
import { compilePrompt } from './compiler'
import type { BlockInstance } from '../types/blocks'

describe('compilePrompt', () => {
  test('respects canvas ordering', () => {
    const blocks: BlockInstance[] = [
      {
        id: 'b-task',
        type: 'task',
        data: { task: 'Summarize the change log' },
      },
      {
        id: 'b-role',
        type: 'role',
        data: { role: 'release manager' },
      },
      {
        id: 'b-tone',
        type: 'tone',
        data: { tone: 'direct and clear' },
      },
    ]

    const result = compilePrompt(blocks)

    expect(result.indexOf('TASK')).toBeLessThan(result.indexOf('ROLE'))
    expect(result.indexOf('ROLE')).toBeLessThan(result.indexOf('TONE'))
  })

  test('formats constraints as bullet list', () => {
    const blocks: BlockInstance[] = [
      {
        id: 'b-constraints',
        type: 'constraints',
        data: {
          items: ['Keep it under 120 words', 'Do not invent metrics'],
        },
      },
    ]

    const result = compilePrompt(blocks)

    expect(result).toContain('CONSTRAINTS')
    expect(result).toContain('- Keep it under 120 words')
    expect(result).toContain('- Do not invent metrics')
  })

  test('skips empty sections', () => {
    const blocks: BlockInstance[] = [
      {
        id: 'b-role',
        type: 'role',
        data: { role: '   ' },
      },
      {
        id: 'b-constraints',
        type: 'constraints',
        data: { items: ['   ', ''] },
      },
      {
        id: 'b-task',
        type: 'task',
        data: { task: 'Write a one-line summary' },
      },
    ]

    const result = compilePrompt(blocks)

    expect(result).toContain('TASK')
    expect(result).not.toContain('ROLE')
    expect(result).not.toContain('CONSTRAINTS')
  })
})
