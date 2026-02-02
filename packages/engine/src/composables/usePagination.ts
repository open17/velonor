import { computed, ref, watch, type ComputedRef } from 'vue';
import { useSyncedQueryParam } from './useQueryParam';
import { DEFAULT_PAGE_GROUP_SIZE } from '../constants';

interface PaginationOptions {
  pageSize: number | ComputedRef<number>;
  pageGroupSize?: number;
  pageParam?: string;
}

export const usePagination = <T>(
  items: ComputedRef<T[]>,
  options: PaginationOptions
) => {
  const pageParam = options.pageParam ?? 'page';
  const pageSize = computed(() =>
    typeof options.pageSize === 'number' ? options.pageSize : options.pageSize.value
  );

  const currentPage = useSyncedQueryParam<number>({
    key: pageParam,
    defaultValue: 1,
    parse: (raw) => {
      const n = Number.parseInt(raw || '1', 10);
      return Number.isFinite(n) && n > 0 ? n : 1;
    },
    serialize: (value) => (value <= 1 ? null : String(value)),
  });

  const totalPages = computed(() => {
    if (!items.value.length) return 0;
    return Math.ceil(items.value.length / pageSize.value);
  });

  watch(
    totalPages,
    (count) => {
      if (count === 0) {
        currentPage.value = 1;
      } else if (currentPage.value > count) {
        currentPage.value = count;
      }
    },
    { immediate: true }
  );

  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return items.value.slice(start, end);
  });

  const pageRange = computed(() => {
    const count = totalPages.value;
    if (count <= 1) return [] as number[];
    const groupSize = Math.max(3, options.pageGroupSize || DEFAULT_PAGE_GROUP_SIZE);
    const half = Math.floor(groupSize / 2);
    let start = Math.max(1, currentPage.value - half);
    let end = Math.min(count, start + groupSize - 1);
    start = Math.max(1, end - groupSize + 1);
    const pages: number[] = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  });

  const setPage = (page: number) => {
    const count = totalPages.value || 1;
    const target = Math.min(Math.max(page, 1), count);
    currentPage.value = target;
  };

  const nextPage = () => setPage(currentPage.value + 1);
  const prevPage = () => setPage(currentPage.value - 1);

  const jumpInput = ref('');
  const jumpToInput = () => {
    const n = Number.parseInt(jumpInput.value, 10);
    if (!Number.isFinite(n)) return;
    setPage(n);
  };

  return {
    currentPage,
    totalPages,
    pageRange,
    paginatedItems,
    setPage,
    nextPage,
    prevPage,
    jumpInput,
    jumpToInput,
  } as const;
};
