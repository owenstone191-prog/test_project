# Codex / AI Agents — Ops Console

Before editing code, read **`docs/harness.md`**. Keep this file short; details live there.

> 中文版 / Chinese：[AGENTS.zh-CN.md](./AGENTS.zh-CN.md) · [docs/harness.zh-CN.md](./docs/harness.zh-CN.md)  
> Prompt playbook：[docs/prompts.md](./docs/prompts.md)

## Commands

| Command | Use |
|---------|-----|
| `npm run dev` | Local app with Mock backend |
| `npm run verify` | Full gate: typecheck + lint + test + build |
| `npm run test` | Unit / component tests |
| `npm run typecheck` | `tsc -b --pretty false` |
| `npm run lint` | oxlint |

## Conventions (summary)

1. Business modules live in `src/modules/*` and must reuse `ProTable`, `SchemaForm`, `Modal`, `useCrud`.
2. Types are shared between Mock and service functions — never diverge field names.
3. One focused change set per task; run `npm run verify` before finishing.
4. Do not modify shared component public APIs or global request client unless explicitly requested.

## Module checklist

- [ ] List + keyword/filter + pagination
- [ ] Create / edit via SchemaForm modal
- [ ] Delete (or archive) with confirm
- [ ] Types + Mock handlers + tests if logic is non-trivial
