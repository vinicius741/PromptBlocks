import {
  BlockInstance,
  RoleData,
  TaskData,
  ContextData,
  ConstraintsData,
  ToneData,
  OutputFormatData,
  ExamplesData,
} from '../types/blocks';

interface CompiledSection {
  label: string;
  content: string;
}

const compileRole = (data: RoleData): CompiledSection | null => {
  if (!data.role.trim()) return null;
  return {
    label: 'ROLE',
    content: `You are a ${data.role}`,
  };
};

const compileTask = (data: TaskData): CompiledSection | null => {
  if (!data.task.trim()) return null;
  return {
    label: 'TASK',
    content: `Your task: ${data.task}`,
  };
};

const compileContext = (data: ContextData): CompiledSection | null => {
  if (!data.context.trim()) return null;
  return {
    label: 'CONTEXT',
    content: `Context: ${data.context}`,
  };
};

const compileConstraints = (data: ConstraintsData): CompiledSection | null => {
  const validConstraints = data.constraints.filter(c => c.trim());
  if (validConstraints.length === 0) return null;
  
  return {
    label: 'CONSTRAINTS',
    content: validConstraints.map(c => `- ${c}`).join('\n'),
  };
};

const compileTone = (data: ToneData): CompiledSection | null => {
  if (!data.tone.trim()) return null;
  return {
    label: 'TONE',
    content: `Tone: ${data.tone}`,
  };
};

const compileOutputFormat = (data: OutputFormatData): CompiledSection | null => {
  let content = `Format: ${data.format}`;
  
  if (data.format === 'json' && data.schema.trim()) {
    content += `\n\nJSON Schema:\n${data.schema}`;
  } else if (data.format === 'bulletList') {
    content += '\nProvide the output as a bullet list.';
  } else if (data.format === 'plainText') {
    content += '\nProvide the output as plain text.';
  }
  
  return {
    label: 'OUTPUT FORMAT',
    content,
  };
};

const compileExamples = (data: ExamplesData): CompiledSection | null => {
  const validExamples = data.examples.filter(e => e.input.trim() || e.output.trim());
  if (validExamples.length === 0) return null;
  
  const content = validExamples.map((example, index) => {
    let text = `Example ${index + 1}:\n`;
    text += `Input: ${example.input}\n`;
    text += `Output: ${example.output}`;
    return text;
  }).join('\n\n');
  
  return {
    label: 'EXAMPLES',
    content,
  };
};

const compileBlock = (block: BlockInstance): CompiledSection | null => {
  switch (block.type) {
    case 'role':
      return compileRole(block.data as RoleData);
    case 'task':
      return compileTask(block.data as TaskData);
    case 'context':
      return compileContext(block.data as ContextData);
    case 'constraints':
      return compileConstraints(block.data as ConstraintsData);
    case 'tone':
      return compileTone(block.data as ToneData);
    case 'outputFormat':
      return compileOutputFormat(block.data as OutputFormatData);
    case 'examples':
      return compileExamples(block.data as ExamplesData);
    default:
      return null;
  }
};

export const compileBlocks = (blocks: BlockInstance[]): string => {
  const sections: string[] = [];
  
  for (const block of blocks) {
    const compiled = compileBlock(block);
    if (compiled) {
      sections.push(`${compiled.label}\n${compiled.content}`);
    }
  }
  
  return sections.join('\n\n---\n\n');
};

export const getBlockPreview = (block: BlockInstance): string => {
  const compiled = compileBlock(block);
  if (!compiled) return '(empty)';
  
  const lines = compiled.content.split('\n');
  const preview = lines[0];
  return preview.length > 50 ? preview.substring(0, 50) + '...' : preview;
};
