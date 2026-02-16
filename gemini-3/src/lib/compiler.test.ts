import { describe, it, expect } from 'vitest';
import { compilePrompt } from './compiler';
import type { BlockInstance } from '../types/blocks';

describe('compilePrompt', () => {
  it('respects canvas ordering', () => {
    const blocks: BlockInstance[] = [
      { id: '1', type: 'role', data: { role: 'Assistant' } },
      { id: '2', type: 'task', data: { task: 'Help the user' } },
    ];
    const result = compilePrompt(blocks);
    expect(result).toContain('ROLE');
    expect(result).toContain('TASK');
    expect(result.indexOf('ROLE')).toBeLessThan(result.indexOf('TASK'));
  });

  it('constraints bullet formatting', () => {
    const blocks: BlockInstance[] = [
      { id: '1', type: 'constraints', data: { constraints: ['Be nice', 'Be quick'] } },
    ];
    const result = compilePrompt(blocks);
    expect(result).toContain('- Be nice');
    expect(result).toContain('- Be quick');
  });

  it('skips empty sections', () => {
    const blocks: BlockInstance[] = [
      { id: '1', type: 'role', data: { role: '' } },
      { id: '2', type: 'task', data: { task: 'Help' } },
    ];
    const result = compilePrompt(blocks);
    expect(result).not.toContain('ROLE');
    expect(result).toContain('TASK');
  });

  it('formats examples correctly', () => {
    const blocks: BlockInstance[] = [
      {
        id: '1',
        type: 'examples',
        data: {
          examples: [
            { input: 'Hi', output: 'Hello' },
            { input: 'Bye', output: 'Goodbye' },
          ],
        },
      },
    ];
    const result = compilePrompt(blocks);
    expect(result).toContain('Example 1:');
    expect(result).toContain('Input: Hi');
    expect(result).toContain('Output: Hello');
    expect(result).toContain('Example 2:');
  });
});
