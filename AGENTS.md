# Repository Guidelines

## Project Structure & Modules
- `src/main.ts`: Obsidian plugin entry; registers the MFDI view.
- `src/ui/`: React components (Chakra UI, TSX) including `MDFIView.tsx` and `ReactView.tsx`.
- `src/utils/`: Utilities and tests (e.g., `strings.ts`, `*.test.ts`).
- `src/clients/`: External service clients (e.g., `bluesky.ts`).
- `src/obsutils/`: Obsidian-specific helpers; `src/settings.ts` defines plugin settings.
- Root assets/config: `manifest.json`, `styles.css`, `esbuild.config.mjs`, `jest.config.js`.

## Build, Test, and Development
- `bun run dev`: Start esbuild in watch mode and sync artifacts to your Obsidian vault. Update `VAULT_DIR` in `esbuild.config.mjs` to your local path.
- `bun run build`: Type-check (no emit) and produce a production bundle to `main.js`.
- `bun run test`: Run Jest tests (esbuild-jest transform, jsdom available).
- `bun run ci`: Install, build, and test; mirrors the release pipeline.
- Git hooks: enable with `git config core.hooksPath hooks` (see README Setup).

## Coding Style & Naming
- Language: TypeScript (strict) + React (TSX). Keep modules small and typed.
- Formatting: Prettier (`.prettierrc`), LF line endings. Use Prettier defaults (2 spaces, single quotes OK).
- Filenames: React components `PascalCase.tsx`; helpers/modules `kebab-case.ts`.
- Tests: colocate as `*.test.ts` next to the unit under test.

## Testing Guidelines
- Framework: Jest with `esbuild-jest` transform.
- Scope: Prioritize `src/utils/` and pure functions; mock Obsidian APIs when needed.
- Run: `bun run test`. Add focused tests for regressions; keep them fast and deterministic.

## Commit & Pull Requests
- Convention: Conventional Commits enforced by `hooks/commit-msg` and semantic-release.
  - Types: `feat`, `fix`, `style`, `build`, `docs`, `refactor`, `test`, `ci`, `dev`, `chore`.
  - Allowed scopes (examples): `ポストビュー`, `タスクビュー`, `Bluesky`.
  - Example: `feat(ポストビュー): タップで編集を開始`
- PRs: include clear description, linked issue, and screenshots for UI. Note any manifest or settings changes. Ensure `bun run build && bun run test` pass.

## Security & Configuration
- Do not commit credentials. Bluesky identifiers/passwords must be provided securely at runtime.
- Keep `VAULT_DIR` local to your machine; don’t push personalized paths.

## MCP Tools
- Config: `.mcp/servers.json` declares two MCP servers: `serena` and `context7`.
- Commands: Both are assumed available on `PATH` as `serena` and `context7`. If you use custom paths, point your client to the repo file or alias the commands.
- Secrets: Export `SERENA_API_KEY` and/or `CONTEXT7_API_KEY` in your shell or client settings as required by each tool.
- Usage: Point your MCP-capable client (e.g., editor/agent) to load project servers from `.mcp/servers.json`. Ensure they run with stdio-compatible settings if your client requires it.
