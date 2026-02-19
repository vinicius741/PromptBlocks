export type BlockType =
  | "Role"
  | "Task"
  | "Context"
  | "Constraints"
  | "Tone"
  | "OutputFormat"
  | "Examples";

export interface BlockInstance {
  id: string;
  type: BlockType;
  data: Record<string, any>;
}

export interface Program {
  id: string;
  name: string;
  category: string;
  createdAt: number;
  updatedAt: number;
  blocks: BlockInstance[];
}

// Block definitions for the library sidebar
export interface BlockDefinition {
  type: BlockType;
  label: string;
  description: string;
  defaultData: Record<string, any>;
}

export const BLOCK_DEFINITIONS: BlockDefinition[] = [
  {
    type: "Role",
    label: "Role",
    description: "Set the persona or role for the AI",
    defaultData: { role: "Helpful Assistant" },
  },
  {
    type: "Task",
    label: "Task",
    description: "Describe the main instruction or task",
    defaultData: { task: "Answer the user's question." },
  },
  {
    type: "Context",
    label: "Context",
    description: "Provide background information",
    defaultData: { context: "" },
  },
  {
    type: "Constraints",
    label: "Constraints",
    description: "Rules the AI must follow",
    defaultData: { constraints: [""] },
  },
  {
    type: "Tone",
    label: "Tone",
    description: "Set the tone of the response",
    defaultData: { tone: "Professional and concise" },
  },
  {
    type: "OutputFormat",
    label: "Output Format",
    description: "Define how the output should be formatted",
    defaultData: { format: "plain text", schema: "" },
  },
  {
    type: "Examples",
    label: "Examples",
    description: "Provide examples of input and expected output",
    defaultData: { examples: [{ input: "", output: "" }] },
  },
];
