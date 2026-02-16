// Block Types (templates in library)
export type BlockType =
  | 'role'
  | 'task'
  | 'context'
  | 'constraints'
  | 'tone'
  | 'output-format'
  | 'examples';

// Data shapes by type
export interface RoleData {
  role: string;
}

export interface TaskData {
  task: string;
}

export interface ContextData {
  context: string;
}

export interface ConstraintsData {
  items: string[];
}

export interface ToneData {
  tone: string;
}

export interface OutputFormatData {
  format: 'plain' | 'bullet' | 'json';
  jsonSchema?: string;
}

export interface ExamplesData {
  examples: { input: string; output: string }[];
}

export type BlockData =
  | RoleData
  | TaskData
  | ContextData
  | ConstraintsData
  | ToneData
  | OutputFormatData
  | ExamplesData;

// Block Instance (on canvas)
export interface BlockInstance {
  id: string;
  type: BlockType;
  data: BlockData;
}

// Program
export interface Program {
  id: string;
  name: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  blocks: BlockInstance[];
}

// Block type metadata
export interface BlockTypeMeta {
  type: BlockType;
  label: string;
  description: string;
  color: string;
  defaultData: BlockData;
}

export const BLOCK_TYPES: BlockTypeMeta[] = [
  {
    type: 'role',
    label: 'Role',
    description: 'Define the AI persona or expertise',
    color: 'block-role',
    defaultData: { role: '' },
  },
  {
    type: 'task',
    label: 'Task',
    description: 'Describe what the AI should do',
    color: 'block-task',
    defaultData: { task: '' },
  },
  {
    type: 'context',
    label: 'Context',
    description: 'Provide background information',
    color: 'block-context',
    defaultData: { context: '' },
  },
  {
    type: 'constraints',
    label: 'Constraints',
    description: 'Set rules and limitations',
    color: 'block-constraints',
    defaultData: { items: [] },
  },
  {
    type: 'tone',
    label: 'Tone',
    description: 'Specify the writing style',
    color: 'block-tone',
    defaultData: { tone: '' },
  },
  {
    type: 'output-format',
    label: 'Output Format',
    description: 'Define the response structure',
    color: 'block-output-format',
    defaultData: { format: 'plain' },
  },
  {
    type: 'examples',
    label: 'Examples',
    description: 'Provide input/output examples',
    color: 'block-examples',
    defaultData: { examples: [] },
  },
];

export function getBlockTypeMeta(type: BlockType): BlockTypeMeta {
  return BLOCK_TYPES.find((b) => b.type === type) || BLOCK_TYPES[0];
}
