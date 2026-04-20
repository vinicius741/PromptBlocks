export type BlockType =
  | 'role'
  | 'task'
  | 'context'
  | 'constraints'
  | 'tone'
  | 'outputFormat'
  | 'examples'

export interface RoleData {
  role: string
}

export interface TaskData {
  task: string
}

export interface ContextData {
  context: string
}

export interface ConstraintsData {
  items: string[]
}

export interface ToneData {
  tone: string
}

export type OutputFormatChoice = 'plain' | 'bullets' | 'json'

export interface OutputFormatData {
  format: OutputFormatChoice
  schema?: string
}

export interface ExamplePair {
  input: string
  output: string
}

export interface ExamplesData {
  examples: ExamplePair[]
}

export type BlockData =
  | RoleData
  | TaskData
  | ContextData
  | ConstraintsData
  | ToneData
  | OutputFormatData
  | ExamplesData

export interface BlockInstance {
  id: string
  type: BlockType
  data: BlockData
}

export interface Program {
  id: string
  name: string
  category: string
  createdAt: number
  updatedAt: number
  blocks: BlockInstance[]
}
