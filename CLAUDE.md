# Claude Code — Ops Console

Read **`docs/harness.md`** first. It is the single source of truth for architecture, reuse rules, and Definition of Done.

> 中文版 / Chinese：[CLAUDE.zh-CN.md](./CLAUDE.zh-CN.md) · [docs/harness.zh-CN.md](./docs/harness.zh-CN.md)  
> Prompt playbook：[docs/prompts.md](./docs/prompts.md)

## Quick commands

```bash
npm run dev       # start app (Mock API)
npm run verify    # typecheck + lint + test + build
npm run test      # vitest
npm run typecheck
```

## Where to work

- New CRUD screens → `src/modules/<domain>/` using `ProTable` + `SchemaForm` + `useCrud`
- Shared abstractions → `src/components/`, `src/hooks/` (only when needed)
- API / Mock → `src/api/`

## Hard rules

- Reuse shared table/form/CRUD hook; no one-off table/form copies in modules
- Strict TypeScript; no `any`
- After changes: `npm run verify` must pass
- Do not refactor core shared APIs or layout unless the task asks
