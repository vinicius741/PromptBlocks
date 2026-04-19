/**
 * Prompt compiler - converts block instances to a compiled prompt string
 * 
 * The compiler takes an ordered array of block instances and generates
 * a formatted prompt string with proper section headings and formatting.
 */

import type {
  BlockInstance,
  BlockType,
  RoleBlockData,
  TaskBlockData,
  ContextBlockData,
  ConstraintsBlockData,
  ToneBlockData,
  OutputFormatBlockData,
  ExamplesBlockData,
} from '@/types/blocks';

// ============================================
// Block Compilers
// ============================================

type BlockCompiler = (data: unknown) => string | null;

const compilers: Record<BlockType, BlockCompiler> = {
  role: (data) => {
    const { role } = data as RoleBlockData;
    if (!role?.trim()) return null;
    return `ROLE\n\nYou are a ${role.trim()}`;
  },

  task: (data) => {
    const { task } = data as TaskBlockData;
    if (!task?.trim()) return null;
    return `TASK\n\nYour task: ${task.trim()}`;
  },

  context: (data) => {
    const { context } = data as ContextBlockData;
    if (!context?.trim()) return null;
    return `CONTEXT\n\n${context.trim()}`;
  },

  constraints: (data) => {
    const { constraints } = data as ConstraintsBlockData;
    const validConstraints = constraints
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    if (validConstraints.length === 0) return null;

    const bulletList = validConstraints.map((c) => `- ${c}`).join('\n');
    return `CONSTRAINTS\n\n${bulletList}`;
  },

  tone: (data) => {
    const { tone } = data as ToneBlockData;
    if (!tone?.trim()) return null;
    return `TONE\n\nTone: ${tone.trim()}`;
  },

  output_format: (data) => {
    const { format, jsonSchema } = data as OutputFormatBlockData;

    let content = '';
    switch (format) {
      case 'plain_text':
        content = 'Output format: Plain text';
        break;
      case 'bullet_list':
        content = 'Output format: Bullet list';
        break;
      case 'json':
        content = 'Output format: JSON';
        if (jsonSchema?.trim()) {
          content += `\n\nSchema:\n${jsonSchema.trim()}`;
        }
        break;
    }

    return `OUTPUT FORMAT\n\n${content}`;
  },

  examples: (data) => {
    const { examples } = data as ExamplesBlockData;
    const validExamples = examples.filter(
      (ex) => ex.input.trim() || ex.output.trim()
    );

    if (validExamples.length === 0) return null;

    const formatted = validExamples
      .map((ex, index) => {
        const parts = [`Example ${index + 1}:`];
        if (ex.input.trim()) {
          parts.push(`Input: ${ex.input.trim()}`);
        }
        if (ex.output.trim()) {
          parts.push(`Output: ${ex.output.trim()}`);
        }
        return parts.join('\n');
      })
      .join('\n\n');

    return `EXAMPLES\n\n${formatted}`;
  },
};

// ============================================
// Main Compiler
// ============================================

/**
 * Compile an array of block instances into a formatted prompt string
 * 
 * Rules:
 * - Blocks are processed in order
 * - Empty sections are skipped
 * - Sections are separated by double newlines
 * - Each section has a heading label in ALL CAPS
 */
export function compilePrompt(blocks: BlockInstance[]): string {
  const sections: string[] = [];

  for (const block of blocks) {
    const compiler = compilers[block.type];
    if (!compiler) continue;

    const section = compiler(block.data);
    if (section !== null) {
      sections.push(section);
    }
  }

  return sections.join('\n\n---\n\n');
}

/**
 * Compile a single block instance
 */
export function compileBlock(block: BlockInstance): string | null {
  const compiler = compilers[block.type];
  if (!compiler) return null;
  return compiler(block.data);
}

/**
 * Check if a block has content (not empty)
 */
export function blockHasContent(block: BlockInstance): boolean {
  return compileBlock(block) !== null;
}

/**
 * Get the number of non-empty blocks
 */
export function countNonEmptyBlocks(blocks: BlockInstance[]): number {
  return blocks.filter(blockHasContent).length;
}