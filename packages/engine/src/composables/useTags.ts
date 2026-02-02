import { computed } from 'vue';
import { useSyncedQueryParam } from './useQueryParam';
import type { BlogPost } from '../types';

type TagsState = ReturnType<typeof createTagsState>;

const createTagsState = (posts: BlogPost[]) => {
  const activeTag = useSyncedQueryParam<string>({
    key: 'tag',
    defaultValue: '',
    parse: (raw) => raw || '',
    serialize: (value) => (value ? value : null),
  });

  const tagsMap = computed(() => {
    const map: Record<string, number> = { '': posts.length };
    posts.forEach((post) => {
      const tags = post.frontmatter.tags as string[] | undefined;
      if (tags) {
        tags.forEach((tag) => {
          map[tag] = (map[tag] || 0) + 1;
        });
      }
    });
    return map;
  });

  const getTagArray = () => {
    const arr = Object.entries(tagsMap.value);
    arr.sort((a, b) => (b[1] as number) - (a[1] as number));
    return arr;
  };

  const uniqueTagCount = computed(() => {
    const set = new Set<string>();
    Object.keys(tagsMap.value).forEach((k) => {
      if (k) set.add(k);
    });
    return set.size;
  });

  const filterPostsByActiveTag = (tag?: string) => {
    const t = tag ?? activeTag.value;
    if (!t) return posts;
    return posts.filter(
      (item) => item.frontmatter.tags && item.frontmatter.tags.includes(t)
    );
  };

  return {
    tagsMap,
    activeTag,
    getTagArray,
    uniqueTagCount,
    filterPostsByActiveTag,
  } as const;
};

export const createTagsStore = (posts: BlogPost[]) => {
  let sharedState: TagsState | null = null;
  return () => {
    if (!sharedState) sharedState = createTagsState(posts);
    return sharedState;
  };
};
