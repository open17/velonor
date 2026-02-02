<template>
  <Transition>
    <div id="Loading" v-if="isLoading"></div>
  </Transition>

  <div class="fixed bottom-6 right-6 z-50" v-if="isPostPage">
    <button @click="togglePostPage" class="layout-toggle-btn"
      :title="switchPageStyle ? getLocalizedString('switchToNormalPage', lang) : getLocalizedString('switchToPostPage', lang)">
      <svg v-if="switchPageStyle" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
      </svg>
      <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
        </path>
      </svg>
    </button>
  </div>

  <div v-if="isPostPage && switchPageStyle" class="post-page bg-no-repeat bg-center bg-fixed bg-cover"
    :class="{ loadingStyle: isLoading }" :style="bgImg ? { 'background-image': `url(${bgImg})` } : {}">
    <div class="w-full flex justify-center">
      <div
        class="flex w-full max-w-screen-2xl justify-center items-start pt-0 my-0 gap-5 md:px-20 flex-col-reverse md:flex-row">
        <div class="bg-transparent w-full md:w-1/4 justify-start items-start py-14 mt-5 md:mt-5 flex-col gap-6">
          <div class="flex flex-col gap-6 w-full">
            <UserCard :isMobile="false" />
            <div v-if="showMetaCard"
              class="flex w-full md:rounded-2xl px-5 py-5 flex-col justify-center gap-3 dark:shadow-none shadow-lg border-2 border-[var(--blog-border-c)] bg-[var(--vp-c-blog-bg)]/95 backdrop-blur-md">
              <div class="flex items-center justify-between text-xs uppercase tracking-wider opacity-70">
                <span>Metadata</span>
                <span v-if="metaDateLabel" class="text-[11px] normal-case opacity-70">{{ metaDateLabel }}</span>
              </div>
              <div v-if="metaCategory" class="flex items-center gap-2 flex-wrap">
                <span class="text-[11px] uppercase opacity-70">{{ getLocalizedString('category', lang) || 'Category' }}</span>
                <span class="text-xs px-2.5 py-0.5 rounded-full border border-dashed border-[var(--blog-tag-text-2)] text-[var(--blog-tag-text-2)] bg-[var(--blog-tag-bg-2)]/80">
                  {{ metaCategory }}
                </span>
              </div>
              <div v-if="metaTags.length" class="flex items-center gap-2 flex-wrap">
                <span class="text-[11px] uppercase opacity-70">{{ getLocalizedString('tags', lang) || 'Tags' }}</span>
                <div class="flex items-center gap-2 flex-wrap">
                  <span
                    v-for="tag in metaTags"
                    :key="tag"
                    class="text-xs px-2.5 py-0.5 rounded-full border border-[var(--blog-tag-text-1)] text-[var(--blog-tag-text-1)] bg-[var(--blog-tag-bg-1)]/80">
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
            <div ref="asideSentinelEl" style="height:1px;"></div>
            <div ref="asideOutlineEl" v-show="!showFloatingOutline"
              class="min-h-28 max-h-[calc(100vh-20rem)] overflow-auto opacity-90 backdrop-blur-md flex w-full md:rounded-2xl px-5 py-5 flex-col justify-start dark:shadow-none shadow-lg border-2 border-[var(--blog-border-c)] bg-[var(--vp-c-blog-bg)]">
              <VPDocAsideOutline />
            </div>
          </div>
        </div>

        <div class="flex md:w-3/4 md:py-20 py-0 justify-center items-center gap-6 flex-col w-full md:px-3 px-0">
          <Layout class="w-full">
            <template #doc-before>
              <div class="text-3xl md:text-4xl font-bold tracking-tight">{{ title }}</div>
            </template>
            <template #doc-after>
              <Comment />
            </template>
          </Layout>
        </div>
      </div>
    </div>

    <!-- 浮动目录 -->
    <div v-show="showFloatingOutline" class="floating-outline" :style="{ top: (navHeight + 8) + 'px' }">
      <div class="floating-outline-inner">
        <VPDocAsideOutline />
      </div>
    </div>
  </div>

  <Layout v-else class="bg-no-repeat bg-center bg-fixed bg-cover"
    :style="bgImg ? { 'background-image': `url(${bgImg})` } : {}" :class="{ loadingStyle: isLoading }">
      <template #doc-before>
        <div class="text-3xl md:text-4xl font-bold tracking-tight">{{ title }}</div>
      </template>
      <template #doc-after>
        <Comment />
      </template>
  </Layout>
</template>

<script lang="ts" setup>
  import DefaultTheme from 'vitepress/theme';
  import { useData } from 'vitepress';
  import { useRoute } from 'vitepress/client';
  import { onMounted, onUnmounted, ref, watch, computed } from 'vue';
  import { getLocalizedString } from '../utils/constants';
  import Comment from '../components/Comment.vue';
  import UserCard from '../components/UserCard.vue';
  import VPDocAsideOutline from 'vitepress/dist/client/theme-default/components/VPDocAsideOutline.vue';

  const { Layout } = DefaultTheme;

  // TODO 优化
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const isLoading = ref(false);

  const { frontmatter, isDark, theme, lang } = useData<Open17Config>();
  const blogConfig = theme.value.blog;
  const title = computed(() => frontmatter.value?.title ?? null);
  const isBlogTop = ref<boolean>(frontmatter.value.layout === 'blog');
  const bgImg = ref<string | null>(null);
  const route = useRoute();

  const isPostPage = computed(() => route.path.startsWith('/posts/'));
  const switchPageStyle = ref<boolean>(true);

  const metaCategory = computed(() => frontmatter.value?.category || '');
  const metaTags = computed(() => (frontmatter.value?.tags || []) as string[]);
  const metaDate = computed(() => frontmatter.value?.date || '');
  const metaDateLabel = computed(() => {
    if (!metaDate.value) return '';
    const date = new Date(metaDate.value as any);
    if (Number.isNaN(date.getTime())) return String(metaDate.value);
    return date.toLocaleDateString(lang.value || 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  });
  const showMetaCard = computed(() => metaCategory.value || metaTags.value.length || metaDate.value);

  const togglePostPage = () => {
    switchPageStyle.value = !switchPageStyle.value;
  };


  const handleTopCheck = () => {
    isBlogTop.value = window.scrollY <= 50;
  };

  onMounted(() => {
    window.addEventListener('scroll', handleTopCheck, { passive: true });
    updateBgImg();
  });

  const trigger = computed(() => ({
    isDark: isDark.value,
    route: route.path,
  }));

  watch(trigger, () => {
    updateBgImg();
  });

  const updateBgImg = () => {
    bgImg.value = getBgImg();
  };

  const getBgImg = (): string | null => {
    const getBgImageByType = (imageType: 'dark' | 'light'): string | null => {
      const globalImage = typeof blogConfig?.bgImage === 'object'
        ? blogConfig?.bgImage[imageType]
        : blogConfig?.bgImage;
      const localImage = typeof frontmatter.value.bgImage === 'object'
        ? frontmatter.value.bgImage[imageType]
        : frontmatter.value.bgImage;
      return localImage || globalImage || null;
    };
    return isDark.value ? getBgImageByType('dark') : getBgImageByType('light');
  };

  // 浮动目录
  const showFloatingOutline = ref(false);
  const navHeight = ref(56);

  const asideSentinelEl = ref<HTMLElement | null>(null);
  // const asideOutlineEl = ref<HTMLElement | null>(null);

  // 仅文章页且宽屏启用
  const floatingEnabled = computed(() => {
    if (!isPostPage.value || !switchPageStyle.value) return false;
    if (typeof window === 'undefined') return false;
    return window.innerWidth >= 960; // 与默认断点一致
  });

  const updateNavHeight = () => {
    if (typeof document === 'undefined') return;
    const nav = document.querySelector<HTMLElement>('.VPNavBar');
    navHeight.value = (nav?.offsetHeight || 56);
  };

  const updateFloating = () => {
    if (!floatingEnabled.value) {
      showFloatingOutline.value = false;
      return;
    }
    const s = asideSentinelEl.value;
    if (!s) return;

    const rect = s.getBoundingClientRect();
    const threshold = navHeight.value + 8;

    // 滞后 6px，避免抖动
    const hysteresis = 6;

    if (!showFloatingOutline.value) {
      if (rect.top <= threshold - hysteresis) {
        showFloatingOutline.value = true;
      }
    } else {
      if (rect.top > threshold + hysteresis) {
        showFloatingOutline.value = false;
      }
    }
  };

  const handleScrollResize = () => {
    updateNavHeight();
    updateFloating();
  };

  onMounted(() => {
    updateNavHeight();
    updateFloating();
    window.addEventListener('scroll', updateFloating, { passive: true });
    window.addEventListener('resize', handleScrollResize, { passive: true });
  });

  // 路由/主题切换时重算
  watch(
    () => [isDark.value, route.path],
    () => {
      updateNavHeight();
      updateFloating();
    }
  );

  onUnmounted(() => {
    window.removeEventListener('scroll', handleTopCheck as any);
    window.removeEventListener('scroll', updateFloating as any);
    window.removeEventListener('resize', handleScrollResize as any);
  });
</script>

<style>
  #VPContent {
    background: #ffffff74;
  }

  .dark #VPContent {
    background: #1b1b1fc3;
  }

  #VPContent .aside-curtain {
    display: none;
  }

  .MathJax {
    overflow-y: hidden;
    overflow-x: auto;
  }

  /* 桌面修复 */
  @media (min-width: 960px) {
    .VPNavBar[data-v-cf6e7c5e]:not(.home) {
      background-color: var(--vp-nav-bg-color) !important;
    }
  }

  /* 文章页占满宽度 */
  @media (min-width: 960px) {
    .post-page #VPContent .VPDoc .container {
      max-width: 100% !important;
      display: block !important;
    }

    .post-page #VPContent .VPDoc .content {
      max-width: 100% !important;
      padding-left: 0 !important;
      padding-right: 0 !important;
    }
  }

  #Loading {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #000000;
    margin: 0;
    padding: 0%;
    z-index: 10000;
  }

  .loadingStyle {
    height: 100vh;
    width: 100vw;
    overflow: hidden;
  }

  .v-enter-active,
  .v-leave-active {
    transition: opacity 0.5s ease;
  }

  .v-enter-from,
  .v-leave-to {
    opacity: 0;
  }
</style>

<style>

  /* 文章页容器样式（桌面） */
  @media (min-width: 960px) {
    .post-page #VPContent {
      border: none;
      border-radius: 0.75rem;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      background: var(--vp-c-bg);
    }

    .post-page .VPLocalNav { display: none !important; }
    .post-page .VPDoc .aside { display: none !important; }

    .post-page .VPDoc{
      padding-left: 0;
      padding-right: 0;
    }

    .post-page .VPContent.has-sidebar {
      padding-left: 0 !important;
    }

    .post-page .VPFooter { display: none !important; }
    .post-page .VPSidebar { display: none !important; }
  }

  /* 移动端去除边距 */
  @media (max-width: 767px) {
    .post-page #VPContent,
    .post-page #VPContent .VPDoc,
    .post-page #VPContent .container {
      margin: 0 !important;
    }
  }
</style>

<style scoped>
  .post-page {
    background-color: var(--vp-c-bg-soft);
  }

  .layout-toggle-btn {
    width: 2.5rem;
    height: 2.5rem;
    background-color: var(--vp-c-brand-1);
    color: var(--vp-c-white);
    border-radius: 50%;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    transition: all 0.2s ease-in-out;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    cursor: pointer;
  }

  .layout-toggle-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.22);
  }

  .layout-toggle-btn:active {
    transform: scale(0.95);
  }

  /* 浮动目录样式 */
  .floating-outline {
    position: fixed;
    left: 16px;
    z-index: 60;
    width: 280px;
    pointer-events: auto;
  }

  .floating-outline-inner {
    opacity: 0.92;
    backdrop-filter: blur(6px);
    border-radius: 0.75rem;
    background: var(--vp-c-blog-bg);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    padding: 1.25rem;
    max-height: calc(100vh - 10rem);
    overflow: auto;
  }

  /* 小屏禁用 */
  @media (max-width: 959px) {
    .floating-outline { display: none; }
  }


</style>
