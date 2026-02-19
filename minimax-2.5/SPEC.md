# PromptBlocks - Specification Document

## 1. Project Overview

- **Project Name**: PromptBlocks
- **Project Type**: Single-page web application (SPA)
- **Core Functionality**: A visual prompt builder that allows users to create better AI prompts by assembling "Prompt Blocks" in a Scratch-like drag-and-drop interface.
- **Target Users**: Developers, content creators, and AI enthusiasts who want to create well-structured prompts for AI models.

## 2. UI/UX Specification

### 2.1 Layout Structure

#### Programs Page (`/programs`)
- **Header**: App title "PromptBlocks" with tagline
- **Content Area**: Grid of program cards (responsive: 1-3 columns)
- **Empty State**: Friendly message with "Create your first program" CTA
- **Footer**: None

#### Builder Page (`/builder/:programId`)
- **Layout**: Three-column layout
  - **Left Panel** (optional): Block editor (appears when block selected)
  - **Center**: Main canvas drop zone
  - **Right Sidebar**: Block library (fixed width: 280px)
- **Bottom Panel**: Compiled prompt preview with copy button
- **Header**: Back button, program name (editable), save status indicator

### 2.2 Visual Design

#### Color Palette
- **Primary**: `#6366f1` (Indigo-500)
- **Primary Hover**: `#4f46e5` (Indigo-600)
- **Secondary**: `#f1f5f9` (Slate-100)
- **Accent**: `#10b981` (Emerald-500)
- **Background**: `#ffffff` (White)
- **Surface**: `#f8fafc` (Slate-50)
- **Border**: `#e2e8f0` (Slate-200)
- **Text Primary**: `#1e293b` (Slate-800)
- **Text Secondary**: `#64748b` (Slate-500)
- **Error**: `#ef4444` (Red-500)
- **Success**: `#22c55e` (Green-500)

#### Block Type Colors
- Role: `#8b5cf6` (Violet-500)
- Task: `#3b82f6` (Blue-500)
- Context: `#10b981` (Emerald-500)
- Constraints: `#f59e0b` (Amber-500)
- Tone: `#ec4899` (Pink-500)
- Output Format: `#06b6d4` (Cyan-500)
- Examples: `#f97316` (Orange-500)

#### Typography
- **Font Family**: `"Inter", system-ui, -apple-system, sans-serif`
- **Headings**:
  - H1: 32px, font-weight 700
  - H2: 24px, font-weight 600
  - H3: 18px, font-weight 600
- **Body**: 14px, font-weight 400
- **Small**: 12px, font-weight 400
- **Monospace** (for code/compiled): `"JetBrains Mono", "Fira Code", monospace`

#### Spacing System
- Base unit: 4px
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64px
- Card padding: 16px
- Section gap: 24px
- Component gap: 8px

#### Visual Effects
- **Border Radius**:
  - Small: 4px (buttons, inputs)
  - Medium: 8px (cards, panels)
  - Large: 12px (modals)
- **Shadows**:
  - Card: `0 1px 3px rgba(0,0,0,0.1)`
  - Elevated: `0 4px 12px rgba(0,0,0,0.1)`
  - Dragging: `0 8px 24px rgba(0,0,0,0.15)`
- **Transitions**: 150ms ease-out for hover states, 200ms for panels

### 2.3 Components

#### ProgramCard
- Shows: name, category, updatedAt (formatted)
- States: default, hover (slight lift + shadow), selected
- Actions: Edit, Duplicate, Delete (icon buttons on hover)

#### BlockLibrary (Right Sidebar)
- Title: "Block Library"
- List of draggable block type items
- Each item shows: icon, type name, brief description
- Hover state: background highlight
- Draggable with visual feedback

#### Canvas
- Drop zone with dashed border when empty
- "Drop blocks here" placeholder text
- Sortable list of CanvasBlock components
- Visual indicators for drop positions

#### CanvasBlock
- Shows: block type icon, block type label, content preview (truncated)
- States: default, hover, selected (highlighted border), dragging
- Actions: Edit, Duplicate, Delete (appear on hover)
- Drag handle for reordering

#### BlockEditor (Modal/Panel)
- Title: "Edit [Block Type]"
- Form fields based on block type
- Save and Cancel buttons
- Close on Escape key

#### CompiledPanel
- Large textarea (read-only)
- Monospace font
- Syntax highlighting optional
- "Copy" button with success feedback
- Character count display

#### SaveIndicator
- States: "Saved", "Saving...", "Unsaved changes"
- Icon + text
- Auto-hide after 2 seconds when saved

## 3. Functionality Specification

### 3.1 Core Features

#### Program Management
- Create new program with default name "Untitled Program"
- Rename program (inline edit or modal)
- Duplicate program (creates copy with "-copy" suffix)
- Delete program (with confirmation modal)
- List all programs sorted by updatedAt (newest first)

#### Block Library
- Display all available block types
- Drag block type from library to canvas (creates new instance)
- Visual feedback during drag

#### Canvas Operations
- Drop blocks from library to create new instances
- Reorder blocks via drag-and-drop
- Remove block from canvas
- Duplicate block in canvas
- Click block to open editor

#### Block Editing
- Each block type has specific editable fields:
  - **Role**: role (text input)
  - **Task**: task (textarea)
  - **Context**: context (textarea)
  - **Constraints**: constraints (list of strings, add/remove/reorder)
  - **Tone**: tone (text input)
  - **Output Format**: format (dropdown: plain text, bullet list, JSON), schema (textarea, optional)
  - **Examples**: examples (list of {input, output} pairs, add/remove/reorder)

#### Prompt Compilation
- Compile blocks in canvas order
- Each block generates:
  - Heading (uppercase, bold): e.g., "ROLE", "TASK"
  - Content below heading
- Constraints: bullet list format
- Examples: numbered list (Example 1, Example 2, etc.)
- Skip empty sections

#### Persistence
- Save to localStorage
- Auto-save with 500ms debounce
- Manual "Save now" button
- Data structure per program

### 3.2 Data Model

```typescript
type BlockType = 'role' | 'task' | 'context' | 'constraints' | 'tone' | 'outputFormat' | 'examples';

interface BlockData {
  // Role
  role?: string;
  // Task
  task?: string;
  // Context
  context?: string;
  // Constraints
  constraints?: string[];
  // Tone
  tone?: string;
  // Output Format
  format?: 'plainText' | 'bulletList' | 'json';
  schema?: string;
  // Examples
  examples?: { input: string; output: string }[];
}

interface BlockInstance {
  id: string;
  type: BlockType;
  data: BlockData;
}

interface Program {
  id: string;
  name: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  blocks: BlockInstance[];
}
```

### 3.3 User Interactions

- **Drag from library**: Click and drag block type, drop on canvas
- **Reorder in canvas**: Drag block handle, drop at new position
- **Edit block**: Click block, editor opens
- **Delete block**: Click delete icon on block
- **Duplicate block**: Click duplicate icon on block
- **Copy compiled**: Click copy button, shows "Copied!" feedback
- **Save**: Automatic on changes, manual via button

### 3.4 Edge Cases

- Empty canvas: Show helpful placeholder
- Empty program name: Default to "Untitled Program"
- Very long content: Truncate in block preview, full in editor/compiled
- Invalid JSON schema: Show validation error in editor
- localStorage full: Show error toast
- No programs: Show empty state with CTA

## 4. Acceptance Criteria

### Visual Checkpoints
- [ ] Programs page displays grid of program cards
- [ ] Builder page shows three-column layout
- [ ] Block library shows all 7 block types with colors
- [ ] Canvas displays blocks in order with drag handles
- [ ] Block editor opens as modal with correct fields
- [ ] Compiled panel shows formatted prompt text
- [ ] Save indicator shows correct status

### Functional Checkpoints
- [ ] Can create new program
- [ ] Can rename/duplicate/delete programs
- [ ] Can drag block from library to canvas
- [ ] Can reorder blocks in canvas
- [ ] Can edit block content
- [ ] Can delete/duplicate blocks in canvas
- [ ] Compiled prompt updates in real-time
- [ ] Copy button copies to clipboard
- [ ] Data persists in localStorage
- [ ] Auto-save works with debounce

### Test Checkpoints
- [ ] Compiler respects canvas ordering
- [ ] Constraints compile to bullet format
- [ ] Empty sections are skipped

## 5. Technical Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Drag & Drop**: @dnd-kit/core, @dnd-kit/sortable
- **Testing**: Vitest
- **Linting**: ESLint
- **Formatting**: Prettier
- **Icons**: Lucide React

## 6. Project Structure

```
src/
├── components/
│   ├── BlockEditor/
│   ├── BlockLibrary/
│   ├── Canvas/
│   ├── CanvasBlock/
│   ├── CompiledPanel/
│   ├── ProgramCard/
│   ├── ProgramList/
│   ├── SaveIndicator/
│   └── ui/ (shared components)
├── lib/
│   ├── compiler.ts
│   ├── ids.ts
│   └── storage.ts
├── pages/
│   ├── ProgramsPage.tsx
│   └── BuilderPage.tsx
├── types/
│   └── blocks.ts
├── App.tsx
├── main.tsx
└── index.css
```
