export type BlockType =
  | 'role'
  | 'task'
  | 'context'
  | 'constraints'
  | 'tone'
  | 'output-format'
  | 'examples';

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
  format: 'plain-text' | 'bullet-list' | 'json';
  jsonSchema: string;
}

export interface ExamplePair {
  input: string;
  output: string;
}

export interface ExamplesData {
  pairs: ExamplePair[];
}

export type BlockData =
  | RoleData
  | TaskData
  | ContextData
  | ConstraintsData
  | ToneData
  | OutputFormatData
  | ExamplesData;

export interface BlockInstance {
  id: string;
  type: BlockType;
  data: BlockData;
}

export interface Program {
  id: string;
  name: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  blocks: BlockInstance[];
}

export interface BlockTypeMeta {
  type: BlockType;
  label: string;
  description: string;
  color: string;
  defaultData: () => BlockData;
}

export const BLOCK_TYPES: BlockTypeMeta[] = [
  {
    type: 'role',
    label: 'Role',
    description: 'Define the AI\'s role',
    color: 'bg-blue-500',
    defaultData: () => ({ role: '' }),
  },
  {
    type: 'task',
    label: 'Task',
    description: 'What the AI should do',
    color: 'bg-green-500',
    defaultData: () => ({ task: '' }),
  },
  {
    type: 'context',
    label: 'Context',
    description: 'Background information',
    color: 'bg-purple-500',
    defaultData: () => ({ context: '' }),
  },
  {
    type: 'constraints',
    label: 'Constraints',
    description: 'Rules and limitations',
    color: 'bg-red-500',
    defaultData: () => ({ items: [''] }),
  },
  {
    type: 'tone',
    label: 'Tone',
    description: 'Communication style',
    color: 'bg-yellow-500',
    defaultData: () => ({ tone: '' }),
  },
  {
    type: 'output-format',
    label: 'Output Format',
    description: 'Expected response format',
    color: 'bg-indigo-500',
    defaultData: () => ({ format: 'plain-text', jsonSchema: '' }),
  },
  {
    type: 'examples',
    label: 'Examples',
    description: 'Input/output examples',
    color: 'bg-pink-500',
    defaultData: () => ({ pairs: [{ input: '', output: '' }] }),
  },
];
