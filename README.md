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

## 测试环境

测试模式使用 `.env.test`，API 沿用现有 UAT 地址 `https://api-uat.mtpay.com`。
如需覆盖测试 API，请在本地创建 `.env.test.local` 并设置 `VITE_API_BASE_URL`；该文件不会提交到 Git。

- `npm run dev:test`：启动测试模式开发服务。
- `npm run build:test`：类型检查并构建到 `dist-test`。
- `npm run preview:test`：预览已生成的测试产物，需先执行测试构建。

部署时上传 `dist-test` 的内容，服务器需将前端路由回退到 `index.html`，以支持直接打开详情链接。
VITE 环境变量会打包到浏览器，不应包含密钥。测试模式只隔离前端配置，数据环境由 API 地址决定。
测试构建输出到 `dist-test`，正式构建输出到 `dist`，两个目录独立，互不清理。
测试开发端口：9529；测试预览端口：9530。

正式环境使用 `.env.production`，API 为 `https://api.mtpay.com`，通过 `npm run build` 构建。
