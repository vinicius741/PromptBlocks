import { describe, it, expect } from 'vitest';
import { compilePrompt, compileBlock } from '@/lib/compiler';
import type { BlockInstance } from '@/types/blocks';

describe('compilePrompt', () => {
  it('compiles blocks in canvas order', () => {
    const blocks: BlockInstance[] = [
      { id: '1', type: 'task', data: { task: 'Write a poem' } },
      { id: '2', type: 'role', data: { role: 'poet' } },
    ];
    const result = compilePrompt(blocks);
    expect(result.indexOf('TASK')).toBeLessThan(result.indexOf('ROLE'));
  });

  it('respects reordering', () => {
    const ordered: BlockInstance[] = [
      { id: '1', type: 'role', data: { role: 'poet' } },
      { id: '2', type: 'task', data: { task: 'Write a poem' } },
    ];
    const result = compilePrompt(ordered);
    expect(result.indexOf('ROLE')).toBeLessThan(result.indexOf('TASK'));
  });

  it('formats constraints as bullet list', () => {
    const blocks: BlockInstance[] = [
      {
        id: '1',
        type: 'constraints',
        data: { items: ['Be concise', 'Use examples'] },
      },
    ];
    const result = compilePrompt(blocks);
    expect(result).toContain('- Be concise');
    expect(result).toContain('- Use examples');
  });

  it('skips empty sections', () => {
    const blocks: BlockInstance[] = [
      { id: '1', type: 'role', data: { role: '' } },
      { id: '2', type: 'task', data: { task: 'Do something' } },
    ];
    const result = compilePrompt(blocks);
    expect(result).not.toContain('ROLE');
    expect(result).toContain('TASK');
  });

  it('skips constraints with no items', () => {
    const blocks: BlockInstance[] = [
      { id: '1', type: 'constraints', data: { items: ['', ''] } },
    ];
    const result = compilePrompt(blocks);
    expect(result.trim()).toBe('');
  });

  it('compiles examples as numbered list', () => {
    const blocks: BlockInstance[] = [
      {
        id: '1',
        type: 'examples',
        data: { pairs: [{ input: 'hello', output: 'world' }] },
      },
    ];
    const result = compilePrompt(blocks);
    expect(result).toContain('Example 1');
    expect(result).toContain('**Input:** hello');
    expect(result).toContain('**Output:** world');
  });

  it('formats output format block', () => {
    const blocks: BlockInstance[] = [
      {
        id: '1',
        type: 'output-format',
        data: { format: 'json', jsonSchema: '{"type": "object"}' },
      },
    ];
    const result = compilePrompt(blocks);
    expect(result).toContain('Format: JSON');
    expect(result).toContain('JSON Schema');
  });

  it('separates sections with dividers', () => {
    const blocks: BlockInstance[] = [
      { id: '1', type: 'role', data: { role: 'assistant' } },
      { id: '2', type: 'task', data: { task: 'Help me' } },
    ];
    const result = compilePrompt(blocks);
    expect(result).toContain('---');
  });

  it('returns empty string for no blocks', () => {
    expect(compilePrompt([])).toBe('');
  });
});

describe('compileBlock', () => {
  it('compiles a single tone block', () => {
    const block: BlockInstance = {
      id: '1',
      type: 'tone',
      data: { tone: 'professional' },
    };
    expect(compileBlock(block)).toContain('Tone: professional');
  });

  it('returns empty for unknown block type', () => {
    const block = {
      id: '1',
      type: 'unknown' as never,
      data: {},
    } as unknown as BlockInstance;
    expect(compileBlock(block)).toBe('');
  });
});
