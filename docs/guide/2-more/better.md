# 功能增强

这里是一些常用的博客功能增强需求配置/使用方法,其中有部分在本主题已经集成完毕,有部分则没有

没有的原因大抵如下几点:

- 相关功能配置已经足够简单便捷,无需再套入主题中
- 相关功能可能有一定 bug
- 相关功能过于笨重,引入增加负担
- 默认主题已经实现

## 基本配置

推荐使用类型安全方式配置：

```ts
// .vitepress/config.ts
import type { ThemeConfig } from '@velonor/theme/config'
import { defineConfigWithTheme } from 'vitepress'

export default defineConfigWithTheme<ThemeConfig>({
  themeConfig: {
    // ...你的配置
  }
})
```

详见[默认配置](/guide/1-config/3-default.html)

## 背景图片设置

通过全局或单页 frontmatter 设置 bgImage：

```md
---
bgImage: '/bg.jpg'
# 或
bgImage:
  light: '/bg.jpg'
  dark: '/bg_dark.jpg'
---
```

详见[背景图片配置](/guide/1-config/1-ornateStyle.html)

## Markdown 引入

很多时候比如我们希望 README 和博客的某篇内容是完全同步的,但是我们不想每次修改一边还需要再修改另一边,我们可以直接引入对应的 markdown 文件,会直接渲染成页面

使用参考[这里](https://vitepress.dev/guide/markdown#markdown-file-inclusion)

比如本博客的更新公告就是引入 CHANGELOG 的

```md
---
tags:
  - theme
  - 更新
title: 更新公告
pin: true
---

这里是博客的更新公告

---

:::info
内容同步自[CHANGELOG](https://github.com/open17/@velonor/theme/blob/template/CHANGELOG.md)

最新同步时间: {{ Date()}}

:::

<!--@include: @/../CHANGELOG.md -->
```

## RSS 配置

本主题支持 RSS, 配置如下, 会在 build 的时候生成路径为 `baseUrl + feed.rss`

详见[RSS](/guide/1-config/4-rss)

## Sitemap

vitepress 本身即支持 sitemap，只需要在 config.ts 中配置站点域名即可,例如:
```ts
import { defineConfigWithTheme } from 'vitepress'
export default defineConfigWithTheme({
  sitemap: {
    hostname: 'https://www.open17.vip'
  }
})
```

## 数学公式支持

vitepress 本身支持 mathjax，只需要在 config.ts 中配置即可，例如:
```ts
import { defineConfigWithTheme } from 'vitepress'
export default defineConfigWithTheme({
  markdown: {
    math: true
  }
})
```

## 自定义容器

详见 VitePress 官方文档。

## 导入代码片段

详见[import-code-snippets](https://vitepress.dev/guide/markdown#import-code-snippets)

## 置顶博客文章

在对应 md 文件中的 frontmatter 设置 `pin: true` 即可置顶博客

## 自定义首页组件

详见[这里](/guide/1-config/0-home.html#自定义组件栏)

## 自动侧边栏

已有封装好的 vite 插件 [vite-plugin-vitepress-auto-sidebar](https://github.com/QC2168/vite-plugin-vitepress-auto-sidebar)

个人相关配置如下:

```js
vite: {
  plugins: [
    AutoSidebar({
      ignoreList: ['page', 'posts', 'public'],
      titleFromFile: true,
      beforeCreateSideBarItems: (data) => {
        const indexIndex = data.indexOf('index.md')
        if (indexIndex !== -1) {
          const indexValue = data[indexIndex]
          data.splice(indexIndex, 1)
          data.unshift(indexValue)
        }
        return data
      }
    })
  ]
}
```

## 幻灯片

可以参考这篇博客:

- [在 vitepress 中使用幻灯片](https://www.open17.vip/posts/project/2024-10-15-vitepress-reveal.html)


