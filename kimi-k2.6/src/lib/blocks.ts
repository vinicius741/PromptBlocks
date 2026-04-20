import type { BlockType, BlockData } from '../types/blocks'

export function createDefaultBlockData(type: BlockType): BlockData {
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
    case 'outputFormat':
      return { format: 'plain', schema: '' }
    case 'examples':
      return { examples: [{ input: '', output: '' }] }
    default: {
      const _exhaustive: never = type as never
      return _exhaustive
    }
  }
}
