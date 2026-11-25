# Harness Engineering — Ops Console

Single source of truth for Claude Code and Codex. Agent entry files (`CLAUDE.md`, `AGENTS.md`) point here.

> 中文版 / Chinese：[harness.zh-CN.md](./harness.zh-CN.md)

## Stack

- React 19 + TypeScript (strict) + Vite
- React Router for admin shell routing
- Vitest + Testing Library for unit/component tests
- Mock-first API via `apiRequest` (`VITE_API_MODE=mock|http`)

## Directory rules

| Path | Purpose | Agent may edit? |
|------|---------|-----------------|
| `src/components/` | Shared UI (ProTable, SchemaForm, Modal, StatusBadge) | Only when task asks to extend shared API |
| `src/hooks/` | Shared CRUD / list hooks | Prefer reuse; extend carefully |
| `src/api/` | Domain services + Mock store + transport (`apiRequest`) | Yes for endpoints; keep types shared |
| `src/modules/<domain>/` | Business pages (config + thin glue) | Yes — primary work area |
| `src/layouts/` | Shell layout | Avoid unless navigation changes |
| `docs/harness.md` | This file | Update EN + ZH when conventions change |
| `docs/prompts.md` | Sample Agent prompts | Update when iteration playbook changes |

## Reuse principles (non-negotiable)

1. **Never** hand-roll table markup, form fields, or pagination in a module page.
2. Lists use `ProTable` + column/filter config. Forms use `SchemaForm` inside `Modal`.
3. Async CRUD uses `useCrud` (or the same request pattern). Do not duplicate loading/refresh/toast state.
4. API request shapes and Mock responses **share the same TypeScript types** under `src/api` / module `types.ts`.
5. No `any`. Prefer explicit unions for status/role enums.

## Definition of Done

Before considering a task complete, run:

```bash
npm run verify
```

This runs typecheck → lint → test → build. All must pass. CI runs the same command (`.github/workflows/verify.yml`).

## Task sizing for agents

Prefer single closed loops:

1. Extend shared component / hook
2. Implement or change one module
3. Run `npm run verify`
4. Stop — do not drive-by refactor unrelated files

See `docs/prompts.md` for copy-paste prompts.

## Mock / HTTP collaboration

- Default: `VITE_API_MODE=mock` (see `.env.example`). Domain services pass a `mock` factory into `apiRequest`.
- Switch to real backend: set `VITE_API_MODE=http` and `VITE_API_BASE_URL`. Transport flips in `src/api/client.ts`; **module pages stay unchanged**.
- Backend must honor the same paths/types (`/users`, `/projects`, list query: `page` / `pageSize` / `keyword` + domain filters).
- Honest limit: Mock business rules still live next to the service for speed; HTTP mode expects the real API to enforce the same contract.

## Forbidden without explicit ask

- Rewriting ProTable / SchemaForm public props for cosmetics
- Adding a second UI kit or CSS framework
- Committing secrets or `.env` with credentials
- Expanding scope beyond the stated task
