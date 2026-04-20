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

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((v) => typeof v === 'string')
}

function hasNonEmptyStrings(arr: string[]): boolean {
  return arr.some((s) => s.trim().length > 0)
}

export function compileBlock(instance: BlockInstance): string | null {
  const { type, data } = instance

  switch (type) {
    case 'role': {
      const d = data as RoleData
      if (!isNonEmptyString(d.role)) return null
      return `ROLE\n${d.role.trim()}`
    }
    case 'task': {
      const d = data as TaskData
      if (!isNonEmptyString(d.task)) return null
      return `TASK\n${d.task.trim()}`
    }
    case 'context': {
      const d = data as ContextData
      if (!isNonEmptyString(d.context)) return null
      return `CONTEXT\n${d.context.trim()}`
    }
    case 'constraints': {
      const d = data as ConstraintsData
      if (!isStringArray(d.items) || !hasNonEmptyStrings(d.items)) return null
      const bullets = d.items
        .map((item) => item.trim())
        .filter((item) => item.length > 0)
        .map((item) => `- ${item}`)
        .join('\n')
      return `CONSTRAINTS\n${bullets}`
    }
    case 'tone': {
      const d = data as ToneData
      if (!isNonEmptyString(d.tone)) return null
      return `TONE\n${d.tone.trim()}`
    }
    case 'outputFormat': {
      const d = data as OutputFormatData
      const lines: string[] = []
      if (d.format === 'plain') {
        lines.push('Output as plain text.')
      } else if (d.format === 'bullets') {
        lines.push('Output as a bullet list.')
      } else if (d.format === 'json') {
        lines.push('Output as JSON.')
      }
      if (isNonEmptyString(d.schema)) {
        lines.push(`Schema:\n${d.schema.trim()}`)
      }
      if (lines.length === 0) return null
      return `OUTPUT FORMAT\n${lines.join('\n')}`
    }
    case 'examples': {
      const d = data as ExamplesData
      if (!Array.isArray(d.examples) || d.examples.length === 0) return null
      const validExamples = d.examples.filter(
        (ex) => isNonEmptyString(ex.input) || isNonEmptyString(ex.output),
      )
      if (validExamples.length === 0) return null
      const lines = validExamples.map((ex, idx) => {
        const parts = [`Example ${idx + 1}:`]
        if (isNonEmptyString(ex.input)) parts.push(`Input:\n${ex.input.trim()}`)
        if (isNonEmptyString(ex.output)) parts.push(`Output:\n${ex.output.trim()}`)
        return parts.join('\n')
      })
      return `EXAMPLES\n${lines.join('\n\n')}`
    }
    default: {
      const _exhaustive: never = type as never
      return _exhaustive
    }
  }
}

export function compilePrompt(blocks: BlockInstance[]): string {
  const sections = blocks.map((b) => compileBlock(b)).filter((s): s is string => s !== null)
  return sections.join('\n\n')
}
