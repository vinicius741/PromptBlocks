# PromptBlocks

A visual prompt builder that helps users create better AI prompts by assembling "Prompt Blocks" in a Scratch-like drag-and-drop interface.

Drag blocks from the library into the canvas, reorder them, edit content, and see the compiled prompt text update live.

## Quick Start

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Lint with ESLint |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check formatting |

## How It Works

### Two Pages

1. **`/programs`** — List all saved prompt programs. Create, rename, duplicate, or delete them.
2. **`/builder/:programId`** — The visual prompt builder with:
   - **Left panel**: Block editor (click a block to edit its content)
   - **Center**: Canvas drop zone with ordered block instances
   - **Right sidebar**: Draggable block library
   - **Bottom panel**: Compiled prompt preview with copy button

### Block Types

| Block | Description |
|-------|-------------|
| Role | Define the AI's role |
| Task | What the AI should do |
| Context | Background information |
| Constraints | Rules as a bullet list |
| Tone | Communication style |
| Output Format | Plain text, bullet list, or JSON with optional schema |
| Examples | Input/output example pairs |

### Adding a New Block Type

1. Add the type to the `BlockType` union in `src/types/blocks.ts`
2. Create the data interface (e.g., `interface MyBlockData { ... }`)
3. Add it to the `BlockData` union
4. Add metadata to the `BLOCK_TYPES` array with `type`, `label`, `description`, `color`, `defaultData`
5. Add a compile function in `src/lib/compiler.ts` and register it in the `compilers` map
6. Add editor fields in `src/components/BlockEditor.tsx`
7. Add tests for the new block type

## Storage

All data is stored in `localStorage` under the key `promptblocks_programs`. There is no backend — everything runs in the browser.

Programs auto-save with a 500ms debounce. A "Save now" button is also available.

## Tech Stack

- React 19 + TypeScript + Vite
- TailwindCSS for styling
- @dnd-kit for drag and drop
- react-router-dom for routing
- Vitest for testing
- ESLint + Prettier for code quality
