export type BlockType = 
  | 'role' 
  | 'task' 
  | 'context' 
  | 'constraints' 
  | 'tone' 
  | 'outputFormat' 
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
  constraints: string[];
}

export interface ToneData {
  tone: string;
}

export interface OutputFormatData {
  format: 'plainText' | 'bulletList' | 'json';
  schema: string;
}

export interface Example {
  input: string;
  output: string;
}

export interface ExamplesData {
  examples: Example[];
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

export interface BlockTypeDefinition {
  type: BlockType;
  label: string;
  description: string;
  icon: string;
  color: string;
  getDefaultData: () => BlockData;
}

export const BLOCK_TYPE_DEFINITIONS: BlockTypeDefinition[] = [
  {
    type: 'role',
    label: 'Role',
    description: 'Define the AI persona',
    icon: 'User',
    color: '#8b5cf6',
    getDefaultData: () => ({ role: '' }),
  },
  {
    type: 'task',
    label: 'Task',
    description: 'Specify the main objective',
    icon: 'Target',
    color: '#3b82f6',
    getDefaultData: () => ({ task: '' }),
  },
  {
    type: 'context',
    label: 'Context',
    description: 'Provide background information',
    icon: 'FileText',
    color: '#10b981',
    getDefaultData: () => ({ context: '' }),
  },
  {
    type: 'constraints',
    label: 'Constraints',
    description: 'List limitations or rules',
    icon: 'AlertTriangle',
    color: '#f59e0b',
    getDefaultData: () => ({ constraints: [''] }),
  },
  {
    type: 'tone',
    label: 'Tone',
    description: 'Set the response tone',
    icon: 'Music',
    color: '#ec4899',
    getDefaultData: () => ({ tone: '' }),
  },
  {
    type: 'outputFormat',
    label: 'Output Format',
    description: 'Define output structure',
    icon: 'Layout',
    color: '#06b6d4',
    getDefaultData: () => ({ format: 'plainText', schema: '' }),
  },
  {
    type: 'examples',
    label: 'Examples',
    description: 'Show input/output pairs',
    icon: 'BookOpen',
    color: '#f97316',
    getDefaultData: () => ({ examples: [{ input: '', output: '' }] }),
  },
];

export const getBlockDefinition = (type: BlockType): BlockTypeDefinition => {
  return BLOCK_TYPE_DEFINITIONS.find(b => b.type === type)!;
};

export const getBlockLabel = (type: BlockType): string => {
  return getBlockDefinition(type).label.toUpperCase();
};
