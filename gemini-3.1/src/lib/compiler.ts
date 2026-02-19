import type { BlockInstance } from "../types/blocks";

export function compilePrompt(blocks: BlockInstance[]): string {
  const sections: string[] = [];

  for (const block of blocks) {
    const { type, data } = block;
    let title = "";
    let content = "";

    switch (type) {
      case "Role": {
        const role = (data.role || "").trim();
        if (role) {
          title = "ROLE";
          content = `You are a ${role}`;
        }
        break;
      }
      case "Task": {
        const task = (data.task || "").trim();
        if (task) {
          title = "TASK";
          content = `Your task: ${task}`;
        }
        break;
      }
      case "Context": {
        const context = (data.context || "").trim();
        if (context) {
          title = "CONTEXT";
          content = `Context: ${context}`;
        }
        break;
      }
      case "Constraints": {
        const items = (data.constraints || [])
          .map((c: string) => c.trim())
          .filter((c: string) => c.length > 0);
        if (items.length > 0) {
          title = "CONSTRAINTS";
          content = items.map((item: string) => `- ${item}`).join("\n");
        }
        break;
      }
      case "Tone": {
        const tone = (data.tone || "").trim();
        if (tone) {
          title = "TONE";
          content = `Tone: ${tone}`;
        }
        break;
      }
      case "OutputFormat": {
        const format = (data.format || "").trim();
        const schema = (data.schema || "").trim();
        if (format || schema) {
          title = "OUTPUT FORMAT";
          const parts = [];
          if (format) parts.push(`Format: ${format}`);
          if (schema) parts.push(`Schema:\n${schema}`);
          content = parts.join("\n");
        }
        break;
      }
      case "Examples": {
        const items = (data.examples || []).filter(
          (ex: { input: string; output: string }) =>
            (ex.input || "").trim() || (ex.output || "").trim(),
        );

        if (items.length > 0) {
          title = "EXAMPLES";
          content = items
            .map((ex: any, i: number) => {
              return `Example ${i + 1}:\nInput: ${ex.input.trim()}\nOutput: ${ex.output.trim()}`;
            })
            .join("\n\n");
        }
        break;
      }
    }

    if (title && content) {
      sections.push(`${title}\n${content}`);
    }
  }

  return sections.join("\n\n");
}
