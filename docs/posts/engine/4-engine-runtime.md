---
title: VitePress-Velonor 运行期能力
date: 2026-02-02
tags:
  - 引擎
  - 运行期
---

`@velonor/engine` 是一个面向 VitePress 的**博客微引擎**，提供可复用的逻辑与数据能力，帮助你快速开发一个属于你自己的博客主题。

---

## 1. 分页

```ts
import { usePagination } from '@velonor/engine/client';
import { data as posts } from '../posts.data.js';

const {
  currentPage,
  totalPages,
  paginatedItems,
  nextPage,
  prevPage,
} = usePagination(posts, { pageSize: 5 });
```

---

## 2. 标签状态

```ts
import { createTagsStore } from '@velonor/engine/client';
import { data as posts } from '../posts.data.js';

const useTags = createTagsStore(posts);
const { activeTag, getTagArray, filterPostsByActiveTag } = useTags();
```

---

## 3. 分类状态

```ts
import { createCategoriesStore } from '@velonor/engine/client';
import { data as posts } from '../posts.data.js';

const useCategories = createCategoriesStore(posts);
const { activeCategory, getCategoryArray, filterPostsByActiveCategory } = useCategories();
```

---

## 4. URL 同步说明

- 标签默认使用 `?tag=xxx`
- 分类默认使用 `?category=xxx`
- 与分页参数兼容

---

