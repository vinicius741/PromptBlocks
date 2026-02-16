Build an open-source web app called PromptBlocks.

Goal
- PromptBlocks helps users create better AI prompts by assembling “Prompt Blocks” in a Scratch-like way.
- Users drag blocks from a right sidebar library into a main canvas, reorder them, edit block content, and see the compiled prompt text live.

Tech constraints
- React + TypeScript + Vite
- TailwindCSS
- Drag and drop: use @dnd-kit (preferred) or an equivalent modern library
- Persistence: localStorage only (no backend)
- Open source only: do NOT include premium/paid features or gating

App pages (2 pages only)

1) /programs
- List all saved programs (prompt programs).
- Each program card shows: name, category, updatedAt.
- Actions: Create new, Rename/Edit, Duplicate, Delete.
- Clicking a program opens /builder/:programId.

2) /builder/:programId
Layout (must match):
- Right Sidebar: library of draggable blocks (block types)
- Main Area: canvas drop zone with an ordered list of block instances
- Bottom (or side) panel: a large text area showing compiled prompt text (read-only) + Copy button
- Add Save indicator (saved/unsaved)

Block system
- A “Block Type” is a template users can drag into the canvas.
- A “Block Instance” is a block on the canvas with editable content.

Implement these block types:
- Role: “You are a {{role}}”
- Task: “Your task: {{task}}”
- Context: “Context: {{context}}”
- Constraints: list of bullet constraints (editable list)
- Tone: “Tone: {{tone}}”
- Output Format: choice (plain text, bullet list, JSON) plus optional JSON schema text area
- Examples: list of (input, output) example pairs

Editing UX
- Clicking a block in the canvas opens an editor panel (can be a modal or a panel on the left/top of the canvas).
- Editor fields depend on block type.
- Canvas blocks support remove and duplicate actions.

Compiler
- Compiled prompt text is generated from the canvas blocks in their current order.
- Each block compiles into a section with a heading label (e.g., "ROLE", "TASK") and its content below.
- Skip empty sections cleanly.
- Constraints compile as bullet list.
- Examples compile as a numbered list (Example 1, Example 2).

Persistence
- Save per program:
  - program metadata (id, name, category)
  - canvas blocks array (type + content)
  - updatedAt
- Auto-save on change with a small debounce (e.g., 500ms).
- Also add an explicit “Save now” button.

Data model (suggested)
- Program: { id, name, category, createdAt, updatedAt, blocks: BlockInstance[] }
- BlockInstance: { id, type, data }
- data shape varies by type

Project structure
- src/pages: ProgramsPage, BuilderPage
- src/components: ProgramCard, BlockLibrary, Canvas, CanvasBlock, BlockEditor, CompiledPanel
- src/lib: storage.ts, compiler.ts, ids.ts
- src/types: blocks.ts

Quality requirements
- Add ESLint + Prettier
- Add unit tests with Vitest for compiler.ts:
  - respects canvas ordering
  - constraints bullet formatting
  - skips empty sections
- Provide a clean README:
  - what PromptBlocks is
  - local dev commands
  - how to add a new block type
  - how storage works

Deliverables
- Working app that runs with:
  - npm install
  - npm run dev
- Good UX defaults and clean code.
