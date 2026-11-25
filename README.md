# Ops Console — SaaS 后台 + Harness Engineering

轻量运营后台示例：团队成员 + 项目管理。重点不在页面花哨，而在 **AI Agent 可复用的工程约束**（Harness）、公共 CRUD 抽象，以及可一键验证的交付闭环。

## 快速开始

```bash
npm install
npm run dev
```

浏览器打开终端提示的本地地址即可。后端默认走 **Mock**（内存数据 + 延迟），无需额外服务。

### Windows PowerShell 注意

若出现 `npm.ps1 cannot be loaded because running scripts is disabled`：

```powershell
# 临时绕过
cmd /c "npm run dev"

# 或当前用户放开脚本策略
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

## 一键自检（Definition of Done）

```bash
npm run verify
```

顺序执行：`typecheck` → `lint` → `test` → `build`。本地与 CI（`.github/workflows/verify.yml`）使用同一门禁。

| 命令 | 说明 |
|------|------|
| `npm run dev` | 本地开发（默认 Mock API） |
| `npm run typecheck` | TypeScript 项目引用检查 |
| `npm run lint` | oxlint |
| `npm run test` | Vitest |
| `npm run build` | 生产构建 |

## 面试官导读 / 设计取舍

**这题想证明什么**

1. 给 Claude Code / Codex 配齐规则、边界与可执行校验，而不是让 AI 自由发挥。
2. 两个 CRUD 模块靠同一套表格 / 表单 / Hook，而不是复制粘贴。
3. Mock 能秒级联调；切 HTTP 时业务页不动。

**刻意做了什么**

- 单一事实源 `docs/harness.md` + 双入口 `CLAUDE.md` / `AGENTS.md`（含中文对照）
- 配置驱动：`ProTable` / `SchemaForm` / `useCrud`
- `apiRequest`：`VITE_API_MODE=mock|http` 切换传输
- `npm run verify` + GitHub Actions 同构门禁
- `docs/prompts*.md`：可复制的 Agent 迭代剧本

**刻意没做什么**

- 不上 Ant Design / 复杂权限模型 / 第三业务模块（避免堆量冲淡 Harness）
- 不把 Mock 规则伪装成「只改一行 client 就有完整后端」——HTTP 模式要求真实 API 履行同一契约
- UI 保持后台可用即可，不为视觉复杂度加分项

## 业务模块

1. **团队成员**（`/users`）：搜索 / 角色筛选 / 状态筛选、新建、编辑、删除
2. **项目管理**（`/projects`）：搜索 / 环境筛选 / 状态筛选、新建、编辑、删除

两个模块共用：`ProTable`、`SchemaForm` + `Modal`、`useCrud`、`StatusBadge`。业务页主要是字段配置 + 少量列渲染。

## 目录结构

```text
src/
├── api/                 # 领域服务 + apiRequest 传输 + Mock store
├── components/          # ProTable / SchemaForm / Modal / StatusBadge
├── hooks/useCrud.ts     # 通用 CRUD 状态机
├── layouts/             # 侧栏 + 顶栏壳子
├── modules/
│   ├── users/
│   └── projects/
├── types/
└── utils/
```

## Harness（兼容 Claude Code & Codex）

| 文件 | 作用 |
|------|------|
| `docs/harness.md` / `docs/harness.zh-CN.md` | 单一事实源：目录边界、复用原则、DoD |
| `docs/prompts.md` / `docs/prompts.zh-CN.md` | Agent 分阶段 Prompt 示例 |
| `CLAUDE.md` / `CLAUDE.zh-CN.md` | Claude Code 入口 |
| `AGENTS.md` / `AGENTS.zh-CN.md` | Codex / 通用 Agent 入口 |
| `npm run verify` + CI | 机器可执行质量门禁 |

Agent 默认读英文入口；人工评审可看中文版。约定变更时请中英同步。

## Mock 与前后端协作

```bash
# 默认
VITE_API_MODE=mock

# 切真实后端（业务页面不用改）
VITE_API_MODE=http
VITE_API_BASE_URL=http://localhost:3000/api
```

参考 `.env.example`。列表契约统一：`page` / `pageSize` / `keyword` + 领域筛选；路径为 `/users`、`/projects`。

## 给 Agent 的推荐迭代顺序

1. 读 harness（可用 `docs/prompts.zh-CN.md` 第 0 步）
2. 公共组件 / hook → `npm run verify`
3. 模块 A → verify；模块 B → verify
4. 小步提交，避免一次改穿多个边界

## 技术栈

React 19 · TypeScript · Vite · React Router · Vitest · Testing Library · oxlint
