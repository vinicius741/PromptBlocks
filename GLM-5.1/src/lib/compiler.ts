import type {
  BlockInstance,
  RoleData,
  TaskData,
  ContextData,
  ConstraintsData,
  ToneData,
  OutputFormatData,
  ExamplesData,
} from '@/types/blocks';

function compileRole(data: RoleData): string {
  if (!data.role.trim()) return '';
  return `## ROLE\n\nYou are a ${data.role.trim()}`;
}

function compileTask(data: TaskData): string {
  if (!data.task.trim()) return '';
  return `## TASK\n\nYour task: ${data.task.trim()}`;
}

function compileContext(data: ContextData): string {
  if (!data.context.trim()) return '';
  return `## CONTEXT\n\n${data.context.trim()}`;
}

function compileConstraints(data: ConstraintsData): string {
  const items = data.items.filter((s) => s.trim());
  if (items.length === 0) return '';
  const bullets = items.map((s) => `- ${s.trim()}`).join('\n');
  return `## CONSTRAINTS\n\n${bullets}`;
}

function compileTone(data: ToneData): string {
  if (!data.tone.trim()) return '';
  return `## TONE\n\nTone: ${data.tone.trim()}`;
}

function compileOutputFormat(data: OutputFormatData): string {
  const formatLabels: Record<string, string> = {
    'plain-text': 'Plain text',
    'bullet-list': 'Bullet list',
    json: 'JSON',
  };
  let text = `## OUTPUT FORMAT\n\nFormat: ${formatLabels[data.format] || data.format}`;
  if (data.format === 'json' && data.jsonSchema.trim()) {
    text += `\n\nJSON Schema:\n\`\`\`json\n${data.jsonSchema.trim()}\n\`\`\``;
  }
  return text;
}

function compileExamples(data: ExamplesData): string {
  const pairs = data.pairs.filter(
    (p) => p.input.trim() || p.output.trim()
  );
  if (pairs.length === 0) return '';
  const items = pairs
    .map((p, i) => `### Example ${i + 1}\n\n**Input:** ${p.input.trim()}\n**Output:** ${p.output.trim()}`)
    .join('\n\n');
  return `## EXAMPLES\n\n${items}`;
}

type CompileFn = (data: never) => string;

const compilers: Record<string, CompileFn> = {
  role: compileRole as CompileFn,
  task: compileTask as CompileFn,
  context: compileContext as CompileFn,
  constraints: compileConstraints as CompileFn,
  tone: compileTone as CompileFn,
  'output-format': compileOutputFormat as CompileFn,
  examples: compileExamples as CompileFn,
};

export function compileBlock(block: BlockInstance): string {
  const fn = compilers[block.type];
  return fn ? fn(block.data as never) : '';
}

export function compilePrompt(blocks: BlockInstance[]): string {
  return blocks
    .map(compileBlock)
    .filter((s) => s.trim() !== '')
    .join('\n\n---\n\n');
}
