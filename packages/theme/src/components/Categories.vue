<template>
  <ThemeLayout>
    <div
      class="flex w-full flex-col bg-opacity-85 backdrop-blur-md dark:shadow-none shadow-lg border-2 border-[var(--blog-border-c)] bg-[var(--vp-c-blog-bg)] rounded-2xl py-10 px-6 md:px-10 gap-8">
      <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div class="flex flex-col gap-2">
          <div class="text-3xl md:text-4xl font-bold tracking-tight">{{ categoriesText }}</div>
          <div class="text-sm opacity-70">
            {{ totalPosts }} {{ postsText }}  {{ uniqueCategoryCount }} {{ categoriesText }}
          </div>
        </div>
        <div class="flex items-center gap-2 text-xs">
          <span class="px-3 py-1 rounded-full border border-[var(--blog-border-c)] bg-[var(--vp-c-bg)]/60">
            {{ ActiveCategory ? ActiveCategory : allText }}
          </span>
          <a v-if="blogHomeLink" :href="withBase(blogHomeLink)"
            class="px-3 py-1 rounded-full border border-[var(--blog-border-c)]/70 bg-[var(--vp-c-bg)]/40 hover:bg-[var(--vp-c-bg)]/60 transition">
            {{ backToBlogText }}
          </a>
        </div>
      </div>

      <!-- categories list -->
      <div class="flex justify-left items-center flex-wrap md:mx-2 md:gap-3 gap-2">
        <button v-for="categoryItem in categoryArray" :key="categoryItem[0]"
          class="px-3 py-1 rounded-full cursor-pointer border text-sm transition duration-150 ease-out hover:-translate-y-0.5 hover:shadow-sm"
          :class="{
            'bg-[var(--blog-tag-bg-2)] text-[var(--blog-tag-text-2)] border-[var(--blog-tag-text-2)]': ActiveCategory == categoryItem[0],
            'bg-[var(--blog-tag-bg-1)] text-[var(--blog-tag-text-1)] border-[var(--blog-tag-text-1)]': ActiveCategory != categoryItem[0]
          }" @click="ActiveCategory = categoryItem[0]">
          <span>{{ categoryItem[0] == '' ? allText : categoryItem[0] }}</span>
          <span class="ml-2 opacity-70"> {{ categoryItem[1] }}</span>
        </button>
      </div>

      <div class="w-full border-dashed border-t-2 border-[var(--blog-border-c)]"></div>

      <!-- posts with categories -->
      <div class="flex justify-center flex-col gap-6 md:gap-5">
        <div
          class="flex items-center gap-3 flex-col md:flex-row md:gap-12 md:justify-between rounded-xl px-4 py-3 border border-transparent hover:border-[var(--blog-border-c)] hover:bg-[var(--vp-c-bg)]/40 transition"
          v-for="post in filteredList" :key="post.url">
          <a :href="withBase(post.url)" class="hover:underline text-base font-medium">
            {{ post.frontmatter.title }}
          </a>
          <div class="flex justify-end items-end gap-2 flex-wrap">
            <span class="text-xs px-2 py-0.5 rounded-full border bg-[var(--blog-tag-bg-1)] text-[var(--blog-tag-text-1)] border-[var(--blog-tag-text-1)]"
              v-for="(tag, idx) in post.frontmatter.tags" :key="`${post.url}-tag-${idx}`">
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </ThemeLayout>
</template>

<script setup>
import { computed } from 'vue';
import { withBase, useData } from 'vitepress';
import ThemeLayout from './ThemeLayout.vue';
import { getLocalizedString } from '@velonor/engine';
import { useCategories } from '../composables/useCategories';
import { data as pageLinks } from '../page-links.data';
import { data as categoriesIndex } from '../categories.data';

const { lang, theme } = useData();
const allText = computed(() => getLocalizedString('all', lang.value));
const categoriesText = computed(() => getLocalizedString('category', lang.value));
const postsText = computed(() => getLocalizedString('posts', lang.value));
const backToBlogText = computed(() => getLocalizedString('backToBlog', lang.value));
const blogHomeLink = computed(() => theme.value.blog?.homePageLink || pageLinks?.blog || '/page/blog');

const { activeCategory: ActiveCategory, getCategoryArray, filterPostsByActiveCategory, uniqueCategoryCount: uniqueCategoryCountRaw, categoriesMap } = useCategories({
  otherLabel: getLocalizedString('other', lang.value),
});

const categoryArray = computed(() => categoriesIndex.categoryArray || getCategoryArray());
const totalPosts = computed(() => categoriesIndex.totalPosts ?? (categoriesMap.value[''] || 0));
const uniqueCategoryCount = computed(() => categoriesIndex.uniqueCategoryCount ?? uniqueCategoryCountRaw.value);

const filteredList = computed(() => filterPostsByActiveCategory());
</script>

