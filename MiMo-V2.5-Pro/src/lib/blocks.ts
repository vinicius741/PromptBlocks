import { BLOCK_DEFINITIONS, getDefaultData } from '../types/blocks'
import type {
  BlockInstance,
  BlockType,
  ConstraintsData,
  ContextData,
  ExamplePair,
  ExamplesData,
  OutputFormatData,
  RoleData,
  TaskData,
  ToneData,
} from '../types/blocks'
import { generateId } from './ids'

export function createBlockInstance(type: BlockType): BlockInstance {
  return {
    id: generateId(),
    type,
    data: getDefaultData(type),
  }
}

export function duplicateBlockInstance(block: BlockInstance): BlockInstance {
  return {
    ...structuredClone(block),
    id: generateId(),
  }
}

export function createExamplePair(): ExamplePair {
  return { id: generateId(), input: '', output: '' }
}

export function blockLabel(type: BlockType): string {
  return BLOCK_DEFINITIONS.find((d) => d.type === type)?.label ?? type
}

export function blockHeading(type: BlockType): string {
  return type.toUpperCase().replace('_', ' ')
}

export function summarizeBlock(block: BlockInstance): string {
  switch (block.type) {
    case 'role':
      return (block.data as RoleData).role.trim() || 'No role set yet.'
    case 'task':
      return (block.data as TaskData).task.trim() || 'No task set yet.'
    case 'context':
      return (block.data as ContextData).context.trim() || 'No context set yet.'
    case 'constraints': {
      const n = (block.data as ConstraintsData).items.filter((i) => i.trim()).length
      return n > 0 ? `${n} constraint(s)` : 'No constraints set yet.'
    }
    case 'tone':
      return (block.data as ToneData).tone.trim() || 'No tone set yet.'
    case 'output_format': {
      const data = block.data as OutputFormatData
      const labels: Record<string, string> = {
        plain_text: 'Plain text',
        bullet_list: 'Bullet list',
        json: 'JSON',
      }
      const label = labels[data.format] ?? data.format
      const hasSchema = data.format === 'json' && data.jsonSchema.trim()
      return hasSchema ? `${label} + schema` : label
    }
    case 'examples': {
      const n = (block.data as ExamplesData).examples.filter(
        (e) => e.input.trim() || e.output.trim(),
      ).length
      return n > 0 ? `${n} example(s)` : 'No examples set yet.'
    }
  }
}
