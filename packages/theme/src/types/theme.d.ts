declare type Open17Image = string | { light?: string; dark?: string };

declare namespace Open17Theme {
  // 用户卡片配置
  interface UserCardConfig {
    hidden?: boolean;
    name?: string;
    avatar?: Open17Image;
    describe?: string;
  }

  interface WidgetConfig {
    name: string;
    html: string;
    link?: string;
  }
  // 博客全局配置
  interface BlogConfig {
    direct?: 'lft' | 'rgt';
    bgImage?: Open17Image;
    cover?: Open17Image;
    tagPageLink?: string;
    homePageLink?: string;
    archivePageLink?: string;
    widgets?: Array<Open17Theme.WidgetConfig>;
    pureMode?: boolean; // 隐藏左边栏
    user?: Open17Theme.UserCardConfig; // 用户卡片配置
    // 每页文章数量（优先级高于 home.postsPerPage）
    pageSize?: number;
    pageGroupSize?: number;
  }

  // 首页配置
  interface HomePageConfig {
    maxTagsDisplayed?: number; // 首页标签栏显示的最大标签数量
    postsPerPage?: number; // 每页的博客文章数量
  }

  // 评论配置
  type BooleanString = '0' | '1';
  interface CommentConfig {
    use?: boolean;
    repo: `${string}/${string}`;
    repoId: string;
    category?: string;
    categoryId?: string;
    mapping: 'url' | 'title' | 'og:title' | 'specific' | 'number' | 'pathname';
    strict?: BooleanString;
    reactionsEnabled?: BooleanString;
    emitMetadata?: BooleanString;
    inputPosition?: 'top' | 'bottom';
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
declare module 'vitepress-theme-open17/config' {
  import type { DefaultTheme } from 'vitepress';
  export interface ThemeConfig extends DefaultTheme.Config {
    blog?: Open17Theme.BlogConfig; // 博客配置
    comment?: Open17Theme.CommentConfig; // 评论配置
    home?: Open17Theme.HomePageConfig;
    feed?: Open17Theme.FeedConfig;
  }
}
