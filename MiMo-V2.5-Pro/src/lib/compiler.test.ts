import { describe, it, expect } from 'vitest'
import { compilePrompt } from './compiler'
import type { BlockInstance, ConstraintsData, ExamplesData } from '../types/blocks'

describe('compilePrompt', () => {
  it('respects canvas ordering', () => {
    const blocks: BlockInstance[] = [
      { id: '1', type: 'role', data: { role: 'Senior Engineer' } },
      { id: '2', type: 'task', data: { task: 'Review code' } },
      { id: '3', type: 'tone', data: { tone: 'Professional' } },
    ]
    const result = compilePrompt(blocks)
    const roleIdx = result.indexOf('ROLE')
    const taskIdx = result.indexOf('TASK')
    const toneIdx = result.indexOf('TONE')
    expect(roleIdx).toBeLessThan(taskIdx)
    expect(taskIdx).toBeLessThan(toneIdx)
  })

  it('formats constraints as bullet list', () => {
    const blocks: BlockInstance[] = [
      {
        id: '1',
        type: 'constraints',
        data: { items: ['Be concise', 'Use examples', 'No jargon'] } as ConstraintsData,
      },
    ]
    const result = compilePrompt(blocks)
    expect(result).toContain('CONSTRAINTS')
    expect(result).toContain('- Be concise')
    expect(result).toContain('- Use examples')
    expect(result).toContain('- No jargon')
  })

  it('skips empty sections', () => {
    const blocks: BlockInstance[] = [
      { id: '1', type: 'role', data: { role: '' } },
      { id: '2', type: 'task', data: { task: 'Write code' } },
      { id: '3', type: 'tone', data: { tone: '  ' } },
    ]
    const result = compilePrompt(blocks)
    expect(result).not.toContain('ROLE')
    expect(result).toContain('TASK')
    expect(result).not.toContain('TONE')
  })

  it('formats examples as numbered list', () => {
    const blocks: BlockInstance[] = [
      {
        id: '1',
        type: 'examples',
        data: {
          examples: [
            { id: 'a', input: 'Hello', output: 'Hi there' },
            { id: 'b', input: 'Bye', output: 'Goodbye' },
          ],
        } as ExamplesData,
      },
    ]
    const result = compilePrompt(blocks)
    expect(result).toContain('Example 1')
    expect(result).toContain('Input: Hello')
    expect(result).toContain('Output: Hi there')
    expect(result).toContain('Example 2')
    expect(result).toContain('Input: Bye')
    expect(result).toContain('Output: Goodbye')
  })

  it('handles empty constraints list', () => {
    const blocks: BlockInstance[] = [
      {
        id: '1',
        type: 'constraints',
        data: { items: ['', '  '] } as ConstraintsData,
      },
    ]
    const result = compilePrompt(blocks)
    expect(result).toBe('')
  })

  it('handles output format with JSON schema', () => {
    const blocks: BlockInstance[] = [
      {
        id: '1',
        type: 'output_format',
        data: {
          format: 'json',
          jsonSchema: '{"type":"object","properties":{"name":{"type":"string"}}}',
        },
      },
    ]
    const result = compilePrompt(blocks)
    expect(result).toContain('OUTPUT FORMAT')
    expect(result).toContain('JSON')
    expect(result).toContain('JSON Schema:')
    expect(result).toContain('"type":"object"')
  })

  it('returns empty string for empty blocks array', () => {
    expect(compilePrompt([])).toBe('')
  })

  it('handles mixed block types in order', () => {
    const blocks: BlockInstance[] = [
      { id: '1', type: 'role', data: { role: 'Writer' } },
      { id: '2', type: 'context', data: { context: 'Blog post' } },
      {
        id: '3',
        type: 'constraints',
        data: { items: ['500 words max'] } as ConstraintsData,
      },
    ]
    const result = compilePrompt(blocks)
    expect(result).toContain('You are a Writer')
    expect(result).toContain('Context: Blog post')
    expect(result).toContain('- 500 words max')
  })
})
