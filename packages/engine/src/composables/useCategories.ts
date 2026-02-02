import { computed, ref } from 'vue';
import { useSyncedQueryParam } from './useQueryParam';
import type { BlogPost } from '../types';

type CategoriesState = ReturnType<typeof createCategoriesState>;

const extractCategoryFromUrl = (url: string, otherLabel: string): string => {
  const match = url.match(/^\/posts\/([^/]+)\//);
  if (match && match[1]) return match[1];
  if (url.startsWith('/posts/') && /^\/posts\/[^/]+(\.html)?$/.test(url)) {
    return otherLabel;
  }
  return '';
};

const createCategoriesState = (posts: BlogPost[], otherLabel: string) => {
  const otherLabelRef = ref(otherLabel);

  const activeCategory = useSyncedQueryParam<string>({
    key: 'category',
    defaultValue: '',
    parse: (raw) => raw || '',
    serialize: (value) => (value ? value : null),
  });

  const getPostCategory = (post: BlogPost) => {
    const fmCategory = post.frontmatter?.category;
    if (fmCategory) return fmCategory;
    return extractCategoryFromUrl(post.url, otherLabelRef.value);
  };

  const categoriesMap = computed(() => {
    const map: Record<string, number> = { '': posts.length };
    posts.forEach((post) => {
      const category = getPostCategory(post);
      if (category) {
        map[category] = (map[category] || 0) + 1;
      }
    });
    return map;
  });

  const getCategoryArray = () => {
    const arr = Object.entries(categoriesMap.value);
    arr.sort((a, b) => {
      if (a[0] === '') return -1;
      if (b[0] === '') return 1;
      return (b[1] as number) - (a[1] as number);
    });
    return arr;
  };

  const uniqueCategoryCount = computed(() => {
    const set = new Set<string>();
    Object.keys(categoriesMap.value).forEach((k) => {
      if (k) set.add(k);
    });
    return set.size;
  });

  const filterPostsByActiveCategory = (category?: string) => {
    const c = category ?? activeCategory.value;
    if (!c) return posts;
    return posts.filter((item) => getPostCategory(item) === c);
  };

  return {
    categoriesMap,
    activeCategory,
    getCategoryArray,
    uniqueCategoryCount,
    filterPostsByActiveCategory,
    getCategoryFromUrl: (url: string) => extractCategoryFromUrl(url, otherLabelRef.value),
    updateOtherLabel: (label: string) => {
      otherLabelRef.value = label;
    },
  } as const;
};

export const createCategoriesStore = (posts: BlogPost[]) => {
  let sharedState: CategoriesState | null = null;
  return (options?: { otherLabel?: string }) => {
    const otherLabel = options?.otherLabel || 'Other';
    if (!sharedState) {
      sharedState = createCategoriesState(posts, otherLabel);
    } else if (options?.otherLabel) {
      sharedState.updateOtherLabel(options.otherLabel);
    }
    return sharedState;
  };
};
