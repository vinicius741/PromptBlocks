import { describe, it, expect } from 'vitest';
import { compilePrompt } from '../src/lib/compiler';
import type { BlockInstance } from '../src/types/blocks';

describe('compilePrompt', () => {
  it('returns empty string for empty blocks array', () => {
    expect(compilePrompt([])).toBe('');
  });

  it('compiles role block correctly', () => {
    const blocks: BlockInstance[] = [
      {
        id: '1',
        type: 'role',
        data: { role: 'You are a helpful assistant.' },
      },
    ];
    expect(compilePrompt(blocks)).toBe('## ROLE\n\nYou are a helpful assistant.');
  });

  it('skips empty blocks', () => {
    const blocks: BlockInstance[] = [
      {
        id: '1',
        type: 'role',
        data: { role: '' },
      },
      {
        id: '2',
        type: 'task',
        data: { task: 'Help the user.' },
      },
    ];
    expect(compilePrompt(blocks)).toBe('## TASK\n\nHelp the user.');
  });

  it('respects block ordering', () => {
    const blocks: BlockInstance[] = [
      {
        id: '1',
        type: 'role',
        data: { role: 'You are an expert.' },
      },
      {
        id: '2',
        type: 'task',
        data: { task: 'Write code.' },
      },
      {
        id: '3',
        type: 'tone',
        data: { tone: 'Professional' },
      },
    ];
    const result = compilePrompt(blocks);
    expect(result.indexOf('ROLE')).toBeLessThan(result.indexOf('TASK'));
    expect(result.indexOf('TASK')).toBeLessThan(result.indexOf('TONE'));
  });

  it('formats constraints as bullet list', () => {
    const blocks: BlockInstance[] = [
      {
        id: '1',
        type: 'constraints',
        data: { items: ['No jargon', 'Be concise', 'Use examples'] },
      },
    ];
    expect(compilePrompt(blocks)).toBe(
      '## CONSTRAINTS\n\n- No jargon\n- Be concise\n- Use examples'
    );
  });

  it('filters out empty constraint items', () => {
    const blocks: BlockInstance[] = [
      {
        id: '1',
        type: 'constraints',
        data: { items: ['Valid', '', 'Also valid'] },
      },
    ];
    expect(compilePrompt(blocks)).toBe('## CONSTRAINTS\n\n- Valid\n- Also valid');
  });

  it('formats examples as numbered list', () => {
    const blocks: BlockInstance[] = [
      {
        id: '1',
        type: 'examples',
        data: {
          examples: [
            { input: 'Hello', output: 'Hi there!' },
            { input: 'Goodbye', output: 'See you later!' },
          ],
        },
      },
    ];
    const result = compilePrompt(blocks);
    expect(result).toContain('### Example 1');
    expect(result).toContain('Input: Hello');
    expect(result).toContain('Output: Hi there!');
    expect(result).toContain('### Example 2');
    expect(result).toContain('Input: Goodbye');
    expect(result).toContain('Output: See you later!');
  });

  it('compiles output format with plain text', () => {
    const blocks: BlockInstance[] = [
      {
        id: '1',
        type: 'output-format',
        data: { format: 'plain' },
      },
    ];
    expect(compilePrompt(blocks)).toBe('## OUTPUT FORMAT\n\nRespond in plain text.');
  });

  it('compiles output format with bullet points', () => {
    const blocks: BlockInstance[] = [
      {
        id: '1',
        type: 'output-format',
        data: { format: 'bullet' },
      },
    ];
    expect(compilePrompt(blocks)).toBe('## OUTPUT FORMAT\n\nRespond in bullet points.');
  });

  it('compiles output format with JSON and schema', () => {
    const blocks: BlockInstance[] = [
      {
        id: '1',
        type: 'output-format',
        data: {
          format: 'json',
          jsonSchema: '{"type": "object"}',
        },
      },
    ];
    const result = compilePrompt(blocks);
    expect(result).toContain('## OUTPUT FORMAT');
    expect(result).toContain('Respond in JSON format.');
    expect(result).toContain('Schema:');
    expect(result).toContain('{"type": "object"}');
  });

  it('compiles output format with JSON without schema', () => {
    const blocks: BlockInstance[] = [
      {
        id: '1',
        type: 'output-format',
        data: { format: 'json' },
      },
    ];
    expect(compilePrompt(blocks)).toBe('## OUTPUT FORMAT\n\nRespond in JSON format.');
  });

  it('joins multiple sections with double newlines', () => {
    const blocks: BlockInstance[] = [
      {
        id: '1',
        type: 'role',
        data: { role: 'Expert' },
      },
      {
        id: '2',
        type: 'task',
        data: { task: 'Help users' },
      },
    ];
    expect(compilePrompt(blocks)).toBe('## ROLE\n\nExpert\n\n## TASK\n\nHelp users');
  });

  it('compiles full prompt with all block types', () => {
    const blocks: BlockInstance[] = [
      {
        id: '1',
        type: 'role',
        data: { role: 'Senior Developer' },
      },
      {
        id: '2',
        type: 'task',
        data: { task: 'Review code' },
      },
      {
        id: '3',
        type: 'context',
        data: { context: 'React project' },
      },
      {
        id: '4',
        type: 'constraints',
        data: { items: ['Focus on performance', 'Check types'] },
      },
      {
        id: '5',
        type: 'tone',
        data: { tone: 'Constructive' },
      },
      {
        id: '6',
        type: 'output-format',
        data: { format: 'bullet' },
      },
      {
        id: '7',
        type: 'examples',
        data: {
          examples: [{ input: 'Bad code', output: 'Suggestions' }],
        },
      },
    ];
    const result = compilePrompt(blocks);
    expect(result).toContain('## ROLE');
    expect(result).toContain('## TASK');
    expect(result).toContain('## CONTEXT');
    expect(result).toContain('## CONSTRAINTS');
    expect(result).toContain('## TONE');
    expect(result).toContain('## OUTPUT FORMAT');
    expect(result).toContain('## EXAMPLES');
  });
});
