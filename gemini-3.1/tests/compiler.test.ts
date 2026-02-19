import { describe, it, expect } from 'vitest';
import { compilePrompt } from '../src/lib/compiler';
import { BlockInstance } from '../src/types/blocks';

describe('compilePrompt', () => {
  it('compiles an empty list to empty string', () => {
    expect(compilePrompt([])).toBe('');
  });

  it('compiles Role block', () => {
    const blocks: BlockInstance[] = [{ id: '1', type: 'Role', data: { role: 'Assistant' } }];
    expect(compilePrompt(blocks)).toBe('ROLE\nYou are a Assistant');
  });

  it('skips empty Role block', () => {
    const blocks: BlockInstance[] = [{ id: '1', type: 'Role', data: { role: '   ' } }];
    expect(compilePrompt(blocks)).toBe('');
  });

  it('compiles Constraints as bullet list', () => {
    const blocks: BlockInstance[] = [
      { id: '1', type: 'Constraints', data: { constraints: ['Be polite', '', 'Use emojis'] } }
    ];
    expect(compilePrompt(blocks)).toBe('CONSTRAINTS\n- Be polite\n- Use emojis');
  });

  it('skips empty Constraints block', () => {
    const blocks: BlockInstance[] = [
      { id: '1', type: 'Constraints', data: { constraints: ['', '  '] } }
    ];
    expect(compilePrompt(blocks)).toBe('');
  });

  it('compiles multiple blocks with spacing', () => {
    const blocks: BlockInstance[] = [
      { id: '1', type: 'Role', data: { role: 'Expert' } },
      { id: '2', type: 'Task', data: { task: 'Code something.' } }
    ];
    expect(compilePrompt(blocks)).toBe('ROLE\nYou are a Expert\n\nTASK\nYour task: Code something.');
  });

  it('compiles Examples as numbered list', () => {
    const blocks: BlockInstance[] = [
      { id: '1', type: 'Examples', data: { examples: [
        { input: 'hi', output: 'hello' },
        { input: '', output: '' },
        { input: 'bye', output: 'goodbye' }
      ] } }
    ];
    expect(compilePrompt(blocks)).toBe('EXAMPLES\nExample 1:\nInput: hi\nOutput: hello\n\nExample 2:\nInput: bye\nOutput: goodbye');
  });

  it('compiles OutputFormat correctly with and without schema', () => {
    const blocks1: BlockInstance[] = [
      { id: '1', type: 'OutputFormat', data: { format: 'JSON', schema: '{"type":"object"}' } }
    ];
    expect(compilePrompt(blocks1)).toBe('OUTPUT FORMAT\nFormat: JSON\nSchema:\n{"type":"object"}');

    const blocks2: BlockInstance[] = [
      { id: '1', type: 'OutputFormat', data: { format: 'plain text', schema: '  ' } }
    ];
    expect(compilePrompt(blocks2)).toBe('OUTPUT FORMAT\nFormat: plain text');
  });
});
