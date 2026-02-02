<template>
  <ThemeLayout>
    <div
      class="flex w-full flex-col bg-opacity-90 backdrop-blur-md dark:shadow-none shadow-lg border-2 border-[var(--blog-border-c)] bg-[var(--vp-c-blog-bg)] rounded-2xl py-10 px-6 md:px-10 gap-8">
      <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div class="flex flex-col gap-2">
          <div class="text-3xl md:text-4xl font-bold tracking-tight">{{ archiveTitle }}</div>
          <div class="text-sm opacity-70">
            {{ totalPosts }} {{ postsText }} · {{ yearGroups.length }} {{ yearsText }}
          </div>
        </div>
        <div class="flex items-center gap-2 text-xs">
          <a v-if="blogHomeLink" :href="withBase(blogHomeLink)"
            class="px-3 py-1 rounded-full border border-[var(--blog-border-c)]/70 bg-[var(--vp-c-bg)]/40 hover:bg-[var(--vp-c-bg)]/60 transition">
            {{ backToBlogText }}
          </a>
        </div>
      </div>

      <div class="flex flex-col gap-10">
        <div
          v-for="yearGroup in yearGroups"
          :key="yearGroup.year"
          class="rounded-2xl border border-[var(--blog-border-c)]/70 bg-[var(--vp-c-bg)]/30 px-5 md:px-7 py-6">
          <div class="flex items-center justify-between mb-5">
            <div class="text-2xl font-bold tracking-tight flex items-center gap-3">
              <span class="w-1.5 h-6 rounded-full bg-[var(--vp-c-brand-2)]"></span>
              {{ yearGroup.year }}
            </div>
            <div class="text-xs opacity-70">
              {{ yearGroup.total }} {{ postsText }} · {{ yearGroup.months.length }} {{ monthsText }}
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <details
              v-for="monthGroup in yearGroup.months"
              :key="`${yearGroup.year}-${monthGroup.month}`"
              class="group rounded-xl border border-dashed border-[var(--blog-border-c)]/60 bg-[var(--vp-c-bg)]/40 p-4 transition hover:-translate-y-0.5 hover:shadow-lg hover:border-solid">
              <summary class="list-none cursor-pointer">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2 text-base font-semibold">
                    <span>{{ monthGroup.monthName }}</span>
                    <span class="text-xs px-2 py-0.5 rounded-full border border-[var(--blog-border-c)]/70 opacity-70">
                      {{ monthGroup.posts.length }}
                    </span>
                  </div>
                  <span class="text-xs opacity-60 group-open:rotate-180 transition">⌄</span>
                </div>
                <div class="mt-3 flex flex-col gap-1 text-sm opacity-80">
                  <div v-for="post in monthGroup.posts.slice(0, 3)" :key="post.url" class="truncate">
                    {{ post.frontmatter.title }}
                  </div>
                  <div v-if="monthGroup.posts.length > 3" class="text-xs opacity-60">
                    +{{ monthGroup.posts.length - 3 }} more
                  </div>
                </div>
              </summary>

              <div class="mt-4 pt-3 border-t border-dashed border-[var(--blog-border-c)]/70">
                <div
                  class="px-3 py-2 flex justify-between w-full rounded-lg flex-col md:flex-row gap-1 border border-transparent hover:border-[var(--blog-border-c)] hover:bg-[var(--blog-time-line-text-bg)]/60 hover:text-[var(--blog-time-line-text)] transition"
                  v-for="post in monthGroup.posts"
                  :key="post.url">
                  <a class="text-sm font-medium" :href="withBase(post.url)">
                    {{ post.frontmatter.title }}
                  </a>
                  <div class="text-xs opacity-75 transition duration-150 ease-in-out">
                    {{ formatMonthDay(post.frontmatter.date) }}
                  </div>
                </div>
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  </ThemeLayout>
</template>

<script setup lang="ts">
import { data as archiveIndex } from '../archive.data';
import { withBase, useData } from 'vitepress';
import ThemeLayout from './ThemeLayout.vue';
import { type BlogPost, getLocalizedString } from 'vitepress-velonor';
import { computed } from 'vue';
import { data as pageLinks } from '../page-links.data';

interface MonthGroup {
  month: number;
  monthName: string;
  posts: BlogPost[];
}

interface YearGroup {
  year: number;
  months: MonthGroup[];
  total: number;
}

const yearGroups = computed(() => (archiveIndex.yearGroups || []) as YearGroup[]);
const totalPosts = computed(() => archiveIndex.totalPosts ?? 0);

const { lang, theme } = useData();
const blogHomeLink = computed(() => theme.value.blog?.homePageLink || pageLinks?.blog || '/page/blog');
const backToBlogText = computed(() => getLocalizedString('backToBlog', lang.value));
const archiveTitle = computed(() => (lang.value || '').startsWith('zh') ? '归档' : 'Archive');
const postsText = computed(() => (lang.value || '').startsWith('zh') ? '文章' : 'Posts');
const yearsText = computed(() => (lang.value || '').startsWith('zh') ? '年份' : 'Years');
const monthsText = computed(() => (lang.value || '').startsWith('zh') ? '月份' : 'Months');

const formatMonthDay = (value: unknown) => {
  if (!value) return '';
  const date = new Date(value as any);
  if (Number.isNaN(date.getTime())) return String(value).slice(5, 10);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${month}-${day}`;
};
</script>
