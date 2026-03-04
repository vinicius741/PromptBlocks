# Repository Guidelines

This document provides comprehensive guidelines for AI agents working in this repository.

## Project Overview

PromptBlocks is a visual prompt builder application inspired by Scratch. Users drag and drop "Prompt Blocks" (Role, Task, Context, Tone, etc.) to construct structured AI prompts. Each subdirectory represents a different AI model's implementation of this concept.

## Project Structure

```
PromptBlocks/
├── README.md           # Project overview and benchmarking purpose
├── prompt.md           # Canonical specification for all implementations
├── GLM-5/              # GLM-5 implementation (older, React 18)
├── codex-5.3/          # Codex 5.3 implementation (React 19)
├── gemini-3/           # Gemini 3 implementation (React 19, Tailwind v4)
├── gemini-3.1/         # Gemini 3.1 implementation
└── minimax-2.5/        # Minimax 2.5 implementation
```

### Common Directory Structure (per implementation)

Each implementation follows this structure:

```
src/
├── pages/              # Top-level route components (ProgramsPage, BuilderPage)
├── components/         # UI building blocks
│   ├── canvas/         # Canvas rendering and block placement
│   ├── editor/         # Text/code editors
│   ├── library/       # Block library sidebar
│   └── panels/         # Side panels and configuration
├── lib/                # Core business logic
│   ├── compiler.ts     # Prompt compilation to output format
│   ├── ids.ts          # ID generation utilities
│   └── storage.ts      # localStorage persistence
├── types/              # TypeScript type definitions
├── hooks/              # Custom React hooks
└── App.tsx             # Main app component
tests/                  # Test files (or alongside code as *.test.ts)
```

## Build, Test, and Development Commands

Run all commands from the target implementation directory (e.g., `cd GLM-5`).

### Installation
```bash
npm install             # Install dependencies
```

### Development
```bash
npm run dev             # Start Vite dev server (hot reload)
npm run preview         # Serve production build locally
```

### Building
```bash
npm run build           # Typecheck (tsc) + build for production
```

### Testing
```bash
npm run test            # Run Vitest once (vitest run)
npm run test:watch      # Run Vitest in watch mode (vitest)
```

#### Running a Single Test

To run a specific test file:
```bash
npx vitest run src/lib/compiler.test.ts
```

To run tests matching a pattern:
```bash
npx vitest run --grep "compiler"
```

To run a specific test by name:
```bash
npx vitest run -t "should compile simple prompt"
```

### Linting & Formatting
```bash
npm run lint            # ESLint on source files
npm run format          # Prettier format (write)
npm run format:check    # Prettier check only
```

## Code Style Guidelines

### General Principles
- **TypeScript + React** - Use functional components and hooks exclusively
- **ESLint + Prettier** - Do not manually format; let tools handle it
- **Avoid magic numbers** - Use named constants
- **Keep it simple** - Prefer readable, maintainable code over clever tricks

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Files/Components | PascalCase | `CanvasBlock.tsx`, `BuilderPage.tsx` |
| Hooks | camelCase, prefix `use` | `useAutoSave.ts`, `useBlockDrag.ts` |
| Utilities | PascalCase or camelCase | `compiler.ts`, `ids.ts` |
| Types/Interfaces | PascalCase | `BlockConfig`, `PromptNode` |
| Constants | SCREAMING_SNAKE | `MAX_BLOCKS`, `DEFAULT_TONE` |
| CSS classes | kebab-case (Tailwind) | `flex items-center`, `p-4` |

### Imports & Exports

```typescript
// Preferred: explicit named imports (tree-shakeable)
import { useState, useEffect } from 'react';
import { BlockConfig } from '../types';
import { compilePrompt } from '../lib/compiler';

// Avoid: default imports for utilities
// Bad: import compiler from '../lib/compiler'

// Barrel files (index.ts) allowed for clean public APIs
export { BlockConfig, PromptNode } from './types';
```

### TypeScript Guidelines

- **Always define types** - Avoid `any`, use `unknown` when type is uncertain
- **Use strict typing** - Enable `strict: true` in tsconfig
- **Prefer interfaces over types** for object shapes (extensible)
- **Use type aliases** for unions, primitives, and computed types
- **Export types** that are used across modules

```typescript
// Good
interface BlockConfig {
  id: string;
  type: BlockType;
  content: string;
}

// Avoid
const block: any = { ... };
```

### React Patterns

- **Functional components only** - No class components
- **Custom hooks** for reusable stateful logic
- **useCallback/useMemo** - Use sparingly, when there's measurable perf gain
- **Props interface** - Always define explicit prop types

```typescript
// Good
interface BlockProps {
  id: string;
  onSelect: (id: string) => void;
}

export function Block({ id, onSelect }: BlockProps) {
  // ...
}
```

### Error Handling

- **Use try/catch** for async operations with meaningful error messages
- **Avoid silent failures** - Always log or surface errors
- **Type-safe errors** - Consider discriminated union error types

```typescript
// Good
try {
  const result = await loadPrompt(id);
} catch (error) {
  console.error('Failed to load prompt:', error);
  throw new Error('Prompt could not be loaded');
}

// Avoid
try { ... } catch { ... }  // Empty catch
```

### CSS & Styling

- **Tailwind CSS** - Use utility classes, avoid custom CSS when possible
- **Responsive design** - Use mobile-first approach (`base`, `md:`, `lg:`)
- **Consistent spacing** - Use Tailwind's spacing scale (p-1, p-2, p-4, etc.)
- **Dark mode** - Support if implementation includes it

### Component Structure

```typescript
// 1. Imports
import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

// 2. Types
interface Props {
  // ...
}

// 3. Component
export function ComponentName({ }: Props) {
  // 4. State
  const [state, setState] = useState();

  // 5. Callbacks
  const handleClick = useCallback(() => { ... }, []);

  // 6. Effects
  useEffect(() => { ... }, []);

  // 7. Render
  return ( ... );
}
```

## Testing Guidelines

- **Framework**: Vitest (+ React Testing Library where configured)
- **Naming**: `*.test.ts` for unit tests, `*.test.tsx` for component tests
- **Location**: Keep tests close to the code they validate (or in `tests/` directory)
- **Coverage**: Aim to cover prompt compilation rules, state management, and user interactions

### Test File Examples

```typescript
// src/lib/compiler.test.ts
import { describe, it, expect } from 'vitest';
import { compilePrompt } from './compiler';

describe('compilePrompt', () => {
  it('should compile role block', () => {
    const blocks = [{ type: 'role', content: 'Expert Developer' }];
    expect(compilePrompt(blocks)).toContain('Expert Developer');
  });
});
```

### Running Tests

```bash
# Single file
npx vitest run src/lib/compiler.test.ts

# Watch mode for file
npx vitest src/lib/compiler.test.ts

# Coverage
npx vitest run --coverage
```

## Git & Commit Guidelines

### Commit Message Format
Follow Conventional Commits: `type(scope): description`

```bash
feat(canvas): add drag-and-drop for blocks
fix(compiler): handle empty block list
docs: update README with new commands
refactor(types): extract BlockConfig to shared module
test: add tests for prompt compilation
```

Emoji prefixes are acceptable (see Git history for examples).

### Branch Naming
- `feature/description` - New features
- `fix/description` - Bug fixes
- `refactor/description` - Code improvements

### Pull Requests
- Include short summary
- Link related issues
- Add screenshots for UI changes
- Keep implementation-specific changes scoped to relevant subfolder

## Security & Configuration

### Local Development
- **localStorage** - Used for persisting user data locally
- **No secrets** - Never commit API keys, tokens, or credentials
- **Environment variables** - Use `.env.example` for required vars

### Adding New Block Types

When introducing new block types:
1. Add type definition to `src/types/`
2. Update compiler logic in `src/lib/compiler.ts`
3. Create UI editor component in `src/components/editor/`
4. Add to block library in `src/components/library/`
5. Add tests for compilation rules

## Dependencies Overview

| Category | Library | Purpose |
|----------|---------|---------|
| UI | React 18/19 | UI framework |
| Routing | react-router-dom | Page navigation |
| Drag & Drop | @dnd-kit | Block reordering |
| Styling | Tailwind CSS | Utility-first |
| Testing | CSS Vitest | Unit testing |
| Types | TypeScript | Type safety |

## Troubleshooting

### Common Issues

**TypeScript errors**: Run `npm run build` to see full type errors
**ESLint failures**: Check `.eslintrc.json` or `eslint.config.js` in the implementation
**Test failures**: Run with `--verbose` flag for detailed output
**Missing deps**: Run `npm install` in the affected implementation folder
