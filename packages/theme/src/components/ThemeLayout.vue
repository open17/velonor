<script setup>
import { useData } from 'vitepress';
import { computed, watch, ref } from 'vue';
import UserCard from './UserCard.vue';
import WidgetCard from './WidgetCard.vue';
import UpdateHeatmap from './UpdateHeatmap.vue';
import { getLocalizedString } from 'vitepress-velonor';
import { useTagFilter } from '../composables/useTagFilter';
import { useCategories } from '../composables/useCategories';
import { data as pageLinks } from '../page-links.data';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  showContent: Boolean,
});

const { theme, lang, frontmatter } = useData();

const blogConfig = computed(() => theme.value.blog || {});
const direct = computed(() => blogConfig.value.direct || 'lft');
const isBlogHome = computed(() => frontmatter.value?.layout === 'blog');
const resolvedTagPageLink = computed(
  () => blogConfig.value.tagPageLink || pageLinks?.tags || ''
);
const resolvedArchivePageLink = computed(
  () => blogConfig.value.archivePageLink || pageLinks?.archive || ''
);
const resolvedCategoryPageLink = computed(
  () => blogConfig.value.categoryPageLink || pageLinks?.categories || ''
);

const {
  selectedTags,
  getTagArray,
  addTag,
  removeTag,
  setSelectedTags,
} = useTagFilter();
const { activeCategory, getCategoryArray, filterPostsByActiveCategory } = useCategories({
  otherLabel: getLocalizedString('other', lang.value),
});

const allText = computed(() => getLocalizedString('all', lang.value));

const tagQuery = ref('');

const tagSuggestions = computed(() => {
  const query = tagQuery.value.trim().toLowerCase();
  if (!query) return [];
  return getTagArray()
    .filter(([name]) => name && name.toLowerCase().includes(query))
    .filter(([name]) => !selectedTags.value.includes(name))
    .slice(0, 12);
});

const displayedTags = computed(() => {
  if (tagQuery.value.trim()) return tagSuggestions.value;
  return [];
});

const addTagFromQuery = () => {
  const query = tagQuery.value.trim();
  if (!query) return;
  const lower = query.toLowerCase();
  const match = getTagArray().find(([name]) => name.toLowerCase() === lower);
  const target = match?.[0] || tagSuggestions.value[0]?.[0];
  if (!target) return;
  addTag(target);
  tagQuery.value = '';
};

watch(
  activeCategory,
  (newCat) => {
    if (!selectedTags.value.length) return;
    const postsInCategory = filterPostsByActiveCategory(newCat);
    const allowed = new Set();
    postsInCategory.forEach((post) => {
      const tags = post.frontmatter.tags || [];
      tags.forEach((tag) => allowed.add(tag));
    });
    const nextTags = selectedTags.value.filter((tag) => allowed.has(tag));
    if (nextTags.length !== selectedTags.value.length) {
      setSelectedTags(nextTags);
    }
  },
  { immediate: true }
);


watch(
  selectedTags,
  (tags) => {
    if (!activeCategory.value) return;
    if (!tags.length) return;
    const postsInCategory = filterPostsByActiveCategory(activeCategory.value);
    const tagExistsInCategory = tags.some((tag) =>
      postsInCategory.some((p) => p.frontmatter.tags && p.frontmatter.tags.includes(tag))
    );
    if (!tagExistsInCategory) {
      activeCategory.value = '';
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="w-full flex justify-center">
    <div class="flex w-full max-w-screen-2xl justify-center items-start pt-0 my-0 gap-5 md:px-20 flex-col-reverse"
      :class="{
        'md:flex-row': direct == 'lft',
        'md:flex-row-reverse': direct == 'rgt',
      }">
      <!-- 博客侧边栏 -->
      <div class="flex bg-transparent w-full md:w-[23%] md:max-w-[23%] md:flex-none md:shrink-0 min-w-0 justify-center items-start pt-16 pb-12 flex-col gap-5"
        v-if="!blogConfig.pureMode">
        <!-- 电脑端个人信息 -->
        <UserCard :isMobile="false" />

        <!-- 侧边栏Category -->
        <div v-if="isBlogHome"
          class="flex w-full md:rounded-2xl px-5 py-5 flex-col justify-center gap-3 dark:shadow-none shadow-lg border-2 border-[var(--blog-border-c)] bg-[var(--vp-c-blog-bg)]/95 backdrop-blur-md">
          <div class="flex items-center justify-between text-xs uppercase tracking-wider opacity-70">
            <span>{{ getLocalizedString('category', lang) || 'Category' }}</span>
            <div class="flex items-center gap-2">
              <a v-if="resolvedCategoryPageLink" :href="resolvedCategoryPageLink"
                class="normal-case text-xs opacity-70 hover:opacity-100 transition">
                {{ getLocalizedString('details', lang) || 'Details' }}
              </a>
              <span class="px-2 py-0.5 rounded-full border border-[var(--blog-border-c)]/70">
                {{ getCategoryArray().length - 1 }}
              </span>
            </div>
          </div>
          <div class="flex justify-start items-center flex-wrap gap-2 pt-1">
            <div v-for="(cat, i) in getCategoryArray()" :key="cat[0]" class="cursor-pointer relative mt-1"
              @click="activeCategory = cat[0]">
              <div class="text-xs px-3 py-0.5 rounded-full border border-dashed transition hover:-translate-y-0.5" :class="{
                'bg-[var(--blog-tag-bg-2)] text-[var(--blog-tag-text-2)] border-[var(--blog-tag-text-2)]': activeCategory === cat[0],
                'bg-[var(--blog-tag-bg-1)] text-[var(--blog-tag-text-1)] border-[var(--blog-tag-text-1)]': activeCategory !== cat[0]
              }">
                {{ cat[0] == '' ? allText : cat[0] }}
              </div>
            </div>
          </div>
        </div>

        <!-- 侧边栏Tag -->
        <div v-if="isBlogHome"
          class="flex w-full md:rounded-2xl px-5 py-5 flex-col justify-center gap-3 dark:shadow-none shadow-lg border-2 border-[var(--blog-border-c)] bg-[var(--vp-c-blog-bg)]/95 backdrop-blur-md">
          <!-- Tags -->
          <div class="flex items-center justify-between text-xs uppercase tracking-wider opacity-70">
            <span>{{ getLocalizedString('tags', lang) || 'Tags' }}</span>
            <div class="flex items-center gap-2">
              <a v-if="resolvedTagPageLink" :href="resolvedTagPageLink"
                class="normal-case text-xs opacity-70 hover:opacity-100 transition">
                {{ getLocalizedString('details', lang) || 'Details' }}
              </a>
              <span class="px-2 py-0.5 rounded-full border border-[var(--blog-border-c)]/70">
                {{ getTagArray().length - 1 }}
              </span>
            </div>
          </div>
          <input
            v-model="tagQuery"
            type="text"
            class="w-full h-8 border border-[var(--blog-border-c)]/70 rounded-md bg-[var(--vp-c-bg)]/60 px-2 text-xs outline-none focus:border-[var(--vp-c-brand-2)]"
            :placeholder="(getLocalizedString('tags', lang) || 'Tags') + '...'"
            @keydown.enter.prevent="addTagFromQuery"
          />
          <div class="flex justify-start items-center flex-wrap gap-2 pt-1">
            <div v-for="tag in selectedTags" :key="tag"
              class="flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full border border-solid bg-[var(--blog-tag-bg-2)] text-[var(--blog-tag-text-2)] border-[var(--blog-tag-text-2)]">
              <span>{{ tag }}</span>
              <button type="button" class="ml-0.5 opacity-70 hover:opacity-100" @click.stop="removeTag(tag)">x</button>
            </div>
          </div>
          <div v-if="displayedTags.length" class="flex justify-start items-center flex-wrap gap-2 pt-1">
            <button v-for="(tag, i) in displayedTags" :key="tag[0]"
              class="text-xs px-2.5 py-0.5 rounded-full border border-dashed transition hover:-translate-y-0.5 bg-[var(--blog-tag-bg-1)] text-[var(--blog-tag-text-1)] border-[var(--blog-tag-text-1)]"
              @click="addTag(tag[0]); tagQuery = '';">
              + {{ tag[0] }}
            </button>
          </div>
        </div>
        <!-- 用户自定义组件 -->
        <UpdateHeatmap
          :archiveLink="resolvedArchivePageLink"
          :archiveLabel="getLocalizedString('details', lang) || 'Details'"
          :titleLabel="getLocalizedString('activity', lang) || 'Activity'"
        />
        <WidgetCard />
      </div>
      <!-- 博客文章 -->
      <div class="flex md:w-[77%] md:max-w-[77%] md:flex-none md:shrink-0 py-20 justify-center items-center gap-5 flex-col w-full px-3">
        <slot :selectedTags="selectedTags" :activeCategory="activeCategory" />
      </div>
      <!-- 移动端个人信息显示 -->
      <UserCard :isMobile="true" />
    </div>
    <Content v-if="showContent" />
  </div>
</template>

<style>
.blog-home .VPContent {
  padding-top: 0 !important;
}

.shadow-0 {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>
