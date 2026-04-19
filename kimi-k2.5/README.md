# PromptBlocks

A visual prompt builder application inspired by Scratch. Drag and drop "Prompt Blocks" to construct structured AI prompts.

![PromptBlocks Screenshot](https://via.placeholder.com/800x450.png?text=PromptBlocks+Screenshot)

## What is PromptBlocks?

PromptBlocks helps you create better AI prompts by assembling blocks in a visual, Scratch-like interface. Instead of writing prompts from scratch, you drag blocks from a library into a canvas, arrange them in order, and edit their content. The compiled prompt updates in real-time.

### Features

- **Visual Block Builder**: Drag blocks from the library to the canvas
- **Block Types**: Role, Task, Context, Constraints, Tone, Output Format, Examples
- **Live Compilation**: See your compiled prompt update as you build
- **Reorder Blocks**: Drag to reorder blocks on the canvas
- **Auto-save**: Changes are automatically saved to localStorage
- **Copy to Clipboard**: One-click copy of your compiled prompt

## Tech Stack

- React 19 + TypeScript
- Vite (build tool)
- TailwindCSS (styling)
- @dnd-kit (drag and drop)
- Vitest (testing)
- ESLint + Prettier (code quality)

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Format code
npm run format

# Check formatting
npm run format:check

# Lint code
npm run lint
```

## Project Structure

```
src/
├── pages/              # Page components
│   ├── ProgramsPage.tsx    # List all programs
│   └── BuilderPage.tsx     # Build/edit a program
├── components/         # Reusable components
│   ├── canvas/
│   │   ├── Canvas.tsx      # Main canvas with drop zone
│   │   └── CanvasBlock.tsx # Individual draggable block
│   ├── editor/
│   │   └── BlockEditor.tsx # Block editing panel
│   ├── library/
│   │   └── BlockLibrary.tsx # Draggable block library
│   ├── panels/
│   │   └── CompiledPanel.tsx # Compiled prompt display
│   └── ProgramCard.tsx     # Program list item
├── lib/                # Utility functions
│   ├── compiler.ts         # Prompt compilation logic
│   ├── compiler.test.ts    # Compiler tests
│   ├── ids.ts              # ID generation
│   └── storage.ts          # localStorage persistence
├── types/              # TypeScript definitions
│   └── blocks.ts           # Block and Program types
├── App.tsx             # Main app with routing
├── main.tsx            # Entry point
└── index.css           # Global styles + Tailwind
```

## How to Add a New Block Type

1. **Add the type definition** in `src/types/blocks.ts`:

```typescript
// Add to BlockType union
export type BlockType = 
  | 'role'
  | 'task'
  | 'custom';  // Add your new type

// Define the data interface
export interface CustomBlockData {
  customField: string;
}

// Add to BlockData union
export type BlockData =
  | RoleBlockData
  | CustomBlockData;  // Add your new type

// Add type guard
export function isCustomBlockData(data: BlockData): data is CustomBlockData {
  return 'customField' in data;
}

// Add to BLOCK_TYPE_REGISTRY
export const BLOCK_TYPE_REGISTRY: Record<BlockType, BlockTypeConfig> = {
  // ... existing types
  custom: {
    type: 'custom',
    label: 'Custom Block',
    description: 'A custom block type',
    icon: 'CustomIcon',  // Must exist in iconMap
    color: 'bg-pink-500',
    defaultData: { customField: '' },
  },
};
```

2. **Add the icon** to the icon maps in `BlockLibrary.tsx` and `CanvasBlock.tsx`:

```typescript
import { CustomIcon } from 'lucide-react';

const iconMap = {
  // ... existing icons
  CustomIcon,
};
```

3. **Add the compiler** in `src/lib/compiler.ts`:

```typescript
const compilers: Record<BlockType, BlockCompiler> = {
  // ... existing compilers
  custom: (data) => {
    const { customField } = data as CustomBlockData;
    if (!customField?.trim()) return null;
    return `CUSTOM\n\n${customField.trim()}`;
  },
};
```

4. **Add the editor** in `src/components/editor/BlockEditor.tsx`:

Add a new editor component and wire it up in the `BlockTypeEditor` switch statement:

```typescript
function CustomEditor({ data, onChange }: { data: CustomBlockData; onChange: (data: CustomBlockData) => void }) {
  return (
    <div>
      <input
        value={data.customField}
        onChange={(e) => onChange({ ...data, customField: e.target.value })}
      />
    </div>
  );
}

// In BlockTypeEditor switch:
case 'custom':
  return <CustomEditor data={block.data as CustomBlockData} onChange={onChange} />;
```

5. **Add tests** in `src/lib/compiler.test.ts`:

```typescript
it('should compile custom block', () => {
  const blocks: BlockInstance[] = [
    { id: '1', type: 'custom', data: { customField: 'Custom value' } },
  ];
  const result = compilePrompt(blocks);
  expect(result).toContain('CUSTOM');
  expect(result).toContain('Custom value');
});
```

## How Storage Works

PromptBlocks uses browser `localStorage` for persistence (no backend required).

### Data Structure

```typescript
interface Program {
  id: string;           // Unique identifier
  name: string;         // Display name
  category: string;     // Category for organization
  createdAt: number;    // Unix timestamp
  updatedAt: number;    // Unix timestamp
  blocks: BlockInstance[];
}

interface BlockInstance {
  id: string;           // Unique identifier
  type: BlockType;      // 'role', 'task', etc.
  data: BlockData;      // Type-specific content
}
```

### Storage Key

All data is stored under the key `promptblocks_programs` in localStorage.

### Auto-save

- Changes are debounced with a 500ms delay
- A "Save now" button is available for immediate saves
- Save status is shown (saved / saving / unsaved)
- Data is also saved on page unload if there are pending changes

### Storage Limits

localStorage typically has a 5-10MB limit. For large programs with many examples, this should be sufficient. If you need to store more data, consider:

1. Compressing the JSON before storage
2. Using IndexedDB instead of localStorage
3. Adding export/import functionality (already available via `storage.ts`)

## Architecture Decisions

### Why @dnd-kit?

@dnd-kit was chosen because it:
- Is modern and actively maintained
- Has excellent TypeScript support
- Provides both drag-and-drop and sortable utilities
- Works well with React 19
- Is lightweight and tree-shakeable

### Why localStorage?

localStorage was chosen for:
- Zero backend requirements
- Simple API
- Synchronous operations (no async/await complexity)
- Privacy (data stays on user's device)

Trade-offs:
- 5-10MB limit
- No sync between devices
- No sharing capabilities

### Why TailwindCSS?

TailwindCSS provides:
- Utility-first approach for rapid development
- Consistent design system
- Small bundle size with purge
- Easy customization

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Run linting (`npm run lint`)
6. Format code (`npm run format`)
7. Commit your changes (`git commit -m 'Add amazing feature'`)
8. Push to the branch (`git push origin feature/amazing-feature`)
9. Open a Pull Request

## License

MIT License - see LICENSE file for details.

## Credits

Built with:
- React (https://react.dev)
- Vite (https://vitejs.dev)
- TailwindCSS (https://tailwindcss.com)
- @dnd-kit (https://dndkit.com)
- Lucide Icons (https://lucide.dev)

Inspired by MIT's Scratch project (https://scratch.mit.edu).