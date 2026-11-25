# Agent Prompt 示例（推荐迭代剧本）

按 Harness 闭环复制使用：一次只做一块，做完跑 `npm run verify`。

> 英文版：[prompts.md](./prompts.md)

## 0. 对齐上下文

```text
先阅读 docs/harness.zh-CN.md 与 CLAUDE.zh-CN.md（或 AGENTS.zh-CN.md）。
先不要改代码。用 5 条要点总结：目录边界、复用原则、完成定义（DoD）。
```

## 1. 沉淀公共 CRUD

```text
只实现/加固公共 CRUD 能力：
- ProTable（筛选、分页、空态/加载）
- SchemaForm + Modal
- useCrud
遵守 docs/harness.md。本轮不要做业务模块。
完成后执行 npm run verify，然后停下。
```

## 2. 第一个业务模块

```text
在 src/modules/users 落地成员模块，必须复用 ProTable + SchemaForm + useCrud + Mock API。
包含：列表 / 搜索筛选 / 分页，以及新建、编辑、删除。
禁止在模块里手写一套表格或表单。
完成后 npm run verify。本轮不要开始 projects 模块。
```

## 3. 第二个业务模块

```text
按 users 同一模式落地 projects 模块。
若发现公共抽象不好用，先改 components/hooks，再改模块。
只有约定变化时才更新 docs/harness.md（中英同步）。
完成后 npm run verify 并停下。
```

## 4. 契约 / 传输层微调

```text
业务页面不要动。只改 src/api/*，确保 Mock / HTTP 通过 VITE_API_MODE + apiRequest 切换。
为变更补测试，然后 npm run verify。
```
