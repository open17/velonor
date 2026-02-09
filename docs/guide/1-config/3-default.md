# 默认配置

主题不再提供可直接继承的 baseConfig。

推荐使用类型安全的方式来编写你的配置：

```ts
// .vitepress/config.ts
import type { ThemeConfig } from '@velonor/theme/config'
import { defineConfigWithTheme } from 'vitepress'

export default defineConfigWithTheme<ThemeConfig>({
  // 站点基础信息
  title: 'Vitepress Open17',
  description: 'A VitePress Site',

  // 主题配置
  themeConfig: {
    search: { provider: 'local' },
    footer: {
      message:
        'Released under the <a href="https://github.com/open17/@velonor/theme/blob/template/LICENSE">Apache 2.0 License</a>.',
      copyright:
        'Copyright © 2023-present <a href="https://github.com/open17">open17</a>',
    },

    // 博客配置
    blog: {
      // 侧边栏方向，左侧或右侧
      direct: 'rgt', // 'lft' | 'rgt'
      // 隐藏左侧边栏（纯模式）
      pureMode: false,
      // 首页左侧栏显示的用户信息
      user: {
        name: 'Open17',
        avatar: '/ava.jpg',
        describe: 'A beautiful & simple blog theme of vitepress',
      },
      // 每页文章数量（优先级高于 home.postsPerPage）
      pageSize: 5,
      // 标签页链接（用于“更多标签”跳转）
      tagPageLink: '/page/tags',
    },

    // 首页配置
    home: {
      // 首页标签栏显示的最大标签数量
      maxTagsDisplayed: 20,
      // 每页的博客文章数量（当 blog.pageSize 未设置时生效）
      postsPerPage: 5,
    },

    // 评论与 RSS 等请参考对应小节
  },
})
```

说明：
- 用户信息移动到 blog.user 中，包括 name、avatar、describe。
- 标签显示数量使用 home.maxTagsDisplayed；“更多”链接使用 blog.tagPageLink。
- 文章分页优先使用 blog.pageSize，未设置时回退到 home.postsPerPage。
- 分类功能：默认按 posts 文件夹的一级目录作为分类；根目录下的文章归类为“其他”。
- 多语言：分页和标签/分类等 UI 文案支持中英文切换，跟随站点语言。
- 预留配置：homePageLink、archivePageLink 已在类型中定义，但当前版本未使用。

