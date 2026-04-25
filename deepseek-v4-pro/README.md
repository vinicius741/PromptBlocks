# PromptBlocks

PromptBlocks is a visual prompt builder inspired by Scratch. Drag and drop "Prompt Blocks" (Role, Task, Context, Tone, etc.) to construct structured AI prompts. See the compiled prompt text update live as you build.

## Features

- **Drag-and-drop canvas** — assemble prompts by arranging blocks
- **7 block types** — Role, Task, Context, Constraints, Tone, Output Format, Examples
- **Live compilation** — compiled prompt text updates as you edit
- **Auto-save** — changes persist to localStorage automatically (500ms debounce)
- **Program management** — create, rename, duplicate, and delete prompt programs

## Local Development

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually http://localhost:5173).

### Other Commands

| Command | Description |
|---------|-------------|
| `npm run build` | Typecheck (tsc) + production build |
| `npm run preview` | Serve the production build locally |
| `npm test` | Run Vitest tests once |
| `npm run test:watch` | Run Vitest in watch mode |
| `npm run lint` | Check code with ESLint |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check formatting with Prettier |

## How to Add a New Block Type

1. **Add the type** in `src/types/blocks.ts`:
   - Add the new type to the `BlockType` union
   - Define a data interface for the block (e.g. `NewBlockData`)
   - Add it to the `BlockData` union

2. **Add compilation logic** in `src/lib/compiler.ts`:
   - Add a new `case` in the `switch` statement to compile the block into prompt text
   - Skip empty sections by returning `''`

3. **Add a default data factory** in `src/pages/BuilderPage.tsx`:
   - Add an entry to `DEFAULT_DATA` with sensible default values

4. **Create the editor UI** in `src/components/BlockEditor.tsx`:
   - Add a new sub-component for editing the block's fields
   - Conditionally render it based on `block.type`

5. **Add the block to the library** in `src/components/BlockLibrary.tsx`:
   - Add an entry to `BLOCK_TYPES` with the type, label, icon, and description

6. **Update the preview** in `src/components/CanvasBlock.tsx`:
   - Add a `case` in `getPreviewText` to show a summary of the block's data

7. **Add tests** in `src/lib/compiler.test.ts` for the new compilation logic

## How Storage Works

All programs are persisted to the browser's `localStorage` under the key `prompt_blocks_programs`. The data is stored as a JSON array of `Program` objects.

- `getPrograms()` — reads all programs from localStorage
- `saveProgram(program)` — upserts a program (creates or updates)
- `getProgram(id)` — finds a single program by ID
- `deleteProgram(id)` — removes a program by ID
- `savePrograms(programs)` — overwrites the entire store

Auto-save triggers 500ms after any change on the builder page. An explicit "Save Now" button is also available in the builder header.

## Tech Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- @dnd-kit for drag-and-drop
- react-router-dom v7 for routing
- Vitest for testing
- ESLint + Prettier for code quality
