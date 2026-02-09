<template>
  <ThemeLayout>
    <div
      class="flex w-full flex-col bg-opacity-85 backdrop-blur-md dark:shadow-none shadow-lg border-2 border-[var(--blog-border-c)] bg-[var(--vp-c-blog-bg)] rounded-2xl py-10 px-6 md:px-10 gap-8">
      <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div class="flex flex-col gap-2">
          <div class="text-3xl md:text-4xl font-bold tracking-tight">{{ tagsText }}</div>
          <div class="text-sm opacity-70">
            {{ totalPosts }} {{ postsText }}  {{ uniqueTagCount }} {{ tagsText }}
          </div>
        </div>
        <div class="flex items-center gap-2 text-xs">
          <span class="px-3 py-1 rounded-full border border-[var(--blog-border-c)] bg-[var(--vp-c-bg)]/60">
            {{ activeLabel }}
          </span>
          <a v-if="blogHomeLink" :href="withBase(blogHomeLink)"
            class="px-3 py-1 rounded-full border border-[var(--blog-border-c)]/70 bg-[var(--vp-c-bg)]/40 hover:bg-[var(--vp-c-bg)]/60 transition">
            {{ backToBlogText }}
          </a>
        </div>
      </div>

      <!-- tags list -->
      <div class="flex justify-left items-center flex-wrap md:mx-2 md:gap-3 gap-2">
        <button v-for="tagItem in tagArray" :key="tagItem[0]"
          class="px-3 py-1 rounded-full cursor-pointer border text-sm transition duration-150 ease-out hover:-translate-y-0.5 hover:shadow-sm"
          :class="{
            'bg-[var(--blog-tag-bg-2)] text-[var(--blog-tag-text-2)] border-[var(--blog-tag-text-2)]': isTagSelected(tagItem[0]),
            'bg-[var(--blog-tag-bg-1)] text-[var(--blog-tag-text-1)] border-[var(--blog-tag-text-1)]': !isTagSelected(tagItem[0])
          }" @click="toggleTag(tagItem[0])">
          <span>{{ tagItem[0] == '' ? allText : tagItem[0] }}</span>
          <span class="ml-2 opacity-70"> {{ tagItem[1] }}</span>
        </button>
      </div>

      <div class="w-full border-dashed border-t-2 border-[var(--blog-border-c)]"></div>

      <!-- posts with tags -->
      <div class="flex justify-center flex-col gap-6 md:gap-5">
        <div
          class="flex items-center gap-3 flex-col md:flex-row md:gap-12 md:justify-between rounded-xl px-4 py-3 border border-transparent hover:border-[var(--blog-border-c)] hover:bg-[var(--vp-c-bg)]/40 transition"
          v-for="post in filteredList" :key="post.url">
          <a :href="withBase(post.url)" class="hover:underline text-base font-medium">
            {{ post.frontmatter.title }}
          </a>
          <div class="flex justify-end items-end gap-2 flex-wrap">
            <span class="cursor-pointer text-xs px-2 py-0.5 rounded-full border" :class="{
              'bg-[var(--blog-tag-bg-2)] text-[var(--blog-tag-text-2)] border-[var(--blog-tag-text-2)]': isTagSelected(tag),
              'bg-[var(--blog-tag-bg-1)] text-[var(--blog-tag-text-1)] border-[var(--blog-tag-text-1)]': !isTagSelected(tag)
            }" v-for="(tag, idx) in post.frontmatter.tags" :key="`${post.url}-tag-${idx}`"
              @click="toggleTag(tag)">
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
import { useTagFilter } from '../composables/useTagFilter';
import { data as pageLinks } from '../page-links.data';
import { data as tagIndex } from '../tags.data';

const { lang, theme } = useData();
const allText = computed(() => getLocalizedString('all', lang.value));
const tagsText = computed(() => getLocalizedString('tags', lang.value));
const postsText = computed(() => getLocalizedString('posts', lang.value));
const backToBlogText = computed(() => getLocalizedString('backToBlog', lang.value));
const blogHomeLink = computed(() => theme.value.blog?.homePageLink || pageLinks?.blog || '/page/blog');

const {
  selectedTags,
  getTagArray,
  uniqueTagCount: uniqueTagCountRaw,
  tagsMap,
  filterPostsByActiveTag,
  toggleTag,
  isTagSelected,
} = useTagFilter();

const tagArray = computed(() => tagIndex.tagArray || getTagArray());
const totalPosts = computed(() => tagIndex.totalPosts ?? (tagsMap.value[''] || 0));
const uniqueTagCount = computed(() => tagIndex.uniqueTagCount ?? uniqueTagCountRaw.value);

const activeLabel = computed(() => {
  if (!selectedTags.value.length) return allText.value;
  return selectedTags.value.join(' / ');
});

const filteredList = computed(() => {
  const allPosts = filterPostsByActiveTag('');
  if (!selectedTags.value.length) return allPosts;
  return allPosts.filter((item) => {
    const tags = item.frontmatter.tags || [];
    return selectedTags.value.some((tag) => tags.includes(tag));
  });
});
</script>

