# Agent prompt playbook

Copy-paste prompts that match the harness loop. Prefer one closed task per turn, then `npm run verify`.

> 中文版：[prompts.zh-CN.md](./prompts.zh-CN.md)

## 0. Bootstrap context

```text
Read docs/harness.md and AGENTS.md (or CLAUDE.md).
Do not change code yet. Summarize directory boundaries, reuse rules, and the Definition of Done in 5 bullets.
```

## 1. Shared CRUD abstractions

```text
Implement or harden shared CRUD building blocks only:
- ProTable (filters, pagination, empty/loading)
- SchemaForm + Modal
- useCrud
Follow docs/harness.md. Do not add business modules yet.
When done, run npm run verify and stop.
```

## 2. First business module

```text
Add the users module under src/modules/users using ProTable + SchemaForm + useCrud + Mock API.
Include list/search/filter/pagination and create/edit/delete.
Reuse shared components; do not fork table/form markup.
Run npm run verify when finished. Do not start the projects module in this turn.
```

## 3. Second business module

```text
Add the projects module the same way as users.
If shared APIs feel awkward, improve components/hooks first, then the module.
Update docs/harness.md only if conventions changed.
Run npm run verify and stop.
```

## 4. Contract / transport tweak

```text
Keep module pages unchanged. Adjust only src/api/* so Mock vs HTTP is switched by VITE_API_MODE via apiRequest.
Add or update tests for the changed contract. Run npm run verify.
```
