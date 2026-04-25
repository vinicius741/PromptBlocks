export type BlockType =
  | 'role'
  | 'task'
  | 'context'
  | 'constraints'
  | 'tone'
  | 'output_format'
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
  format: 'plain text' | 'bullet list' | 'JSON';
  schema?: string;
}

export interface ExamplePair {
  input: string;
  output: string;
}

export interface ExamplesData {
  examples: ExamplePair[];
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
