# PromptBlocks

PromptBlocks is an open-source visual prompt builder where users assemble "Prompt Blocks" — Role, Task, Context, Constraints, Tone, Output Format, Examples — by dragging and dropping them onto a canvas, similar to Scratch. The compiled prompt is generated live and can be copied with one click.

## The Benchmark

The primary purpose of this repository is to **benchmark AI coding models**. Every subdirectory is a complete, independent implementation of the same PromptBlocks application, built from the single set of requirements in [`prompt.md`](./prompt.md).

The idea is simple: give different AI models the exact same prompt and compare what they produce — code quality, architecture decisions, UX polish, test coverage, and how closely they follow the spec.

### Implementations

| Directory | Model |
|-----------|-------|
| [`GLM-5/`](./GLM-5) | GLM-5 |
| [`GLM-5.1/`](./GLM-5.1) | GLM-5.1 |
| [`codex-5.3/`](./codex-5.3) | OpenAI Codex 5.3 |
| [`gemini-3/`](./gemini-3) | Google Gemini 3 |
| [`gemini-3.1/`](./gemini-3.1) | Google Gemini 3.1 |
| [`kimi-k2.5/`](./kimi-k2.5) | Kimi K2.5 |
| [`minimax-2.5/`](./minimax-2.5) | MiniMax 2.5 |

Each implementation is self-contained with its own `package.json`, source code, and tests.

### How to run an implementation

```bash
cd <model-directory>   # e.g. cd GLM-5.1
npm install
npm run dev
```

Then open the URL shown in the terminal (typically `http://localhost:5173`).

### What's being compared

- **Spec adherence** — Does the app match the two-page layout, block types, and compiler behavior described in `prompt.md`?
- **Code quality** — TypeScript usage, project structure, separation of concerns
- **UX** — Drag and drop feel, editor interactions, responsive design
- **Testing** — Compiler test coverage, edge cases handled
- **Tooling** — ESLint, Prettier, proper Vite configuration

## The Application

If you just want to use PromptBlocks:

1. Open the `/programs` page to create or manage prompt programs
2. Click into a program to open the `/builder/:programId` page
3. Drag blocks from the right sidebar onto the canvas
4. Edit each block's content
5. The compiled prompt appears in the bottom panel — copy it and use it anywhere

Data is stored in `localStorage` only. No backend, no accounts, no tracking.

## Adding a New Model

1. Create a new directory at the root named after the model (e.g. `claude-4.5/`)
2. Feed `prompt.md` to the model and have it generate the full implementation
3. Ensure it runs with `npm install && npm run dev`
4. Add it to the table above
