import { describe, it, expect } from 'vitest';
import { compilePrompt, compileBlock, blockHasContent } from './compiler';
import type { BlockInstance } from '@/types/blocks';

describe('compilePrompt', () => {
  it('should compile a single role block', () => {
    const blocks: BlockInstance[] = [
      { id: '1', type: 'role', data: { role: 'Python Expert' } },
    ];
    const result = compilePrompt(blocks);
    expect(result).toContain('ROLE');
    expect(result).toContain('You are a Python Expert');
  });

  it('should respect canvas ordering', () => {
    const blocks: BlockInstance[] = [
      { id: '1', type: 'task', data: { task: 'Write code' } },
      { id: '2', type: 'role', data: { role: 'Developer' } },
    ];
    const result = compilePrompt(blocks);
    const taskIndex = result.indexOf('TASK');
    const roleIndex = result.indexOf('ROLE');
    expect(taskIndex).toBeLessThan(roleIndex);
  });

  it('should skip empty sections', () => {
    const blocks: BlockInstance[] = [
      { id: '1', type: 'role', data: { role: 'Expert' } },
      { id: '2', type: 'context', data: { context: '' } },
      { id: '3', type: 'task', data: { task: 'Do something' } },
    ];
    const result = compilePrompt(blocks);
    expect(result).toContain('ROLE');
    expect(result).toContain('TASK');
    expect(result).not.toContain('CONTEXT');
  });

  it('should format constraints as bullet list', () => {
    const blocks: BlockInstance[] = [
      {
        id: '1',
        type: 'constraints',
        data: { constraints: ['Use Python', 'No external libs', ''] },
      },
    ];
    const result = compilePrompt(blocks);
    expect(result).toContain('CONSTRAINTS');
    expect(result).toContain('- Use Python');
    expect(result).toContain('- No external libs');
    expect(result).not.toMatch(/^- $/m); // Should not have empty bullet
  });

  it('should format examples as numbered list', () => {
    const blocks: BlockInstance[] = [
      {
        id: '1',
        type: 'examples',
        data: {
          examples: [
            { input: 'Hello', output: 'Hi there!' },
            { input: 'How are you?', output: 'I am good!' },
          ],
        },
      },
    ];
    const result = compilePrompt(blocks);
    expect(result).toContain('EXAMPLES');
    expect(result).toContain('Example 1:');
    expect(result).toContain('Example 2:');
    expect(result).toContain('Input: Hello');
    expect(result).toContain('Output: Hi there!');
  });

  it('should skip examples with empty input and output', () => {
    const blocks: BlockInstance[] = [
      {
        id: '1',
        type: 'examples',
        data: {
          examples: [
            { input: 'Hello', output: 'Hi!' },
            { input: '', output: '' },
            { input: 'Goodbye', output: 'Bye!' },
          ],
        },
      },
    ];
    const result = compilePrompt(blocks);
    expect(result).toContain('Example 1:');
    expect(result).toContain('Example 2:');
    expect(result).not.toContain('Example 3:');
  });

  it('should include JSON schema when output format is JSON', () => {
    const blocks: BlockInstance[] = [
      {
        id: '1',
        type: 'output_format',
        data: {
          format: 'json',
          jsonSchema: '{"type": "object"}',
        },
      },
    ];
    const result = compilePrompt(blocks);
    expect(result).toContain('OUTPUT FORMAT');
    expect(result).toContain('Output format: JSON');
    expect(result).toContain('Schema:');
    expect(result).toContain('{"type": "object"}');
  });

  it('should return empty string for no blocks', () => {
    const result = compilePrompt([]);
    expect(result).toBe('');
  });

  it('should handle mixed content with proper section separators', () => {
    const blocks: BlockInstance[] = [
      { id: '1', type: 'role', data: { role: 'Assistant' } },
      { id: '2', type: 'task', data: { task: 'Help me' } },
      { id: '3', type: 'tone', data: { tone: 'Friendly' } },
    ];
    const result = compilePrompt(blocks);
    expect(result).toContain('---');
    const separatorCount = (result.match(/---/g) || []).length;
    expect(separatorCount).toBe(2); // Between 3 sections
  });

  it('should trim whitespace from content', () => {
    const blocks: BlockInstance[] = [
      { id: '1', type: 'role', data: { role: '  Expert  ' } },
    ];
    const result = compilePrompt(blocks);
    expect(result).toContain('You are a Expert');
    expect(result).not.toContain('You are a  Expert  ');
  });
});

describe('compileBlock', () => {
  it('should return null for empty role', () => {
    const block: BlockInstance = {
      id: '1',
      type: 'role',
      data: { role: '' },
    };
    expect(compileBlock(block)).toBeNull();
  });

  it('should return null for whitespace-only role', () => {
    const block: BlockInstance = {
      id: '1',
      type: 'role',
      data: { role: '   ' },
    };
    expect(compileBlock(block)).toBeNull();
  });

  it('should compile tone block correctly', () => {
    const block: BlockInstance = {
      id: '1',
      type: 'tone',
      data: { tone: 'Professional' },
    };
    const result = compileBlock(block);
    expect(result).toContain('TONE');
    expect(result).toContain('Tone: Professional');
  });
});

describe('blockHasContent', () => {
  it('should return true for block with content', () => {
    const block: BlockInstance = {
      id: '1',
      type: 'role',
      data: { role: 'Developer' },
    };
    expect(blockHasContent(block)).toBe(true);
  });

  it('should return false for empty block', () => {
    const block: BlockInstance = {
      id: '1',
      type: 'context',
      data: { context: '' },
    };
    expect(blockHasContent(block)).toBe(false);
  });

  it('should return false for constraints with only empty strings', () => {
    const block: BlockInstance = {
      id: '1',
      type: 'constraints',
      data: { constraints: ['', '   ', ''] },
    };
    expect(blockHasContent(block)).toBe(false);
  });

  it('should return true for constraints with at least one valid constraint', () => {
    const block: BlockInstance = {
      id: '1',
      type: 'constraints',
      data: { constraints: ['', 'Valid constraint', ''] },
    };
    expect(blockHasContent(block)).toBe(true);
  });
});