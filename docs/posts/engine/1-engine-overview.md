---
title: VitePress-Velonor 引擎概览
date: 2026-02-02
tags:
  - 引擎
  - 概览
---

`@velonor/engine` 是一个面向 VitePress 的**博客微引擎**，提供可复用的逻辑与数据能力，帮助你快速开发一个属于你自己的博客主题。

---

它分为三类入口：

- `@velonor/engine`：纯逻辑与通用工具
- `@velonor/engine/client`：运行期状态与 URL 同步
- `@velonor/engine/loader`：构建期数据 loader 工厂

## 核心功能

- 博客文章自动读取, 并支持排序、过滤、分页
- 支持标签/分类状态管理与 URL 同步
- 支持归档数据、标签/分类统计
- 站点页面（tags/archive/blog）自动定位,返回对应链接

