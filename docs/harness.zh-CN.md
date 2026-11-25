# Harness Engineering — Ops Console（中文）

Claude Code 与 Codex 的**单一事实源**。Agent 入口文件（`CLAUDE.md` / `AGENTS.md`）指向英文版 `docs/harness.md`；本文件为对照中文版，约定内容保持一致。

> 英文版：[harness.md](./harness.md)

## 技术栈

- React 19 + TypeScript（严格模式）+ Vite
- React Router 负责后台壳层路由
- Vitest + Testing Library 做单元 / 组件测试
- Mock 优先 API：通过 `apiRequest` 切换（`VITE_API_MODE=mock|http`）

## 目录规范

| 路径 | 用途 | Agent 可否修改？ |
|------|------|------------------|
| `src/components/` | 公共 UI（ProTable、SchemaForm、Modal、StatusBadge） | 仅当任务要求扩展公共 API 时 |
| `src/hooks/` | 公共 CRUD / 列表 Hook | 优先复用；扩展需谨慎 |
| `src/api/` | 领域服务 + Mock store + 传输层（`apiRequest`） | 可为接口改动；类型需共享 |
| `src/modules/<domain>/` | 业务页面（配置 + 薄胶水） | 可以 — 主要工作区 |
| `src/layouts/` | 布局壳子 | 除非改导航，否则避免动 |
| `docs/harness.md` | 英文规范正文 | 约定变更时同步更新中英两份 |
| `docs/prompts.zh-CN.md` | Agent Prompt 示例 | 迭代剧本变化时更新 |

## 复用原则（不可妥协）

1. **禁止**在业务模块页手写表格结构、表单字段或分页逻辑。
2. 列表用 `ProTable` + 列 / 筛选配置；表单用 `SchemaForm`，并放在 `Modal` 内。
3. 异步 CRUD 走 `useCrud`（或同一请求模式），不要复制 loading / 刷新 / toast 状态。
4. API 请求形态与 Mock 返回结构**共用同一套 TypeScript 类型**（`src/api` / 模块 `types.ts`）。
5. 禁止 `any`；状态 / 角色等用明确联合类型。

## 完成定义（Definition of Done）

任务完成前必须执行：

```bash
npm run verify
```

顺序跑通：typecheck → lint → test → build。CI 使用同一命令（`.github/workflows/verify.yml`）。

## Agent 任务粒度

优先做「单点闭环」：

1. 扩展公共组件 / Hook（如需要）
2. 实现或改动**一个**业务模块
3. 跑 `npm run verify`
4. 停下 — 不要顺手重构无关文件

可复制 Prompt 见 `docs/prompts.zh-CN.md`。

## Mock / HTTP 协作

- 默认：`VITE_API_MODE=mock`（见 `.env.example`）。领域服务把 Mock 逻辑作为 `mock` 工厂传给 `apiRequest`。
- 切真后端：设置 `VITE_API_MODE=http` 与 `VITE_API_BASE_URL`。传输在 `src/api/client.ts` 切换；**业务页面不用改**。
- 后端需遵守同一路径与类型（`/users`、`/projects`；列表查询：`page` / `pageSize` / `keyword` + 领域筛选）。
- 诚实边界：Mock 业务规则为了迭代速度仍写在 service 旁；HTTP 模式假定真实 API 履行同一契约。

## 未经明确要求禁止做的事

- 为了观感重写 ProTable / SchemaForm 的公开 props
- 再引入一套 UI 库或 CSS 框架
- 提交密钥或带凭证的 `.env`
- 超出当前任务范围扩 scope
