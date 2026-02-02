# 快速开始

推荐使用主题提供的模板，也可以手动开始。

## :star: 一键启动（推荐）

```bash
# my-blog 替换为你的项目名
npm create open17-blog my-blog
```

## :star: GitHub 模板

使用 GitHub Template 一键初始化：
https://github.com/open17/vitepress-theme-open17/generate

## :hammer_and_wrench: 手动开始

先初始化 VitePress 项目，然后安装主题：

:::code-group
```shell [yarn]
yarn add -D vitepress-theme-open17
```
```shell [npm]
npm i vitepress-theme-open17 -D
```
```shell [pnpm]
pnpm add -D vitepress-theme-open17
```
:::

在主题入口中启用主题与 UnoCSS：

```js
// .vitepress/theme/index.js
import Theme from 'vitepress-theme-open17'
import 'virtual:uno.css'
export default Theme
```

在配置中启用 UnoCSS 插件：

```ts
// .vitepress/config.ts
import type { ThemeConfig } from 'vitepress-theme-open17/config'
import { defineConfigWithTheme } from 'vitepress'
import UnoCSS from 'unocss/vite'

export default defineConfigWithTheme<ThemeConfig>({
  vite: {
    plugins: [UnoCSS()],
  },
  themeConfig: {
    // 你的主题配置
  }
})
```

安装依赖并启动：

```bash
npm i
npm run dev
```
