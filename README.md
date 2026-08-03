# MTPay Frontend

MTPay 企业级后台前端工程骨架。

## 子项目

- `mtpay-agent-web`：代理端后台前端项目，基于 Vue 3 + TypeScript + Vite。

当前仓库先初始化代理端项目，后续如需新增商户端、运营端等子项目，建议继续按同级目录拆分，保持独立依赖、独立路由和独立发布流水线。

## 技术栈

- Vue 3
- TypeScript
- Vite
- Vue Router
- Pinia
- Element Plus
- Axios
- SCSS
- ESLint
- Prettier

## 启动方式

```bash
cd mtpay-agent-web
npm install
npm run dev
```

## 构建与检查

```bash
cd mtpay-agent-web
npm run type-check
npm run lint
npm run format
npm run build
```

## 项目结构

```text
mtpay-agent-web/
  src/
    api/                 接口模块占位
    assets/              静态资源
    components/          通用组件和业务组件
    config/              应用配置
    constants/           常量
    directives/          自定义指令
    hooks/               组合式 hooks
    layout/              后台统一布局
    router/              路由、模块和守卫
    services/fake/       前期假数据目录预留
    stores/              Pinia 状态
    styles/              全局样式、断点、Element Plus 覆盖
    types/               全局类型
    utils/               请求、存储等工具
    views/               页面占位
```

## 后续业务开发建议

- 按业务域拆分 `api`、`views` 和 `stores/modules`，避免跨模块共享过多内部状态。
- 路由统一维护 `meta.title`、`meta.icon`、`meta.requiresAuth`、`meta.hidden`、`meta.keepAlive`，菜单由路由生成。
- 请求层统一在 `src/utils/request.ts` 处理 token、401 和错误提示，页面层只关心业务结果。
- 响应式适配优先使用 `src/styles/breakpoints.scss` 中的断点变量，避免各页面散落魔法数字。
