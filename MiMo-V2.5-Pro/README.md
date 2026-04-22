# PromptBlocks

A visual prompt builder that helps you create structured AI prompts by assembling reusable blocks — inspired by Scratch.

## What is PromptBlocks?

PromptBlocks lets you drag and drop "Prompt Blocks" (Role, Task, Context, Constraints, Tone, Output Format, Examples) onto a canvas, edit their content, reorder them, and instantly see the compiled prompt text. Programs are saved locally in your browser via localStorage.

## Local Development

```bash
# Install dependencies
npm install

# Start dev server (hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Lint
npm run lint

# Format
npm run format

# Check formatting
npm run format:check
```

## How to Add a New Block Type

1. **Define the type** in `src/types/blocks.ts`:
   - Add the new type string to the `BlockType` union
   - Create a data interface for the block's fields
   - Add it to the `BlockData` union
   - Add a `BlockDefinition` entry to `BLOCK_DEFINITIONS`

2. **Add a default data factory** in the `getDefaultData` function in `src/types/blocks.ts`

3. **Add compilation logic** in `src/lib/compiler.ts`:
   - Add a `case` in the `compileBlock` switch for your new type

4. **Add an editor** in `src/components/BlockEditor.tsx`:
   - Add a conditional block for your new type with the appropriate form fields

5. **Add tests** in `src/lib/compiler.test.ts`

## How Storage Works

- All programs are stored in `localStorage` under the key `promptblocks_programs`
- Each program contains: `id`, `name`, `category`, `createdAt`, `updatedAt`, and a `blocks` array
- Auto-save triggers 500ms after any change with a visual status indicator
- A manual "Save now" button is also available
- No backend or cloud storage — everything stays in your browser

## Tech Stack

- **React 19** + **TypeScript** + **Vite**
- **TailwindCSS** for styling
- **@dnd-kit** for drag-and-drop
- **Vitest** for testing
- **ESLint** + **Prettier** for code quality
- **react-router-dom** for routing
