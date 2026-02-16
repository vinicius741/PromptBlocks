# PromptBlocks

PromptBlocks is an open-source web app for building better AI prompts using composable “Prompt Blocks” in a Scratch-like workflow.

You drag blocks from a right-side library into a canvas, reorder and edit them, and see the compiled prompt update live.

No backend. No paywalls. No premium gating.

## Stack

- React + TypeScript + Vite
- TailwindCSS
- `@dnd-kit` for drag-and-drop
- localStorage persistence
- Vitest for unit tests
- ESLint + Prettier

## Local development

```bash
npm install
npm run dev
```

Useful commands:

- `npm run lint`
- `npm run test`
- `npm run build`
- `npm run format`
- `npm run format:check`

## App pages

- `/programs`:
  - List saved programs with name/category/updatedAt
  - Create, rename/edit, duplicate, delete
  - Click program card to open builder
- `/builder/:programId`:
  - Right sidebar block library
  - Main canvas with sortable block instances
  - Block editor panel
  - Compiled prompt panel with copy button
  - Save status + explicit “Save now”

## Block types

- Role: `You are a {{role}}`
- Task: `Your task: {{task}}`
- Context: `Context: {{context}}`
- Constraints: bullet list
- Tone: `Tone: {{tone}}`
- Output Format: plain text / bullet list / JSON (+ optional schema)
- Examples: list of input/output pairs

Compiler behavior:

- Uses canvas order exactly
- Adds heading labels (`ROLE`, `TASK`, etc.)
- Skips empty sections
- Constraints render as bullets
- Examples render as numbered sections (`Example 1`, `Example 2`)

## How storage works

Programs are saved in browser localStorage under key:

- `promptblocks.programs.v1`

Saved data shape:

- `Program`: `{ id, name, category, createdAt, updatedAt, blocks }`
- `BlockInstance`: `{ id, type, data }`

Autosave:

- Builder page debounces save by 500ms after changes
- “Save now” writes immediately

## How to add a new block type

1. Add the block type and data model in `/src/types/blocks.ts`.
2. Add default data + definition metadata (label, description, heading).
3. Update block creation/preview in `/src/lib/blocks.ts`.
4. Add compilation rules in `/src/lib/compiler.ts`.
5. Extend editor UI in `/src/components/BlockEditor.tsx`.
6. Optionally add/adjust tests in `/src/lib/compiler.test.ts`.
