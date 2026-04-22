export type BlockType =
  | 'role'
  | 'task'
  | 'context'
  | 'constraints'
  | 'tone'
  | 'output_format'
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

export interface OutputFormatData {
  format: 'plain_text' | 'bullet_list' | 'json'
  jsonSchema: string
}

export interface ExamplePair {
  id: string
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
  createdAt: string
  updatedAt: string
  blocks: BlockInstance[]
}

export interface BlockDefinition {
  type: BlockType
  label: string
  description: string
  color: string
}

export const BLOCK_DEFINITIONS: BlockDefinition[] = [
  { type: 'role', label: 'Role', description: 'You are a {{role}}', color: 'bg-violet-500' },
  { type: 'task', label: 'Task', description: 'Your task: {{task}}', color: 'bg-blue-500' },
  { type: 'context', label: 'Context', description: 'Context: {{context}}', color: 'bg-cyan-500' },
  {
    type: 'constraints',
    label: 'Constraints',
    description: 'Bullet list of constraints',
    color: 'bg-amber-500',
  },
  { type: 'tone', label: 'Tone', description: 'Tone: {{tone}}', color: 'bg-pink-500' },
  {
    type: 'output_format',
    label: 'Output Format',
    description: 'Choose format + optional schema',
    color: 'bg-emerald-500',
  },
  {
    type: 'examples',
    label: 'Examples',
    description: 'Input/output example pairs',
    color: 'bg-orange-500',
  },
]

export function getDefaultData(type: BlockType): BlockData {
  switch (type) {
    case 'role':
      return { role: '' }
    case 'task':
      return { task: '' }
    case 'context':
      return { context: '' }
    case 'constraints':
      return { items: [''] }
    case 'tone':
      return { tone: '' }
    case 'output_format':
      return { format: 'plain_text' as const, jsonSchema: '' }
    case 'examples':
      return { examples: [{ id: crypto.randomUUID(), input: '', output: '' }] }
  }
}
