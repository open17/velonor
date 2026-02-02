import { computed, ref, watch } from 'vue';
import { useRoute } from 'vitepress/client';
import { useTags } from './useTags';

type TagFilterState = ReturnType<typeof createTagFilterState>;

const parseTagsParam = (value: string | null): string[] => {
  if (!value) return [];
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

const createTagFilterState = () => {
  const route = useRoute();
  const { activeTag, getTagArray, uniqueTagCount, tagsMap, filterPostsByActiveTag } = useTags();
  const selectedTags = ref<string[]>([]);

  const readFromUrl = () => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    const tagsParam = url.searchParams.get('tags');
    const tagParam = url.searchParams.get('tag');
    const next = tagsParam ? parseTagsParam(tagsParam) : (tagParam ? [tagParam] : []);
    const uniqueNext = Array.from(new Set(next));
    if (JSON.stringify(uniqueNext) !== JSON.stringify(selectedTags.value)) {
      selectedTags.value = uniqueNext;
    }
    activeTag.value = uniqueNext.length === 1 ? uniqueNext[0] : '';
  };

  const writeToUrl = (tags: string[]) => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    const uniqueTags = Array.from(new Set(tags));
    if (uniqueTags.length === 0) {
      url.searchParams.delete('tags');
      url.searchParams.delete('tag');
    } else {
      url.searchParams.set('tags', uniqueTags.join(','));
      if (uniqueTags.length === 1) {
        url.searchParams.set('tag', uniqueTags[0]);
      } else {
        url.searchParams.delete('tag');
      }
    }
    window.history.replaceState(null, '', url.toString());
  };

  const setSelectedTags = (tags: string[]) => {
    const uniqueTags = Array.from(new Set(tags));
    selectedTags.value = uniqueTags;
    activeTag.value = uniqueTags.length === 1 ? uniqueTags[0] : '';
    writeToUrl(uniqueTags);
  };

  const addTag = (tag: string) => {
    if (!tag) return;
    if (selectedTags.value.includes(tag)) return;
    setSelectedTags([...selectedTags.value, tag]);
  };

  const removeTag = (tag: string) => {
    if (!selectedTags.value.includes(tag)) return;
    setSelectedTags(selectedTags.value.filter((t) => t !== tag));
  };

  const toggleTag = (tag: string) => {
    if (!tag) {
      setSelectedTags([]);
      return;
    }
    if (selectedTags.value.includes(tag)) {
      removeTag(tag);
    } else {
      addTag(tag);
    }
  };

  const clearTags = () => {
    setSelectedTags([]);
  };

  const isTagSelected = (tag: string) => {
    if (!tag) return selectedTags.value.length === 0;
    return selectedTags.value.includes(tag);
  };

  watch(
    () => route.path,
    () => readFromUrl()
  );

  if (typeof window !== 'undefined') {
    readFromUrl();
    window.addEventListener('popstate', readFromUrl, { passive: true } as any);
  }

  return {
    selectedTags,
    getTagArray,
    uniqueTagCount,
    tagsMap,
    filterPostsByActiveTag,
    setSelectedTags,
    addTag,
    removeTag,
    toggleTag,
    clearTags,
    isTagSelected,
  } as const;
};

let sharedState: TagFilterState | null = null;

export const useTagFilter = () => {
  if (!sharedState) sharedState = createTagFilterState();
  return sharedState;
};
