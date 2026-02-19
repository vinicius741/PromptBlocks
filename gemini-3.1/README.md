# PromptBlocks

PromptBlocks is an open-source web application that helps users create better AI prompts by assembling "Prompt Blocks" in a Scratch-like way. Users can drag blocks from a library into a main canvas, reorder them, edit their content, and see the compiled prompt text live.

## Features

- **Visual Block Builder**: Drag and drop blocks to assemble your prompt.
- **Multiple Block Types**: Support for Role, Task, Context, Constraints, Tone, Output Format, and Examples.
- **Live Compiler**: See your final prompt generated in real-time as you build it.
- **Local Storage**: All your programs are saved automatically to your browser's local storage.
- **Privacy First**: No backend server, no tracking. Everything stays on your machine.

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone this repository or download the code.
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`.

### Build for Production

```bash
npm run build
```

### Running Tests

To run the unit tests for the prompt compiler:
```bash
npm run test
```

## How to Add a New Block Type

1. **Define the Block Type**:
   Open `src/types/blocks.ts` and add your new block type to the `BlockType` union type and the `BLOCK_DEFINITIONS` array.
   ```typescript
   export type BlockType = 'Role' | 'Task' | ... | 'YourNewBlock';
   
   // Add to BLOCK_DEFINITIONS
   {
     type: 'YourNewBlock',
     label: 'Your New Block',
     description: 'Description of what this block does',
     defaultData: { someField: '' }
   }
   ```

2. **Add Editor Fields**:
   Open `src/components/BlockEditor.tsx` and add a new `case 'YourNewBlock':` inside the `renderFields` function to provide the UI for editing the block's data.

3. **Update the Compiler**:
   Open `src/lib/compiler.ts` and add the logic to compile your new block into text within the `switch (type)` statement.

## How Storage Works

PromptBlocks uses the browser's `localStorage` API to persist your prompt programs.

- The data is stored under the key `promptblocks_programs`.
- Programs and their blocks are serialized to JSON when saved.
- Saving is debounced and triggers automatically when you make changes to your blocks.
- There's also an explicit "Save Now" button to manually persist changes.

## Tech Stack

- **Framework**: React with Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Drag and Drop**: @dnd-kit
- **Icons**: Lucide React
- **Testing**: Vitest

## License

MIT License. Free and open-source.
