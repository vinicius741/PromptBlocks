import type { BlockInstance, ConstraintsData, ExamplesData, OutputFormatData, RoleData, TaskData, ContextData, ToneData } from '../types/blocks';

export const compilePrompt = (blocks: BlockInstance[]): string => {
  return blocks
    .map((block) => {
      switch (block.type) {
        case 'role': {
          const data = block.data as RoleData;
          return data.role ? `ROLE\nYou are a ${data.role}` : '';
        }
        case 'task': {
          const data = block.data as TaskData;
          return data.task ? `TASK\nYour task: ${data.task}` : '';
        }
        case 'context': {
          const data = block.data as ContextData;
          return data.context ? `CONTEXT\nContext: ${data.context}` : '';
        }
        case 'constraints': {
          const data = block.data as ConstraintsData;
          const items = data.constraints.filter((c) => c.trim() !== '');
          if (items.length === 0) return '';
          return `CONSTRAINTS\n${items.map((c) => `- ${c}`).join('\n')}`;
        }
        case 'tone': {
          const data = block.data as ToneData;
          return data.tone ? `TONE\nTone: ${data.tone}` : '';
        }
        case 'output_format': {
          const data = block.data as OutputFormatData;
          let text = `OUTPUT FORMAT\nFormat: ${data.format}`;
          if (data.format === 'JSON' && data.schema) {
            text += `\nSchema:\n${data.schema}`;
          }
          return text;
        }
        case 'examples': {
          const data = block.data as ExamplesData;
          const items = data.examples.filter((e) => e.input.trim() !== '' || e.output.trim() !== '');
          if (items.length === 0) return '';
          return `EXAMPLES\n${items
            .map((e, i) => `Example ${i + 1}:\nInput: ${e.input}\nOutput: ${e.output}`)
            .join('\n\n')}`;
        }
        default:
          return '';
      }
    })
    .filter((section) => section !== '')
    .join('\n\n');
};
