# PromptBlocks

PromptBlocks is an open-source visual prompt builder. Users assemble "Prompt Blocks" in a Scratch-like way to create structured AI prompts. Drag blocks from a library into a canvas, reorder them, edit their content, and see the compiled prompt text update live.

## Features

- **Visual Canvas**: Drag and drop blocks from the library onto the canvas and reorder them.
- **Block Editor**: Click any canvas block to edit its fields in a dedicated panel.
- **Live Compilation**: See the compiled prompt text update instantly as you edit blocks.
- **Programs**: Save multiple prompt programs with metadata (name, category).
- **Persistence**: All data is stored in `localStorage` — no backend required.
- **Auto-save**: Changes are saved automatically after a short debounce.

## Tech Stack

- React 19 + TypeScript
- Vite
- TailwindCSS
- @dnd-kit (drag and drop)
- Vitest (unit testing)
- ESLint + Prettier

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

### Other Commands

```bash
npm run build          # Typecheck and production build
npm run preview        # Preview production build
npm run test           # Run Vitest unit tests
npm run test:watch     # Run Vitest in watch mode
npm run lint           # Run ESLint
npm run format         # Run Prettier (write)
```

## Project Structure

```
src/
  pages/
    ProgramsPage.tsx      # List all saved programs
    BuilderPage.tsx       # Visual builder for a single program
  components/
    ProgramCard.tsx       # Card UI for a program
    library/
      BlockLibrary.tsx    # Draggable block type sidebar
    canvas/
      Canvas.tsx          # Canvas drop zone
      CanvasBlock.tsx     # Individual sortable block on canvas
    editor/
      BlockEditor.tsx     # Block editing panel
    panels/
      CompiledPanel.tsx   # Read-only compiled prompt + copy button
  lib/
    blocks.ts             # Default data factory for block types
    compiler.ts           # Compile blocks into prompt text
    compiler.test.ts      # Unit tests for compiler
    ids.ts                # ID generation utilities
    storage.ts            # localStorage CRUD for programs
  types/
    blocks.ts             # TypeScript types for blocks and programs
```

## How to Add a New Block Type

1. **Add the type** in `src/types/blocks.ts`:

   ```ts
   export type BlockType = 'role' | 'task' | ... | 'myNewType'
   ```

   Define its data shape:

   ```ts
   export interface MyNewTypeData {
     value: string
   }
   ```

   Update the `BlockData` union.

2. **Add default data** in `src/lib/blocks.ts`:

   ```ts
   case 'myNewType':
     return { value: '' }
   ```

3. **Update the compiler** in `src/lib/compiler.ts`:
   Add a `case 'myNewType'` in `compileBlock` that returns a formatted string or `null` if empty.

4. **Update the UI** in `src/components/editor/BlockEditor.tsx`:
   Add a rendering branch for the new type so users can edit its fields.

5. **Register in the library** in `src/components/library/BlockLibrary.tsx`:
   Add the block type to the `BLOCK_TYPES` array so it appears in the sidebar.

6. **Add tests** in `src/lib/compiler.test.ts` for the new block type.

## How Storage Works

Programs are saved to `localStorage` under the key `promptblocks_programs`.

Each program is an object:

```ts
{
  id: string
  name: string
  category: string
  createdAt: number
  updatedAt: number
  blocks: BlockInstance[]
}
```

- **Auto-save**: The builder auto-saves with a 500ms debounce whenever blocks or metadata change.
- **Explicit save**: A "Save now" button is available in the builder header.
- **No backend**: All data lives in the browser. Clearing site data will remove programs.

## License

MIT
