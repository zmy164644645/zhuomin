# 架构说明 · USY 项目制教学桌面工作平台

> 一句话：Electron 外壳 + React 渲染层，全部业务数据在渲染进程内用 `useReducer` 管理，`localStorage` 持久化，UI 由 antd 6 统一主题渲染。

---

## 1. 技术栈

| 层次 | 选型 | 说明 |
|---|---|---|
| 桌面运行时 | Electron 44 | 主进程只负责开窗，不承载业务 |
| 构建 | electron-vite 6 | 一套配置同时构建 main / preload / renderer |
| 界面 | React 19 | 函数组件 + Hooks，无类组件 |
| 组件库 | antd 6 + @ant-design/icons | 通过 `ConfigProvider` 注入浅色主题 token |
| 状态 | React Context + useReducer | 无 Redux / Zustand 等第三方状态库 |
| 持久化 | localStorage | 带 schema 版本号与脏数据清洗 |
| 打包 | electron-builder | win / mac / linux 三套脚本 |

---

## 2. 目录结构

```
zhuomianyingyong/
├── electron.vite.config.mjs      # 三端构建配置（main/preload/renderer）
├── electron-builder.yml          # 打包配置
├── resources/icon.png            # 应用图标
└── src/
    ├── main/index.js             # 主进程：创建 BrowserWindow、外链拦截
    ├── preload/index.js          # 预加载：contextBridge 暴露 electron API
    └── renderer/
        ├── index.html            # 渲染层 HTML 入口
        └── src/
            ├── main.jsx          # React 挂载点 + antd 主题 + Provider
            ├── App.jsx           # 布局骨架 + 页面注册表
            │
            ├── app/
            │   └── navigation.jsx        # 侧边栏菜单配置（唯一数据源）
            │
            ├── components/
            │   └── Sidebar.jsx           # 全局壳组件：侧边栏
            │
            ├── features/                 # ★ 按业务功能分包
            │   ├── dashboard/
            │   │   ├── DashboardPage.jsx         # 容器：取数 + 组装
            │   │   └── components/               # 只接收 props 的展示组件
            │   │       ├── StatCard.jsx
            │   │       ├── ProjectProgressList.jsx
            │   │       └── TodoList.jsx
            │   ├── projects/
            │   │   ├── ProjectsPage.jsx
            │   │   └── components/
            │   │       ├── ProjectCard.jsx
            │   │       ├── ProjectCreateModal.jsx
            │   │       └── ProjectDetailDrawer.jsx
            │   └── tasks/
            │       ├── TasksPage.jsx
            │       └── components/
            │           ├── ProjectSwitcher.jsx
            │           ├── TaskComposer.jsx
            │           ├── TaskList.jsx
            │           └── TaskProgressPanel.jsx
            │
            ├── hooks/
            │   └── useProjects.js        # 7 个业务 Hook（数据 + 动作 + 派生）
            │
            ├── store/                    # ★ 唯一状态源
            │   ├── contexts.js           # 两个 Context（state / actions 分离）
            │   ├── ProjectsProvider.jsx  # useReducer + 持久化副作用 + 动作集合
            │   ├── projectsReducer.js    # 纯函数 reducer + 状态形状定义
            │   ├── selectors.js          # 派生数据（统计/筛选/排序），不持状态
            │   ├── factories.js          # 实体工厂：生成 id、补默认字段
            │   ├── persistence.js        # localStorage 读写 + 版本迁移 + 脏数据清洗
            │   └── seedProjects.js       # 首次启动的示例数据
            │
            ├── shared/                   # 跨功能复用的纯工具
            │   ├── date.js               # 问候语、今日文案、逾期判断
            │   └── constants/taskPriority.js
            │
            ├── styles/                   # ★ 样式分层（原 App.css 拆分）
            │   ├── index.css             # 唯一样式入口，按原顺序 @import
            │   ├── base.css              # 设计变量 + 全局重置
            │   ├── layout.css            # 应用骨架：侧边栏/顶栏/内容区
            │   ├── components.css        # antd 组件全局覆盖
            │   ├── common.css            # 页头等页面通用元素
            │   ├── dashboard.css         # 工作台
            │   ├── projects.css          # 项目页
            │   └── tasks.css             # 任务页
            │
            └── assets/                   # 图片资源
```

---

## 3. 五层结构

```
① 壳层     main 进程 ── preload ── renderer
② 布局层   App.jsx（页面注册表 + 当前页 state）
③ 容器层   features/*/Page.jsx        ← 取数、筛选、事件分发
④ 展示层   features/*/components/*    ← 只吃 props，不发请求、不读 context
⑤ 状态层   hooks → store（reducer / selectors / persistence）
```

**核心约束：数据从上面第 ⑤ 层往下流，事件从第 ③ 层往上冒。** 展示组件不直接 `useContext`，页面组件不在 JSX 里写 `filter/sort` 逻辑。

---

## 4. 一次数据写入的完整链路

以「任务页勾选一个任务」为例：

```
TaskList（点击 checkbox）
   → props.onToggle(taskId)               展示层只抛事件
   → TasksPage 调用 toggleTask(projectId, taskId)
   → useProjectActions()                  从 ActionsContext 取动作
   → dispatch({ type: 'task/toggle' })    动作集合内派发
   → projectsReducer                      纯函数算出新 state
   → ProjectsStateContext 更新
   → useProjects() / useTaskStats() 重新计算
   → 页面与统计面板重渲染
   → useEffect → saveProjects()           写回 localStorage
```

关键点：**reducer 不认识 localStorage，也不生成 id。** 时间戳、随机 id 这些"不确定性"都在 `factories.js` 里，reducer 保持同输入必得同输出，便于测试。

---

## 5. 状态形状

```js
{
  projects: [
    {
      id, name, course, description, createdAt, folderPath,
      tasks: [{ id, title, completed, priority, dueDate }]
    }
  ]
}
```

包一层对象（而非直接放数组）是为了以后加 `selectedProjectId`、`filter`、`sort` 等全局 UI 状态时，不用改动所有消费者。

---

## 6. 五条设计约定（改代码前先看这个）

1. **Context 单独放 `contexts.js`** —— 组件文件只导出组件，Fast Refresh 热更新不会整页刷新；hooks 与 Provider 都从这里取，避免循环依赖。
2. **state 与 actions 拆成两个 Context** —— 只调用动作、不读数据的组件（如各种按钮、表单）不会因为任务勾选而重渲染。
3. **actions 用 `useMemo(..., [])` 只创建一次** —— 依赖的 `dispatch` 引用恒定，因此动作引用永久稳定。
4. **派生数据一律走 `selectors.js`** —— 工作台、项目页、任务页的"完成率""逾期数"永远同一口径，不各算一遍。
5. **页面级 UI 状态留在页面组件里** —— 关键词、当前选中项目、弹窗开关用 `useState`，只有跨页面共享的业务数据才进 store。

---

## 7. 当前的已知问题与优化建议

按投入产出比排序：

| # | 问题 | 影响 | 建议 |
|---|---|---|---|
| 1 | ~~`App.css` 单文件 856 行~~ **已完成** | 已拆为 7 个文件，规则与层叠顺序零改动 | 改样式只需动对应那一个文件 |
| 2 | 根目录残留 `.arch-backup/`、`.style-backup/` | 历史快照混在源码里，容易被误改 | 移出项目目录，或加进 `.gitignore` |
| 3 | `folderPath` 是占位字符串"待关联本地文件夹" | 一个未完成的功能，界面上可能让用户困惑 | 要么实现"选择文件夹"（走 IPC + dialog），要么先隐藏该字段 |
| 4 | 持久化用 localStorage | 换机器/重装即丢；容量约 5MB | 改为主进程写 `app.getPath('userData')/data.json`，preload 里的 `api` 对象正是预留位 |
| 5 | `preload/index.js` 的 `api = {}` 为空；`main` 里还有模板残留的 `ipcMain.on('ping')` | 说明 IPC 通道尚未建立 | 接第 4 条时一并补上 `invoke/handle` |
| 6 | 无 TypeScript、无测试 | 项目变大后重构成本上升 | 可先给 `store/` 加 JSDoc 类型，reducer 优先补单测 |

---

## 8. 扩展指南

**加一个页面（3 步）**
1. 建 `features/xxx/XxxPage.jsx`
2. `app/navigation.jsx` 的 `NAV_ITEMS` 加一条菜单项（`key` 即页面标识）
3. `App.jsx` 的 `PAGES` 注册表加一条映射

菜单和页面通过 `key` 解耦，不需要改 `Sidebar.jsx`。

**给任务加字段（3 步）**
1. `factories.js` 的 `createTask` 补默认值
2. `persistence.js` 的 `normalizeTask` 补兜底（老存档不会崩）
3. `SCHEMA_VERSION` 视情况 +1

**改主题**
只动 `main.jsx` 里的 `lightConfig`，不要在 `styles/components.css` 里用 `!important` 覆盖 antd。

**加样式（拆分层后）**
- 页面私有样式 → 加到对应 `styles/<页面>.css`，类名沿用现有前缀（`.dashboard-*` / `.project-*` / `.task-*`）
- 新的页面 → 在 `styles/` 新建一个文件，放进 `index.css` 的 `@import` 末尾
- `index.css` 的导入顺序 = 层叠顺序，**不要随意调整**；`base` 必须在最前，页面样式在最后

---

*本文档基于当前代码（src 共约 2700 行）整理，最后更新：2026-11-12*
