# Repository Guidelines

## Project Structure & Module Organization
- Root: `README.md` explains the benchmark purpose; `prompt.md` is the canonical spec used by each implementation.
- Implementations live in subfolders: `GLM-5/`, `codex-5.3/`, `gemini-3/`. Each is a standalone Vite + React + TypeScript app.
- Common structure inside each app:
  - `src/pages/` for top-level routes (e.g., `ProgramsPage.tsx`, `BuilderPage.tsx`).
  - `src/components/` for UI building blocks (canvas, editor, library, panels).
  - `src/lib/` for core logic (compiler, ids, storage).
  - `src/types/` for shared TS types.
  - Tests live in `tests/` or alongside code as `*.test.ts`.

## Build, Test, and Development Commands
Run commands from the target implementation directory.
- `npm install` — install dependencies.
- `npm run dev` — start the Vite dev server.
- `npm run build` — typecheck and build for production.
- `npm run preview` — serve the production build locally.
- `npm run test` / `npm run test:watch` — run Vitest once or in watch mode.
- `npm run lint` — ESLint on `src/`.
- `npm run format` / `npm run format:check` — Prettier format or check.

## Coding Style & Naming Conventions
- TypeScript + React. Prefer functional components and hooks.
- File and component names use PascalCase (e.g., `CanvasBlock.tsx`).
- Hooks are `useX` (e.g., `useAutoSave.ts`).
- Keep logic in `src/lib/` and UI in `src/components/`.
- Use ESLint + Prettier; avoid manual formatting tweaks.

## Testing Guidelines
- Framework: Vitest (+ Testing Library where configured).
- Naming: `*.test.ts` for unit tests (e.g., `compiler.test.ts`).
- Keep tests close to the logic they validate and cover prompt compilation rules.

## Commit & Pull Request Guidelines
- Commits follow a Conventional Commits style: `feat:`, `fix:`, etc. Emoji prefixes are acceptable (see Git history).
- PRs should include: a short summary, linked issue (if any), and screenshots for UI changes.
- Keep implementation-specific changes scoped to the relevant subfolder.

## Security & Configuration Tips
- Local state is stored in `localStorage`; avoid adding secrets or tokens.
- If you introduce new block types, update `types`, compiler logic, and UI editors consistently.
