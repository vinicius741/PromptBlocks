import type {
  BlockInstance,
  ConstraintsData,
  ExamplesData,
  OutputFormatData,
  RoleData,
  TaskData,
  ContextData,
  ToneData,
} from '../types/blocks'

export function compilePrompt(blocks: BlockInstance[]): string {
  return blocks
    .map((block) => compileBlock(block))
    .filter((section) => section !== '')
    .join('\n\n')
}

function compileBlock(block: BlockInstance): string {
  switch (block.type) {
    case 'role': {
      const data = block.data as RoleData
      return data.role.trim() ? `ROLE\nYou are a ${data.role.trim()}` : ''
    }
    case 'task': {
      const data = block.data as TaskData
      return data.task.trim() ? `TASK\nYour task: ${data.task.trim()}` : ''
    }
    case 'context': {
      const data = block.data as ContextData
      return data.context.trim() ? `CONTEXT\nContext: ${data.context.trim()}` : ''
    }
    case 'constraints': {
      const data = block.data as ConstraintsData
      const items = data.items.filter((item) => item.trim() !== '')
      if (items.length === 0) return ''
      return `CONSTRAINTS\n${items.map((item) => `- ${item.trim()}`).join('\n')}`
    }
    case 'tone': {
      const data = block.data as ToneData
      return data.tone.trim() ? `TONE\nTone: ${data.tone.trim()}` : ''
    }
    case 'output_format': {
      const data = block.data as OutputFormatData
      let text = `OUTPUT FORMAT\nFormat: ${formatLabel(data.format)}`
      if (data.format === 'json' && data.jsonSchema.trim()) {
        text += `\nJSON Schema:\n${data.jsonSchema.trim()}`
      }
      return text
    }
    case 'examples': {
      const data = block.data as ExamplesData
      const items = data.examples.filter((ex) => ex.input.trim() || ex.output.trim())
      if (items.length === 0) return ''
      return `EXAMPLES\n${items
        .map((ex, i) => `Example ${i + 1}\nInput: ${ex.input.trim()}\nOutput: ${ex.output.trim()}`)
        .join('\n\n')}`
    }
    default:
      return ''
  }
}

function formatLabel(format: OutputFormatData['format']): string {
  switch (format) {
    case 'plain_text':
      return 'Plain text'
    case 'bullet_list':
      return 'Bullet list'
    case 'json':
      return 'JSON'
  }
}
