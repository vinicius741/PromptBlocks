# PromptBlocks

PromptBlocks is an open-source web application that helps users create better AI prompts by assembling "Prompt Blocks" in a visual, Scratch-like interface.

## Features

- **Visual Assembly**: Drag and drop blocks to structure your prompt.
- **Live Preview**: See your compiled prompt update in real-time.
- **Block Library**: Specialized blocks for Roles, Tasks, Context, Constraints, Tone, Output Format, and Examples.
- **Persistence**: Automatically saves your programs to `localStorage`.
- **Open Source**: Built with React, TypeScript, TailwindCSS, and @dnd-kit.

## Local Development

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Setup

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Run tests:
   ```bash
   npm test
   ```

## How to add a new block type

1. **Define the Data Shape**: Add the new data interface and block type to `src/types/blocks.ts`.
2. **Update the Compiler**: Add logic to handle the new block type in `src/lib/compiler.ts`.
3. **Add to Library**: Include the new block type in the `BLOCK_TYPES` array in `src/components/BlockLibrary.tsx`.
4. **Implement Editor Fields**: Add the corresponding UI fields in `src/components/BlockEditor.tsx`.
5. **Add Preview Logic**: Update `getPreviewText` in `src/components/CanvasBlock.tsx`.

## How storage works

PromptBlocks uses `localStorage` for all persistence. The data is stored under the key `prompt_blocks_programs`.

- Programs are fetched and saved using the utility functions in `src/lib/storage.ts`.
- Auto-save is implemented in the `BuilderPage` with a 1-second debounce.
- There is also an explicit "Save Now" button for manual saving.

## Tech Stack

- **Framework**: React 19 + Vite
- **Language**: TypeScript
- **Styling**: TailwindCSS 4
- **Drag and Drop**: @dnd-kit
- **Icons**: Lucide React
- **Testing**: Vitest + React Testing Library
