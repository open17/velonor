<script setup>
import { useData, withBase } from 'vitepress';
import { computed, watch } from 'vue';
import ThemeLayout from './ThemeLayout.vue';
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_GROUP_SIZE,
  getLocalizedString,
  usePagination,
  formatDate,
} from '@velonor/engine/client';
import { useTagFilter } from '../composables/useTagFilter';
import { useCategories } from '../composables/useCategories';

const { theme, lang } = useData();
const blogConfig = computed(() => theme.value.blog || {});

const pageSize = computed(
  () => blogConfig.value.pageSize || theme.value.home?.postsPerPage || DEFAULT_PAGE_SIZE
);
const pageGroupSize = computed(
  () => blogConfig.value.pageGroupSize || DEFAULT_PAGE_GROUP_SIZE
);

const locale = computed(() => {
  if (typeof navigator !== 'undefined' && navigator.language) return navigator.language;
  return lang.value || 'en-US';
});

const { selectedTags } = useTagFilter();
const { filterPostsByActiveCategory, activeCategory } = useCategories({
  otherLabel: getLocalizedString('other', lang.value),
});

const filteredPosts = computed(() => {
  const byCategory = filterPostsByActiveCategory(activeCategory.value);
  if (!selectedTags.value.length) return byCategory;
  return byCategory.filter((item) => {
    const tags = item.frontmatter.tags || [];
    return selectedTags.value.some((tag) => tags.includes(tag));
  });
});

const blogTitle = computed(() => (lang.value || '').startsWith('zh') ? '博客' : 'Blog');
const postsText = computed(() => (lang.value || '').startsWith('zh') ? '文章' : 'Posts');


const {
  currentPage,
  totalPages,
  pageRange,
  paginatedItems,
  setPage,
  nextPage,
  prevPage,
  jumpInput,
  jumpToInput,
} = usePagination(filteredPosts, {
  pageSize,
  pageGroupSize: pageGroupSize.value,
  pageParam: 'page',
});

watch([selectedTags, activeCategory, pageSize], () => {
  setPage(1);
});

const hashString = (value) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const getCoverFallbackStyle = (post) => {
  const title = post?.frontmatter?.title || post?.title || post?.url || 'post';
  const hash = hashString(String(title));
  const hue = hash % 360;
  const hue2 = (hue + 40 + (hash % 60)) % 360;
  const hue3 = (hue + 120 + (hash % 90)) % 360;
  const sat = 30 + (hash % 20);
  const light = 20 + (hash % 15);
  const angle = 120 + (hash % 40);
  const gradient = `linear-gradient(${angle}deg, hsla(${hue}, ${sat}%, ${light + 14}%, 0.42), hsla(${hue2}, ${sat}%, ${light}%, 0.22))`;
  const dots = `radial-gradient(hsla(${hue2}, ${sat}%, ${light + 20}%, 0.35) 1px, transparent 1px)`;
  return {
    backgroundImage: `${gradient}, ${dots}`,
    backgroundSize: 'cover, 16px 16px',
    backgroundPosition: 'center, 0 0',
  };
};

const changePage = (page) => {
  setPage(page);
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const jumpToPage = () => {
  jumpToInput();
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};
</script>

<template>
  <ThemeLayout :showContent="true">
    <div class="w-full flex flex-col gap-3 md:gap-4 mb-1">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div class="flex flex-col gap-2">
          <div class="text-3xl md:text-4xl font-bold tracking-tight">{{ blogTitle }}</div>
          <div class="text-sm opacity-70">
            {{ filteredPosts.length }} {{ postsText }}
          </div>
        </div>
        <div class="flex items-center gap-2 text-xs flex-wrap">
          <span v-if="activeCategory"
            class="px-3 py-1 rounded-full border border-[var(--blog-tag-text-2)] bg-[var(--blog-tag-bg-2)]/90 text-[var(--blog-tag-text-2)]">
            分类: {{ activeCategory }}
          </span>
          <span v-if="selectedTags.length"
            class="px-3 py-1 rounded-full border border-[var(--blog-tag-text-1)] bg-[var(--blog-tag-bg-1)] text-[var(--blog-tag-text-1)]">
            标签: {{ selectedTags.join(" / ") }}
          </span>
        </div>
      </div>
    </div>
    <!-- 博客文章 -->
    <div class="w-full flex justify-center items-center relative" v-for="(post, idx) of paginatedItems" :key="post.url">
      <a :href="withBase(post.url)" class="w-full rounded-2xl">
        <div
          class="bg-opacity-90 backdrop-blur-md w-full rounded-2xl flex flex-col md:flex-row dark:shadow-none shadow-lg border-2 border-[var(--blog-border-c)] bg-[var(--vp-c-blog-bg)] relative transition duration-200 hover:-translate-y-0.5 hover:shadow-xl overflow-hidden"
          :class="idx % 2 === 1 ? 'md:flex-row-reverse' : ''">
          <!-- 置顶标识 -->
          <div v-if="post.frontmatter.pin" class=" absolute top-0 left-0 w-0 h-0">
            <div
              class="z-20 absolute top-0 left-0 w-0 h-0 border-t-[2rem] border-r-transparent border-r-[2rem] border-[var(--vp-c-blog-bg)] rounded-tl-2xl">
            </div>
            <div
              class="z-10 absolute top-0 left-0 w-0 h-0 border-t-[3rem] border-r-transparent border-r-[3rem] border-[var(--vp-c-brand-2)] rounded-tl-2xl">
            </div>
          </div>
          <!-- 文章图片 -->
          <div class="w-full md:w-2/5 bg-[var(--vp-c-bg)]/30">
            <div class="w-full h-48 md:h-full min-h-48 relative overflow-hidden" v-if="post.frontmatter.cover">
              <img :src="post.frontmatter.cover" alt=""
                class="w-full h-full object-cover transition duration-300 scale-100 hover:scale-105" />
            </div>
            <div v-else class="w-full h-48 md:h-full min-h-48" :style="getCoverFallbackStyle(post)"></div>
          </div>
          <div class="w-full md:w-3/5 flex flex-col gap-3 px-6 md:px-8 py-6">
            <!-- 标题 -->
            <div class="text-lg md:text-xl font-semibold tracking-tight">
              <span>{{ post.frontmatter.title }}</span>
            </div>
            <!-- 摘要 -->
            <div v-html="post.excerpt || post.frontmatter.desc" class="text-sm leading-relaxed opacity-80"></div>
            <!-- 文章信息 -->
            <div class="flex justify-between w-full items-center flex-wrap text-sm gap-3 mt-auto pt-2">
              <div class="flex justify-end items-end gap-2 flex-wrap">
                <div v-for="(tag, idx) in post.frontmatter.tags" :key="`${post.url}-tag-${idx}`"
                  class="bg-[var(--blog-tag-bg-2)]/90 text-[var(--blog-tag-text-2)] border-[var(--blog-tag-text-2)] px-2.5 py-0.5 rounded-full text-xs">
                  <span>{{ tag }}</span>
                </div>
              </div>
              <div class="text-xs opacity-75">{{ formatDate(post.frontmatter.date, locale) }}</div>
            </div>
          </div>
        </div>
      </a>
    </div>
    <!-- 分页 -->
    <div class="flex justify-center items-center gap-2 border-0 flex-row w-full px-5" v-if="totalPages > 1">
      <!-- 上一页 -->
      <button @click="prevPage()" :disabled="currentPage <= 1"
        class="border-2 px-3 h-8 text-center flex justify-center items-center cursor-pointer bg-[var(--vp-c-blog-bg)] rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed">
        {{ getLocalizedString('prev', lang) }}
      </button>

      <!-- 页码 -->
      <div class="flex justify-center items-center gap-2">
        <!-- 第一页（如果不在范围内） -->
        <template v-if="pageRange[0] > 1">
          <div @click="changePage(1)"
            class="border-2 w-8 h-8 text-center flex justify-center items-center cursor-pointer rounded-md bg-[var(--vp-c-blog-bg)]">
            1
          </div>
          <span v-if="pageRange[0] > 2" class="text-sm">...</span>
        </template>

        <!-- 页码范围 -->
        <div @click="changePage(page)" v-for="page in pageRange" :key="page"
          class="border-2 w-8 h-8 text-center flex justify-center items-center cursor-pointer rounded-md" :class="{
            'bg-[var(--vp-c-brand-1)] text-white border-[var(--vp-c-brand-1)]': page === currentPage,
            'bg-[var(--vp-c-blog-bg)]': page !== currentPage,
          }">
          {{ page }}
        </div>

        <!-- 最后一页（如果不在范围内） -->
        <template v-if="pageRange[pageRange.length - 1] < totalPages">
          <span v-if="pageRange[pageRange.length - 1] < totalPages - 1" class="text-sm">...</span>
          <div @click="changePage(totalPages)"
            class="border-2 w-8 h-8 text-center flex justify-center items-center cursor-pointer rounded-md bg-[var(--vp-c-blog-bg)]">
            {{ totalPages }}
          </div>
        </template>
      </div>

      <!-- 跳转到页 -->
      <div class="flex items-center gap-2 ml-2">
        <input type="number" min="1" :max="totalPages" v-model.trim="jumpInput" @keyup.enter="jumpToPage"
          class="w-16 h-8 border-2 rounded-md bg-[var(--vp-c-blog-bg)] px-2 text-sm" :placeholder="`${currentPage}/${totalPages}`" />
        <button @click="jumpToPage"
          class="border-2 px-3 h-8 text-center flex justify-center items-center cursor-pointer bg-[var(--vp-c-blog-bg)] rounded-md text-sm">
          跳转
        </button>
      </div>

      <!-- 下一页 -->
      <button @click="nextPage()" :disabled="currentPage >= totalPages"
        class="border-2 px-3 h-8 text-center flex justify-center items-center cursor-pointer bg-[var(--vp-c-blog-bg)] rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed">
        {{ getLocalizedString('next', lang) }}
      </button>
    </div>
  </ThemeLayout>
</template>

