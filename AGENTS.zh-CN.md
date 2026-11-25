# Codex / AI Agents — Ops Console（中文）

改代码前先读 **`docs/harness.zh-CN.md`**（或英文版 `docs/harness.md`）。本文件保持精简，细节以 harness 为准。

> 英文入口：[AGENTS.md](./AGENTS.md)  
> Prompt 剧本：[docs/prompts.zh-CN.md](./docs/prompts.zh-CN.md)

## 命令

| 命令 | 用途 |
|------|------|
| `npm run dev` | 本地应用（Mock 后端） |
| `npm run verify` | 全量门禁：typecheck + lint + test + build |
| `npm run test` | 单元 / 组件测试 |
| `npm run typecheck` | `tsc -b --pretty false` |
| `npm run lint` | oxlint |

## 约定摘要

1. 业务模块放在 `src/modules/*`，必须复用 `ProTable`、`SchemaForm`、`Modal`、`useCrud`。
2. Mock 与 service 函数共用类型 — 字段名不得漂移。
3. 一次任务只做一块聚焦改动；结束前跑 `npm run verify`。
4. 未经明确要求，不要改公共组件公开 API 或全局请求客户端。

## 模块清单

- [ ] 列表 + 关键词 / 筛选 + 分页
- [ ] 新建 / 编辑走 SchemaForm 弹窗
- [ ] 删除（或归档）带确认
- [ ] 类型 + Mock 处理；逻辑非平凡时补测试
