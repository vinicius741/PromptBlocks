import { BLOCK_DEFINITION_MAP, createDefaultBlockData } from '../types/blocks'
import type {
  BlockInstance,
  BlockType,
  ExamplePair,
  OutputFormatKind,
} from '../types/blocks'
import { randomId } from './ids'

export function createBlockInstance(type: BlockType): BlockInstance {
  switch (type) {
    case 'role':
      return { id: randomId(), type, data: createDefaultBlockData(type) }
    case 'task':
      return { id: randomId(), type, data: createDefaultBlockData(type) }
    case 'context':
      return { id: randomId(), type, data: createDefaultBlockData(type) }
    case 'constraints':
      return { id: randomId(), type, data: createDefaultBlockData(type) }
    case 'tone':
      return { id: randomId(), type, data: createDefaultBlockData(type) }
    case 'output_format':
      return { id: randomId(), type, data: createDefaultBlockData(type) }
    case 'examples':
      return { id: randomId(), type, data: createDefaultBlockData(type) }
  }
}

export function duplicateBlockInstance(block: BlockInstance): BlockInstance {
  return {
    ...cloneValue(block),
    id: randomId(),
  }
}

export function createExamplePair(): ExamplePair {
  return {
    id: randomId(),
    input: '',
    output: '',
  }
}

export function blockLabel(type: BlockType): string {
  return BLOCK_DEFINITION_MAP[type].label
}

export function blockHeading(type: BlockType): string {
  return BLOCK_DEFINITION_MAP[type].heading
}

export function outputFormatLabel(format: OutputFormatKind): string {
  if (format === 'plain_text') {
    return 'Plain text'
  }

  if (format === 'bullet_list') {
    return 'Bullet list'
  }

  return 'JSON'
}

export function summarizeBlock(block: BlockInstance): string {
  if (block.type === 'role') {
    return block.data.role.trim() || 'No role set yet.'
  }

  if (block.type === 'task') {
    return block.data.task.trim() || 'No task set yet.'
  }

  if (block.type === 'context') {
    return block.data.context.trim() || 'No context set yet.'
  }

  if (block.type === 'constraints') {
    const count = block.data.items.filter((item) => item.trim()).length
    return count > 0 ? `${count} constraint(s)` : 'No constraints set yet.'
  }

  if (block.type === 'tone') {
    return block.data.tone.trim() || 'No tone set yet.'
  }

  if (block.type === 'output_format') {
    const schema = block.data.jsonSchema.trim()
    const schemaHint = block.data.format === 'json' && schema ? ' + schema' : ''
    return `${outputFormatLabel(block.data.format)}${schemaHint}`
  }

  const count = block.data.examples.filter(
    (example) => example.input.trim() || example.output.trim(),
  ).length

  return count > 0 ? `${count} example(s)` : 'No examples set yet.'
}

function cloneValue<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}
