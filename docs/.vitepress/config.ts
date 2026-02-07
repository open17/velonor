import type { ThemeConfig } from "vitepress-theme-open17/config";
import { genFeed } from "vitepress-theme-open17/genFeed";
import { defineConfigWithTheme } from "vitepress";
import UnoCSS from "unocss/vite";
import { fileURLToPath, URL } from "node:url";

import { generateSidebar } from "vitepress-sidebar";

const vitepressSidebarOptions = [
  {
    documentRootPath: "docs",
    scanStartPath: "guide",
    resolvePath: "/guide/",
    collapsed: true,
    useTitleFromFileHeading: true,
    useFolderTitleFromIndexFile: true,
    useFolderLinkFromIndexFile: true,
    rootGroupCollapsed: true,
  },
  {
    documentRootPath: "docs",
    scanStartPath: "posts/engine",
    resolvePath: "/posts/engine/",
    collapsed: true,
    useTitleFromFileHeading: true,
    useFolderTitleFromIndexFile: true,
    useFolderLinkFromIndexFile: true,
    rootGroupCollapsed: true,
  },
];

export default defineConfigWithTheme<ThemeConfig>({
  title: "Velonor",
  lang: "zh-CN",
  description: "为 VitePress 注入全新的博客体验 | 简洁 · 优雅 · 强大",
  markdown: {
    math: true,
  },
  vite: {
    plugins: [UnoCSS()],
    ssr: {
      noExternal: ['vitepress-velonor', 'vitepress-theme-open17'],
    },
    // resolve: {
    //   alias: {
    //     "vitepress-theme-open17": fileURLToPath(
    //       new URL("../../packages/theme/src/index.ts", import.meta.url)
    //     ),
    //     "vitepress-theme-open17/genFeed": fileURLToPath(
    //       new URL("../../packages/theme/src/genFeed.mjs", import.meta.url)
    //     ),
    //   },
    // },
  },
  sitemap: {
    hostname: "https://vitepress.open17.vip",
  },
  head: [
    ["link", { rel: "icon", href: "/logo.png" }],
    [
      "script",
      {},
      `
      var _hmt = _hmt || [];
      (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?0a05ed98f94a5486639ae0f97c7b6fff";
        var s = document.getElementsByTagName("script")[0]; 
        s.parentNode.insertBefore(hm, s);
      })();
    `,
    ],
    ["meta", { name: "keywords", content: "vitepress, theme, blog, open17, velonor, 博客, 主题" }],
  ],
  themeConfig: {
    sidebar: generateSidebar(vitepressSidebarOptions),
    search: {
      provider: "local",
      options: {
        _render(src, env, md) {
          const html = md.render(src, env);
          if (env.frontmatter?.title)
            return md.render(`# ${env.frontmatter.title}`) + html;
          return html;
        },
      },
    },
    editLink: {
      pattern:
        "https://github.com/open17/vitepress-theme-open17/edit/master/docs/:path",
      text: "帮我优化文章~"
    },
    feed: {
      baseUrl: "https://vitepress.open17.vip",
      copyright: "Copyright © 2023-present open17",
      image: "https://cdn.jsdelivr.net/gh/open17/Pic/img/202405071726176.png",
    },
    blog: {
      tagPageLink: "/page/tags",
      bgImage: { dark: "/bg_dark.jpg", light: "/bg.jpg" },
      direct: "lft",
      pageSize: 3,
      user: {
        name: "Open17",
        avatar: "/ava.jpg",
        describe: "A beautiful & simple blog theme of vitepress",
      },
    },
    home: {
      maxTagsDisplayed: 20,
      postsPerPage: 5,
    },
    logo: {
      dark: "/logo.png",
      light: "/logo_light.png",
    },
    lastUpdated: {
      text: "Updated at",
      formatOptions: {
        dateStyle: "full",
        timeStyle: "medium",
      },
    },
    nav: [
      { text: "Home", link: "/" },
      { text: "Guide", link: "/guide/0-intro/" },
      {
        text: "Demo",
        items: [
          { text: "Blog", link: "/page/blog" },
          { text: "Tags", link: "/page/tags" },
          { text: "Archive", link: "/page/archive" },
          { text: "Categories", link: "/page/categories" },
        ],
      },
    ],
    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/open17/vitepress-theme-open17/",
      },
    ],
  },
  buildEnd: genFeed,
});
