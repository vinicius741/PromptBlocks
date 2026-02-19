# PromptBlocks

A visual prompt builder that helps users create better AI prompts by assembling "Prompt Blocks" in a Scratch-like drag-and-drop interface.

## Features

- **Visual Block Builder**: Drag and drop blocks from a library into a canvas
- **7 Block Types**: Role, Task, Context, Constraints, Tone, Output Format, Examples
- **Live Preview**: See compiled prompt text in real-time
- **Auto-save**: Changes are automatically saved with 500ms debounce
- **Local Storage**: All data persists in browser localStorage (no backend required)
- **Open Source**: Free to use with no premium features

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Run Tests

```bash
npm run test
```

### Lint & Format

```bash
npm run lint
npm run format
```

## Project Structure

```
src/
├── components/
│   ├── BlockEditor/      # Modal for editing block content
│   ├── BlockLibrary/     # Right sidebar with draggable block types
│   ├── Canvas/            # Main drop zone for blocks
│   ├── CanvasBlock/       # Individual block on the canvas
│   ├── CompiledPanel/    # Bottom panel showing compiled prompt
│   ├── ProgramCard/       # Card component for program list
│   ├── SaveIndicator/    # Shows save status (saved/unsaved)
│   └── ui/               # Shared UI components (Button, Input, Modal)
├── lib/
│   ├── compiler.ts        # Compiles blocks to prompt text
│   ├── ids.ts            # ID generation utilities
│   ├── storage.ts        # localStorage persistence
│   └── compiler.test.ts  # Unit tests for compiler
├── pages/
│   ├── ProgramsPage.tsx  # /programs - list all programs
│   └── BuilderPage.tsx   # /builder/:programId - edit a program
├── types/
│   └── blocks.ts         # TypeScript types and block definitions
├── App.tsx               # Main app with routing
└── main.tsx             # Entry point
```

## Adding a New Block Type

1. **Define the Block Type** in `src/types/blocks.ts`:
   - Add a new type to `BlockType` union
   - Add a new interface for the block data
   - Add the block to `BLOCK_TYPE_DEFINITIONS` array with icon, color, and default data

2. **Update the Compiler** in `src/lib/compiler.ts`:
   - Add a compile function for the new block type
   - Add a case in `compileBlock` switch statement

3. **Update the Editor** in `src/components/BlockEditor/index.tsx`:
   - Add a case in `renderFields()` to render the appropriate form fields

## Storage

All data is stored in browser `localStorage` under the key `promptblocks_programs`. The data structure:

```typescript
interface Program {
  id: string;
  name: string;
  category: string;
  createdAt: string;  // ISO date string
  updatedAt: string; // ISO date string
  blocks: BlockInstance[];
}

interface BlockInstance {
  id: string;
  type: BlockType;
  data: BlockData;
}
```

Data is automatically saved with a 500ms debounce when blocks change. Manual save is also available via the "Save" button.

## Block Types

| Type | Description | Fields |
|------|-------------|--------|
| Role | Define the AI persona | role (text) |
| Task | Specify the main objective | task (textarea) |
| Context | Provide background info | context (textarea) |
| Constraints | List limitations/rules | constraints (list) |
| Tone | Set response tone | tone (text) |
| Output Format | Define output structure | format (select), schema (textarea) |
| Examples | Show input/output pairs | examples (list of {input, output}) |

## License

MIT
