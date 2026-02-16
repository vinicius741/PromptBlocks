export type BlockType =
  | 'role'
  | 'task'
  | 'context'
  | 'constraints'
  | 'tone'
  | 'output_format'
  | 'examples'

export type OutputFormatKind = 'plain_text' | 'bullet_list' | 'json'

export interface RoleBlockData {
  role: string
}

export interface TaskBlockData {
  task: string
}

export interface ContextBlockData {
  context: string
}

export interface ConstraintsBlockData {
  items: string[]
}

export interface ToneBlockData {
  tone: string
}

export interface OutputFormatBlockData {
  format: OutputFormatKind
  jsonSchema: string
}

export interface ExamplePair {
  id: string
  input: string
  output: string
}

export interface ExamplesBlockData {
  examples: ExamplePair[]
}

export interface BlockDataByType {
  role: RoleBlockData
  task: TaskBlockData
  context: ContextBlockData
  constraints: ConstraintsBlockData
  tone: ToneBlockData
  output_format: OutputFormatBlockData
  examples: ExamplesBlockData
}

interface BaseBlockInstance<T extends BlockType> {
  id: string
  type: T
  data: BlockDataByType[T]
}

export type BlockInstance = {
  [K in BlockType]: BaseBlockInstance<K>
}[BlockType]

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
  heading: string
}

export const BLOCK_DEFINITION_MAP: Record<BlockType, BlockDefinition> = {
  role: {
    type: 'role',
    label: 'Role',
    description: 'Define who the assistant should be.',
    heading: 'ROLE',
  },
  task: {
    type: 'task',
    label: 'Task',
    description: 'Describe the core objective.',
    heading: 'TASK',
  },
  context: {
    type: 'context',
    label: 'Context',
    description: 'Provide background information.',
    heading: 'CONTEXT',
  },
  constraints: {
    type: 'constraints',
    label: 'Constraints',
    description: 'Set non-negotiable rules and boundaries.',
    heading: 'CONSTRAINTS',
  },
  tone: {
    type: 'tone',
    label: 'Tone',
    description: 'Specify voice and style.',
    heading: 'TONE',
  },
  output_format: {
    type: 'output_format',
    label: 'Output Format',
    description: 'Control the exact response format.',
    heading: 'OUTPUT FORMAT',
  },
  examples: {
    type: 'examples',
    label: 'Examples',
    description: 'Show input/output examples.',
    heading: 'EXAMPLES',
  },
}

export const BLOCK_LIBRARY: BlockDefinition[] =
  Object.values(BLOCK_DEFINITION_MAP)

const DEFAULT_BLOCK_DATA: { [K in BlockType]: () => BlockDataByType[K] } = {
  role: () => ({ role: '' }),
  task: () => ({ task: '' }),
  context: () => ({ context: '' }),
  constraints: () => ({ items: [''] }),
  tone: () => ({ tone: '' }),
  output_format: () => ({ format: 'plain_text', jsonSchema: '' }),
  examples: () => ({ examples: [] }),
}

export function createDefaultBlockData<K extends BlockType>(
  type: K,
): BlockDataByType[K] {
  return DEFAULT_BLOCK_DATA[type]()
}
