# Repository Guidelines

## Project Structure & Module Organization

- Root entrypoint `App.tsx` drives the single-page layout; `index.tsx` mounts the
  React app via Vite.
- `components/` holds reusable UI blocks (chat, sections, icons); keep new UI
  isolated here when possible.
- `services/` stores external integrations (e.g., `services/geminiService.ts`
  uses the Gemini API key from `VITE_GEMINI_API_KEY` or `GEMINI_API_KEY`).
- `constants.ts` centralizes portfolio data; `types.ts` defines shared TypeScript
  shapes; `images/` and `resume.pdf` are static assets.
- Built artifacts live in `dist/`; avoid committing edits there.

## Build, Test, and Development Commands

- `npm install` – install dependencies (Node 18+ recommended).
- `npm run dev` – start Vite dev server with hot reload; primary loop for UI changes.
- `npm run build` – production bundle; use as a pre-PR sanity check to catch type
  or config issues.
- `npm run preview` – serve the built bundle locally to mimic deploy behavior.

## Coding Style & Naming Conventions

- Language: TypeScript + React function components; prefer hooks over classes.
- Indentation: 2 spaces; favor single quotes in TS/JS, double quotes in JSX
  attributes to match existing code.
- Styling classes follow the current Tailwind-style utility strings; keep new
  class names consistent and minimal.
- File naming: PascalCase for React components, camelCase for helpers; avoid
  default exports unless a file exposes a single obvious component.
- No formatter is enforced; mirror surrounding style and keep imports ordered
  logically (react → libraries → local).

## Testing Guidelines

- No automated test suite yet; rely on `npm run build` plus manual smoke checks in
  the browser (clipboard actions, links, AI chat, downloads).
- If adding tests, colocate under `__tests__/` or alongside modules and use
  descriptive test names (e.g., `component handles empty state`). Aim for
  coverage of interactive behaviors.

## Commit & Pull Request Guidelines

- Commit messages follow a lightweight Conventional Commits style seen in history
  (`fix:`, `chore:`). Keep each commit scoped to one change.
- Include concise descriptions in PRs: what changed, why, validation steps, and
  UI screenshots/GIFs when visuals move.
- Link relevant issues or tasks; call out environment or secret requirements
  (e.g., Gemini API key) in the PR body.

## Security & Configuration Tips

- Do not commit secrets. Store the Gemini API key in `.env.local` as
  `VITE_GEMINI_API_KEY` (frontend) or `GEMINI_API_KEY` (Node/testing).
- Validate clipboard and external link features in multiple browsers to ensure
  permissions prompts are handled gracefully.
