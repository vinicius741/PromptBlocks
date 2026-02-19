import { describe, it, expect } from 'vitest';
import { compileBlocks } from './compiler';
import { BlockInstance } from '../types/blocks';

describe('compiler', () => {
  const createBlock = (type: string, data: any): BlockInstance => ({
    id: 'test-id',
    type: type as any,
    data,
  });

  describe('compileBlocks', () => {
    it('respects canvas ordering', () => {
      const blocks: BlockInstance[] = [
        createBlock('role', { role: 'writer' }),
        createBlock('task', { task: 'write a story' }),
        createBlock('context', { context: 'fantasy world' }),
      ];

      const result = compileBlocks(blocks);
      
      expect(result.indexOf('ROLE')).toBeLessThan(result.indexOf('TASK'));
      expect(result.indexOf('TASK')).toBeLessThan(result.indexOf('CONTEXT'));
    });

    it('constraints bullet formatting', () => {
      const blocks: BlockInstance[] = [
        createBlock('constraints', {
          constraints: ['Be concise', 'Use active voice', 'Stay under 500 words'],
        }),
      ];

      const result = compileBlocks(blocks);
      
      expect(result).toContain('- Be concise');
      expect(result).toContain('- Use active voice');
      expect(result).toContain('- Stay under 500 words');
    });

    it('skips empty sections', () => {
      const blocks: BlockInstance[] = [
        createBlock('role', { role: '' }),
        createBlock('task', { task: 'write a story' }),
        createBlock('context', { context: '' }),
      ];

      const result = compileBlocks(blocks);
      
      expect(result).not.toContain('ROLE');
      expect(result).toContain('TASK');
      expect(result).not.toContain('CONTEXT');
    });

    it('compiles examples as numbered list', () => {
      const blocks: BlockInstance[] = [
        createBlock('examples', {
          examples: [
            { input: 'Hello', output: 'Hi there!' },
            { input: 'How are you?', output: 'I am doing well!' },
          ],
        }),
      ];

      const result = compileBlocks(blocks);
      
      expect(result).toContain('Example 1:');
      expect(result).toContain('Input: Hello');
      expect(result).toContain('Output: Hi there!');
      expect(result).toContain('Example 2:');
    });

    it('compiles output format correctly', () => {
      const blocks: BlockInstance[] = [
        createBlock('outputFormat', {
          format: 'json',
          schema: '{"type": "object"}',
        }),
      ];

      const result = compileBlocks(blocks);
      
      expect(result).toContain('Format: json');
      expect(result).toContain('JSON Schema:');
      expect(result).toContain('{"type": "object"}');
    });

    it('compiles bullet list format', () => {
      const blocks: BlockInstance[] = [
        createBlock('outputFormat', {
          format: 'bulletList',
          schema: '',
        }),
      ];

      const result = compileBlocks(blocks);
      
      expect(result).toContain('Format: bulletList');
      expect(result).toContain('bullet list');
    });

    it('compiles plain text format', () => {
      const blocks: BlockInstance[] = [
        createBlock('outputFormat', {
          format: 'plainText',
          schema: '',
        }),
      ];

      const result = compileBlocks(blocks);
      
      expect(result).toContain('Format: plainText');
      expect(result).toContain('plain text');
    });

    it('returns empty string for empty blocks array', () => {
      const result = compileBlocks([]);
      expect(result).toBe('');
    });

    it('returns empty string when all blocks are empty', () => {
      const blocks: BlockInstance[] = [
        createBlock('role', { role: '' }),
        createBlock('task', { task: '' }),
        createBlock('constraints', { constraints: [] }),
      ];

      const result = compileBlocks(blocks);
      expect(result).toBe('');
    });
  });
});
