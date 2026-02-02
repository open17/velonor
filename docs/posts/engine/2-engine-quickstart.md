---
title: VitePress-Velonor 快速开始
date: 2026-02-02
tags:
  - 引擎
  - 快速开始
---

`vitepress-velonor` 是一个面向 VitePress 的**博客微引擎**，提供可复用的逻辑与数据能力，帮助你快速开发一个属于你自己的博客主题。

---

## 1. 安装

```bash
npm i vitepress-velonor
```

---

## 2. 构建期 data 文件

### posts 数据

```ts
// packages/theme/src/posts.data.js
import { createPostsLoader } from 'vitepress-velonor/loader';
export default createPostsLoader('posts/**/*.md');
```

### tags / categories / archive / page-links

```ts
// packages/theme/src/tags.data.ts
import { createTagsLoader } from 'vitepress-velonor/loader';
export default createTagsLoader('posts/**/*.md');
```

```ts
// packages/theme/src/categories.data.ts
import { createCategoriesLoader } from 'vitepress-velonor/loader';
export default createCategoriesLoader('posts/**/*.md');
```

```ts
// packages/theme/src/archive.data.ts
import { createArchiveLoader } from 'vitepress-velonor/loader';
export default createArchiveLoader('posts/**/*.md');
```

```ts
// packages/theme/src/page-links.data.ts
import { createPageLinksLoader } from 'vitepress-velonor/loader';
export default createPageLinksLoader(['**/*.md']);
```

---

## 3. 运行期使用

### 分页

```ts
import { usePagination } from 'vitepress-velonor/client';
import { data as posts } from '../posts.data.js';

const { currentPage, paginatedItems } = usePagination(posts, { pageSize: 5 });
```

### 标签/分类

```ts
import { createTagsStore, createCategoriesStore } from 'vitepress-velonor/client';
import { data as posts } from '../posts.data.js';

const useTags = createTagsStore(posts);
const useCategories = createCategoriesStore(posts);
```

---

## 4. 页面 frontmatter 约定

```md
---
layout: blog | tags | categories | archive
---
```

`page-links` 会自动扫描这些 layout，用于生成跳转链接。

---

完成。你可以直接写主题组件使用这些 data 与 composable。  
