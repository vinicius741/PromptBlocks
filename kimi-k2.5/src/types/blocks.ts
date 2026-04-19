/**
 * Core type definitions for PromptBlocks
 * 
 * This file defines the data structures for programs, block types, and block instances.
 */

// ============================================
// Block Types (Templates available in the library)
// ============================================

export type BlockType = 
  | 'role'
  | 'task' 
  | 'context'
  | 'constraints'
  | 'tone'
  | 'output_format'
  | 'examples';

export interface BlockTypeConfig {
  type: BlockType;
  label: string;
  description: string;
  icon: string;
  color: string;
  defaultData: BlockData;
}

// ============================================
// Block Data (Content varies by block type)
// ============================================

export interface RoleBlockData {
  role: string;
}

export interface TaskBlockData {
  task: string;
}

export interface ContextBlockData {
  context: string;
}

export interface ConstraintsBlockData {
  constraints: string[];
}

export interface ToneBlockData {
  tone: string;
}

export type OutputFormatType = 'plain_text' | 'bullet_list' | 'json';

export interface OutputFormatBlockData {
  format: OutputFormatType;
  jsonSchema?: string;
}

export interface Example {
  input: string;
  output: string;
}

export interface ExamplesBlockData {
  examples: Example[];
}

export type BlockData =
  | RoleBlockData
  | TaskBlockData
  | ContextBlockData
  | ConstraintsBlockData
  | ToneBlockData
  | OutputFormatBlockData
  | ExamplesBlockData;

// Type guards for block data
export function isRoleBlockData(data: BlockData): data is RoleBlockData {
  return 'role' in data;
}

export function isTaskBlockData(data: BlockData): data is TaskBlockData {
  return 'task' in data;
}

export function isContextBlockData(data: BlockData): data is ContextBlockData {
  return 'context' in data;
}

export function isConstraintsBlockData(data: BlockData): data is ConstraintsBlockData {
  return 'constraints' in data;
}

export function isToneBlockData(data: BlockData): data is ToneBlockData {
  return 'tone' in data;
}

export function isOutputFormatBlockData(data: BlockData): data is OutputFormatBlockData {
  return 'format' in data;
}

export function isExamplesBlockData(data: BlockData): data is ExamplesBlockData {
  return 'examples' in data;
}

// ============================================
// Block Instance (A block on the canvas)
// ============================================

export interface BlockInstance {
  id: string;
  type: BlockType;
  data: BlockData;
}

// ============================================
// Program (A saved prompt configuration)
// ============================================

export interface Program {
  id: string;
  name: string;
  category: string;
  createdAt: number;
  updatedAt: number;
  blocks: BlockInstance[];
}

// ============================================
// Block Type Registry
// ============================================

export const BLOCK_TYPE_REGISTRY: Record<BlockType, BlockTypeConfig> = {
  role: {
    type: 'role',
    label: 'Role',
    description: 'Define the AI\'s role or persona',
    icon: 'User',
    color: 'bg-blue-500',
    defaultData: { role: '' },
  },
  task: {
    type: 'task',
    label: 'Task',
    description: 'Specify what the AI should do',
    icon: 'Target',
    color: 'bg-green-500',
    defaultData: { task: '' },
  },
  context: {
    type: 'context',
    label: 'Context',
    description: 'Provide background information',
    icon: 'Info',
    color: 'bg-yellow-500',
    defaultData: { context: '' },
  },
  constraints: {
    type: 'constraints',
    label: 'Constraints',
    description: 'List rules and limitations',
    icon: 'Shield',
    color: 'bg-red-500',
    defaultData: { constraints: [''] },
  },
  tone: {
    type: 'tone',
    label: 'Tone',
    description: 'Set the communication style',
    icon: 'MessageSquare',
    color: 'bg-purple-500',
    defaultData: { tone: '' },
  },
  output_format: {
    type: 'output_format',
    label: 'Output Format',
    description: 'Define the response format',
    icon: 'FileOutput',
    color: 'bg-indigo-500',
    defaultData: { format: 'plain_text' },
  },
  examples: {
    type: 'examples',
    label: 'Examples',
    description: 'Show input/output examples',
    icon: 'BookOpen',
    color: 'bg-orange-500',
    defaultData: { examples: [{ input: '', output: '' }] },
  },
};

export const BLOCK_TYPES = Object.keys(BLOCK_TYPE_REGISTRY) as BlockType[];

// ============================================
// Utility Types
// ============================================

export type SaveStatus = 'saved' | 'saving' | 'unsaved';

export interface DragItem {
  type: 'block-type' | 'block-instance';
  blockType?: BlockType;
  instanceId?: string;
}