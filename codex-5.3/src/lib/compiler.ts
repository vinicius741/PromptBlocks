import { blockHeading } from './blocks'
import type { BlockInstance } from '../types/blocks'

export function compilePrompt(blocks: BlockInstance[]): string {
  const sections = blocks
    .map((block) => compileBlock(block))
    .filter((section): section is string => Boolean(section))

  return sections.join('\n\n')
}

function compileBlock(block: BlockInstance): string | null {
  if (block.type === 'role') {
    const role = block.data.role.trim()
    if (!role) {
      return null
    }

    return section(block.type, `You are a ${role}`)
  }

  if (block.type === 'task') {
    const task = block.data.task.trim()
    if (!task) {
      return null
    }

    return section(block.type, `Your task: ${task}`)
  }

  if (block.type === 'context') {
    const context = block.data.context.trim()
    if (!context) {
      return null
    }

    return section(block.type, `Context: ${context}`)
  }

  if (block.type === 'constraints') {
    const items = block.data.items.map((item) => item.trim()).filter(Boolean)
    if (items.length === 0) {
      return null
    }

    return section(block.type, items.map((item) => `- ${item}`).join('\n'))
  }

  if (block.type === 'tone') {
    const tone = block.data.tone.trim()
    if (!tone) {
      return null
    }

    return section(block.type, `Tone: ${tone}`)
  }

  if (block.type === 'output_format') {
    const lines: string[] = []
    if (block.data.format === 'plain_text') {
      lines.push('Use plain text.')
    }

    if (block.data.format === 'bullet_list') {
      lines.push('Use a bullet list.')
    }

    if (block.data.format === 'json') {
      lines.push('Return a JSON object.')
      const schema = block.data.jsonSchema.trim()
      if (schema) {
        lines.push(`JSON schema:\n${schema}`)
      }
    }

    if (lines.length === 0) {
      return null
    }

    return section(block.type, lines.join('\n'))
  }

  const examples = block.data.examples.filter(
    (example) => example.input.trim() || example.output.trim(),
  )

  if (examples.length === 0) {
    return null
  }

  const content = examples
    .map((example, index) => {
      const lines = [`Example ${index + 1}`]
      const input = example.input.trim()
      const output = example.output.trim()

      if (input) {
        lines.push(`Input: ${input}`)
      }

      if (output) {
        lines.push(`Output: ${output}`)
      }

      return lines.join('\n')
    })
    .join('\n\n')

  return section(block.type, content)
}

function section(type: BlockInstance['type'], content: string): string {
  return `${blockHeading(type)}\n${content}`
}
