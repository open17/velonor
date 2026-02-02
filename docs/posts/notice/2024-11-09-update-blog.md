---
title: 博客主题v1.2->v1.3迁移指南
date: 2025-08-11
tags:
  - 版本更新
  - 配置
  - 指南
---

<del>目前还处于`v1.3.0-beta.1`测试阶段, 可能与最终 1.3 版本略有区别</del>  

目前`v1.3.5`已发布,建议升级到最新版本稳定运行

---

## 主题配置

默认配置`baseConfig`模块已移除,不再可以使用(目前为止是这样的)

为最大化利用 TS 类型提示,推荐把`config.mjs`转为`config.ts`

现在所有配置中 img 类型如下:

```ts
declare type Open17Image = string | { light?: string; dark?: string };
```

现配置框架推荐如下

:::code-group

```ts [新配置]
import type { ThemeConfig } from "vitepress-theme-open17/config";
import { defineConfigWithTheme } from "vitepress";
export default defineConfigWithTheme<ThemeConfig>({
  // ...
});
```

```ts [对比原先]
import type { ThemeConfig } from "vitepress-theme-open17/config"; // [!code ++]
import baseConfig from 'vitepress-theme-open17/config' // [!code --]
import { defineConfigWithTheme } from "vitepress"; // [!code ++]
import { defineConfig } from 'vitepress' // [!code --]
export default
defineConfigWithTheme<ThemeConfig>({ // [!code ++]
defineConfig({ // [!code --]
    extends: baseConfig, // [!code --]
    // ...
})
```

:::

然后主题配置略有更改,下面是一个本 demo 的配置修改示例

不清楚的地方可以参考配置类型声明

:::code-group

```ts [示例]
themeConfig: {
    blog: {
      avatar: "/ava.jpg", // [!code --]
      ornateStyle: true, // [!code --]
      maxTags: 5, // [!code --]
      pageSize: 5,  // [!code --]
      tagPageLink: '/page/tags',
      user: {   // [!code ++]
        name: "Open17", // [!code ++]
        avatar: "/ava.jpg", // [!code ++]
      },    // [!code ++]
    },
    home: { // [!code ++]
      maxTagsDisplayed: 20, // [!code ++]
      postsPerPage: 5,  // [!code ++]
    },  // [!code ++]
    comment: {
      use: true,
      repo: "open17/vitepress-theme-open17",
      repo_id: "R_kgDOLkFVUg", // [!code --]
      repoId: "R_kgDOLkFVUg", // [!code ++]
      category: "Announcements",
      category_id: "DIC_kwDOLkFVUs4ChFZx",  // [!code --]
      categoryId: "DIC_kwDOLkFVUs4ChFZx",  // [!code ++]
      mapping: "pathname",
      strict: "0",
      reactions_enabled: "1",   // [!code --]
      reactionsEnabled: "1",   // [!code ++]
      emit_metadata: "0",      // [!code --]
      emitMetadata: "0",       // [!code ++]
      input_position: "top",    // [!code --]
      inputPosition: "top",    // [!code ++]
      lang:"en"
    },
},
```

```ts [配置类型声明]
declare type Open17Image = string | { light?: string; dark?: string };

declare namespace Open17Theme {
  // 用户卡片配置
  interface UserCardConfig {
    hidden?: boolean;
    name?: string;
    avatar?: CustomImage;
    describe?: string;
  }

  interface WidgetConfig {
    name: string;
    html: string;
    link?: string;
  }
  // 博客全局配置
  interface BlogConfig {
    direct?: "lft" | "rgt";
    bgImage?: Open17Image;
    cover?: Open17Image;
    tagPageLink?: string;
    homePageLink?: string;
    archivePageLink?: string;
    widgets?: Array<Open17Theme.WidgetConfig>;
    pureMode?: boolean; // 隐藏左边栏
    user?: Open17Theme.UserCardConfig; // 用户卡片配置
  }

  // 首页配置
  interface HomePageConfig {
    maxTagsDisplayed?: number; // 首页标签栏显示的最大标签数量
    postsPerPage?: number; // 每页的博客文章数量
  }

  // 评论配置
  type BooleanString = "0" | "1";
  interface CommentConfig {
    use?: boolean;
    repo: `${string}/${string}`;
    repoId: string;
    category?: string;
    categoryId?: string;
    mapping: "url" | "title" | "og:title" | "specific" | "number" | "pathname";
    strict?: BooleanString;
    reactionsEnabled?: BooleanString;
    emitMetadata?: BooleanString;
    inputPosition?: "top" | "bottom";
    lang?: string;
  }

  // RSS配置
  interface FeedConfig {
    baseUrl: string; // 你的部署的域名,必须
    copyright?: string; //版权声明,可选
    image?: string; // RSS图片,可选
    favicon?: string; //RSS图标,可选
  }
}

// 主配置接口 ThemeConfig
declare module "vitepress-theme-open17/config" {
  import type { DefaultTheme } from "vitepress";
  export interface ThemeConfig extends DefaultTheme.Config {
    blog?: Open17Theme.BlogConfig; // 博客配置
    comment?: Open17Theme.CommentConfig; // 评论配置
    home?: Open17Theme.HomePageConfig;
    feed?: Open17Theme.FeedConfig;
  }
}
```

:::
