---
title: VitePress-Velonor 构建期 Loader
date: 2026-02-02
tags:
  - 引擎
  - Loader
---

`vitepress-velonor` 是一个面向 VitePress 的**博客微引擎**，提供可复用的逻辑与数据能力，帮助你快速开发一个属于你自己的博客主题。

---

构建期 loader 只能在 `*.data.ts/js` 中使用，它依赖 VitePress 的 `createContentLoader`。

引擎已提供统一工厂，使用方式如下。


## 1. Posts

```ts
import { createPostsLoader } from 'vitepress-velonor/loader';
export default createPostsLoader('posts/**/*.md');
```

输出：文章数组（已过滤草稿/隐藏、已排序）。

---

## 2. Page Links

```ts
import { createPageLinksLoader } from 'vitepress-velonor/loader';
export default createPageLinksLoader(['**/*.md']);
```

输出：
```ts
{
  blog?: string;
  tags?: string;
  categories?: string;
  archive?: string;
}
```

---

## 3. Tags

```ts
import { createTagsLoader } from 'vitepress-velonor/loader';
export default createTagsLoader('posts/**/*.md');
```

输出：
```ts
{
  tagsMap: Record<string, number>;
  tagArray: [string, number][];
  uniqueTagCount: number;
  totalPosts: number;
}
```

---

## 4. Categories

```ts
import { createCategoriesLoader } from 'vitepress-velonor/loader';
export default createCategoriesLoader('posts/**/*.md');
```

输出：
```ts
{
  categoriesMap: Record<string, number>;
  categoryArray: [string, number][];
  uniqueCategoryCount: number;
  totalPosts: number;
}
```

---

## 5. Archive

```ts
import { createArchiveLoader } from 'vitepress-velonor/loader';
export default createArchiveLoader('posts/**/*.md');
```

输出：
```ts
{
  yearGroups: { year, months, total }[];
  totalPosts: number;
}
```

