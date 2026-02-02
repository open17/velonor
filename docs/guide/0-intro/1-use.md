# 博客使用

## :bookmark_tabs: 创建博客文章

在 `docs/posts` 目录下创建 Markdown 文件，都会被视为博客文章。

目录示例：

```
docs
  .vitepress
    config.ts
  posts
    my-blog-0.md
    my-blog-1.md
  index.md
```

## :book: 文章 Frontmatter

常用字段：

- `title` 文章标题
- `date` 发布时间（默认 1900-01-01）
- `tags` 标签（数组）
- `categories` 仅作展示（可选，不参与分类统计）
- `pin` 是否置顶（默认 false）
- `desc` 摘要（为空时取正文分隔前内容）
- `cover` 封面图

示例：

```md
---
title: 我的第一篇博客
date: 2024-03-23
tags:
  - hello
  - vitepress
categories:
  - Notes
pin: true
desc: 一段简短摘要
cover: /cover.png
---
```

## :house: 博客首页

任意页面设置 `layout: blog` 就是博客首页：

```md
---
layout: blog
---
```

推荐将 `docs/index.md` 作为博客首页。

## :bookmark: 标签 / 分类 / 归档页

```md
--- 
layout: tags
---
```

```md
---
layout: categories
---
```

```md
---
layout: archive
---
```

## :file_folder: 分类规则（重要）

分类**不依赖** `frontmatter.categories`。  
分类取决于文章在 `docs/posts` 下的**子文件夹名**：

```
docs/posts
  notes/        <- 分类: notes
    a.md
  diary/        <- 分类: diary
    b.md
  c.md          <- 根目录文章，会归入 “其他/uncategorized”
```

因此：  
- 想让文章进入某个分类，请把文件放进对应子文件夹  
- 直接放在 `docs/posts` 根目录的文章会归入默认分类

## :sparkles: UnoCSS 必须启用

主题样式基于 UnoCSS，请确保：

1) 在主题入口引入 `virtual:uno.css`  
2) 在 `vite` 配置中启用 `UnoCSS()` 插件

详细配置见“快速开始”。
