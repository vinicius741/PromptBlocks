# PromptBlocks

An open-source web app that helps users create AI prompts by assembling "Prompt Blocks" in a Scratch-like drag-and-drop interface.

## Features

- **Visual Block Builder**: Drag and drop pre-defined block types to construct prompts
- **7 Block Types**:
  - **Role**: Define the AI persona or expertise
  - **Task**: Describe what the AI should do
  - **Context**: Provide background information
  - **Constraints**: Set rules and limitations (bullet list format)
  - **Tone**: Specify the writing style
  - **Output Format**: Define response structure (plain text, bullet points, or JSON with optional schema)
  - **Examples**: Provide input/output examples
- **Live Compilation**: See your compiled prompt in real-time
- **Program Management**: Create, rename, duplicate, and delete programs
- **Auto-save**: Changes are automatically saved to localStorage
- **Copy to Clipboard**: One-click copy of compiled prompts

## Tech Stack

- React 18 + TypeScript
- Vite for development and bundling
- TailwindCSS for styling
- @dnd-kit for drag and drop
- React Router for routing
- localStorage for persistence
- Vitest for testing

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Lint code
npm run lint
```

## Project Structure

```
promptblocks/
├── src/
│   ├── pages/
│   │   ├── ProgramsPage.tsx      # List all saved programs
│   │   └── BuilderPage.tsx       # Block builder canvas
│   ├── components/
│   │   ├── ProgramCard.tsx       # Program list item
│   │   ├── BlockLibrary.tsx      # Right sidebar with draggable blocks
│   │   ├── Canvas.tsx            # Drop zone for blocks
│   │   ├── CanvasBlock.tsx       # Individual block in canvas
│   │   ├── BlockEditor.tsx       # Modal for editing block content
│   │   └── CompiledPanel.tsx     # Compiled prompt output
│   ├── lib/
│   │   ├── storage.ts            # localStorage utilities
│   │   ├── compiler.ts           # Prompt compilation logic
│   │   └── ids.ts                # ID generation utilities
│   ├── types/
│   │   └── blocks.ts             # TypeScript type definitions
│   ├── hooks/
│   │   └── useAutoSave.ts        # Auto-save with debounce
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── tests/
│   └── compiler.test.ts          # Unit tests for compiler
└── package.json
```

## Architecture

### Data Model

- **Program**: Contains id, name, category, timestamps, and an array of blocks
- **BlockInstance**: An instance of a block on the canvas with id, type, and data
- **BlockData**: Type-specific data shape (varies by block type)

### Storage

All data is persisted to `localStorage` under the key `promptblocks_programs`. Each program is stored as a JSON object with full block data.

### Compiler

The compiler transforms an ordered array of blocks into a formatted prompt string:
- Each block type generates a section with a header (`## SECTION_NAME`)
- Empty sections are skipped
- Constraints are formatted as bullet lists
- Examples are formatted as numbered input/output pairs

### Drag and Drop

Uses @dnd-kit for:
- Dragging new blocks from the library to the canvas
- Reordering existing blocks within the canvas
- Visual feedback during drag operations

## Adding New Block Types

1. Add the type to `BlockType` in `src/types/blocks.ts`
2. Create the corresponding data interface
3. Add to `BLOCK_TYPES` array with metadata
4. Add compilation logic in `src/lib/compiler.ts`
5. Add editor component in `src/components/BlockEditor.tsx`
6. Add preview logic in `src/components/CanvasBlock.tsx`
7. Add color in `tailwind.config.js`

## Usage

1. **Create a Program**: Click "New Program" from the programs page
2. **Add Blocks**: Drag block types from the right sidebar to the canvas
3. **Edit Blocks**: Click "Edit" on any block to customize its content
4. **Reorder Blocks**: Drag blocks within the canvas to reorder
5. **Copy Prompt**: Use the "Copy" button in the compiled panel to copy your prompt
6. **Save**: Changes auto-save, or click "Save Now" for immediate save

## License

MIT
