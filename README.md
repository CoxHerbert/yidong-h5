# 移动权益随心选 H5

一个基于 Vue 3 + Vite 构建的移动端活动页项目，整合了 Pinia 状态管理、Vite 路由分发、Vant 4 组件库与 Axios 网络层，提供多省份权益申办流程与验证码校验体验。

## 技术栈

- **Vue 3** + `<script setup>` 语法构建页面组件
- **Vite 7** 作为构建与开发服务器
- **Vue Router 4** 管理多业务落地页路由
- **Pinia 3** 处理全局轻量状态
- **Vant 4** 移动端组件库（替换原有 Element Plus）
- **Axios** 封装统一的 HTTP 请求能力
- **Lodash** 辅助工具（节流等）

## 目录结构

```
├─ public/                # 静态资源
├─ src/
│  ├─ api/                # 后端接口定义（如 bizHandle 业务）
│  ├─ assets/             # 静态图片、样式资源
│  ├─ components/         # 复用组件（确认订单弹窗、协议弹窗等）
│  ├─ router/             # 路由配置
│  ├─ stores/             # Pinia store（若有全局状态）
│  ├─ utils/              # 工具函数与请求封装
│  ├─ views/              # 各省份/业务页面
│  └─ main.js             # 应用入口，注册 Vant、路由、Pinia
├─ vite.config.js         # Vite 配置与本地代理
└─ package.json           # 项目依赖与脚本
```

## 架构概览

- **路由层**：`src/router` 下的路由配置将路径映射到不同业务页面（如甘肃、广东、湖北等），方便按地区分发活动内容。
- **视图层**：`src/views` 中每个页面负责对应地区的权益申办 UI，统一调用封装后的 API 和验证逻辑，复用公共组件（协议弹窗、确认订单弹窗）。
- **组件层**：`src/components` 提供业务复用组件，例如 `confirm-order.vue` 负责验证码校验与下单确认逻辑，`agree-dialog.vue`、`personal-information.vue` 等负责协议展示。
- **状态层**：项目集成 Pinia，便于后续扩展全局状态（当前页面主要以局部状态为主）。
- **网络层**：通过 `src/utils/request.js` 创建 Axios 实例，集中处理 Base URL、超时配置与响应转换，再在 `src/api` 中按业务模块定义函数，供各页面直接调用。

## 请求体系

1. **统一实例**：`src/utils/request.js` 基于环境变量拼接不同环境的 `baseURL`，并在响应拦截器中返回 `response.data`，统一错误处理入口。
2. **业务 API**：`src/api/bizHandle.js` 暴露 `getProduct`、`sendVerifyCode`、`confirmBook` 等方法。所有页面通过这些方法触发网络请求，避免各处手写 URL。
3. **调用方式**：视图组件调用 API 前使用 `src/utils/rule.js` 的手机号校验，配合 Vant 的 `showToast`/`showFailToast` 反馈用户操作。

## Vite 配置要点

- 通过 `vite.config.js` 的 `server.proxy` 字段，将 `/api`、`/dev-api` 代理到不同环境后端，开发阶段无需手动切换接口地址。
- 使用 `createHtmlPlugin` 将环境变量注入到入口 HTML，便于在模板中引用后端地址。
- `resolve.alias` 配置 `@` 指向 `src`，简化模块导入路径。

## 开发与构建

```bash
npm install
npm run dev
npm run build
npm run preview
```

> 开发模式下运行 `npm run dev`，Vite 将根据 `VITE_APP_API_BASE_URL` 自动代理接口。

