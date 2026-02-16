import type { BlockInstance, BlockData } from '@/types/blocks';

/**
 * Compile an array of blocks into a formatted prompt string
 */
export function compilePrompt(blocks: BlockInstance[]): string {
  const sections: string[] = [];

  for (const block of blocks) {
    const section = compileBlock(block);
    if (section) {
      sections.push(section);
    }
  }

  return sections.join('\n\n');
}

/**
 * Compile a single block into a section string
 * Returns empty string if block has no content
 */
function compileBlock(block: BlockInstance): string {
  switch (block.type) {
    case 'role':
      return compileRoleBlock(block.data);
    case 'task':
      return compileTaskBlock(block.data);
    case 'context':
      return compileContextBlock(block.data);
    case 'constraints':
      return compileConstraintsBlock(block.data);
    case 'tone':
      return compileToneBlock(block.data);
    case 'output-format':
      return compileOutputFormatBlock(block.data);
    case 'examples':
      return compileExamplesBlock(block.data);
    default:
      return '';
  }
}

function compileRoleBlock(data: BlockData): string {
  const roleData = data as { role: string };
  if (!roleData.role.trim()) return '';
  return `## ROLE\n\n${roleData.role.trim()}`;
}

function compileTaskBlock(data: BlockData): string {
  const taskData = data as { task: string };
  if (!taskData.task.trim()) return '';
  return `## TASK\n\n${taskData.task.trim()}`;
}

function compileContextBlock(data: BlockData): string {
  const contextData = data as { context: string };
  if (!contextData.context.trim()) return '';
  return `## CONTEXT\n\n${contextData.context.trim()}`;
}

function compileConstraintsBlock(data: BlockData): string {
  const constraintsData = data as { items: string[] };
  const items = constraintsData.items.filter((item) => item.trim());
  if (items.length === 0) return '';

  const bulletList = items.map((item) => `- ${item.trim()}`).join('\n');
  return `## CONSTRAINTS\n\n${bulletList}`;
}

function compileToneBlock(data: BlockData): string {
  const toneData = data as { tone: string };
  if (!toneData.tone.trim()) return '';
  return `## TONE\n\n${toneData.tone.trim()}`;
}

function compileOutputFormatBlock(data: BlockData): string {
  const formatData = data as { format: string; jsonSchema?: string };
  let content = '';

  switch (formatData.format) {
    case 'plain':
      content = 'Respond in plain text.';
      break;
    case 'bullet':
      content = 'Respond in bullet points.';
      break;
    case 'json':
      content = 'Respond in JSON format.';
      if (formatData.jsonSchema?.trim()) {
        content += `\n\nSchema:\n${formatData.jsonSchema.trim()}`;
      }
      break;
    default:
      return '';
  }

  return `## OUTPUT FORMAT\n\n${content}`;
}

function compileExamplesBlock(data: BlockData): string {
  const examplesData = data as { examples: { input: string; output: string }[] };
  const examples = examplesData.examples.filter(
    (ex) => ex.input.trim() || ex.output.trim()
  );
  if (examples.length === 0) return '';

  const formattedExamples = examples
    .map((ex, index) => {
      const parts: string[] = [];
      parts.push(`### Example ${index + 1}`);
      if (ex.input.trim()) {
        parts.push(`Input: ${ex.input.trim()}`);
      }
      if (ex.output.trim()) {
        parts.push(`Output: ${ex.output.trim()}`);
      }
      return parts.join('\n');
    })
    .join('\n\n');

  return `## EXAMPLES\n\n${formattedExamples}`;
}
