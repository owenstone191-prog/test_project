# Claude Code — Ops Console（中文）

请先阅读 **`docs/harness.zh-CN.md`**（中文）或 **`docs/harness.md`**（英文）。二者是同一套架构、复用原则与完成定义的单一事实源。

> 英文入口：[CLAUDE.md](./CLAUDE.md)  
> Prompt 剧本：[docs/prompts.zh-CN.md](./docs/prompts.zh-CN.md)

## 常用命令

```bash
npm run dev       # 启动应用（Mock API）
npm run verify    # typecheck + lint + test + build
npm run test      # vitest
npm run typecheck
```

## 改哪里

- 新 CRUD 页面 → `src/modules/<domain>/`，复用 `ProTable` + `SchemaForm` + `useCrud`
- 公共抽象 → `src/components/`、`src/hooks/`（仅在必要时）
- API / Mock → `src/api/`

## 硬性规则

- 复用公共表格 / 表单 / CRUD Hook；禁止在业务模块里另写一套
- 严格 TypeScript；禁止 `any`
- 改完必须：`npm run verify` 通过
- 未经任务要求，不要重构核心公共 API 或布局
