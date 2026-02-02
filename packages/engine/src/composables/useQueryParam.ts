import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vitepress/client';
import { getQueryParam, setQueryParam } from '../utils/url';

type Parser<T> = (raw: string | null) => T;
type Serializer<T> = (value: T) => string | null;

interface SyncedQueryParamOptions<T> {
  key: string;
  defaultValue: T;
  parse?: Parser<T>;
  serialize?: Serializer<T>;
}

export const useSyncedQueryParam = <T>(
  options: SyncedQueryParamOptions<T>
) => {
  const { key, defaultValue, parse, serialize } = options;
  const route = useRoute();
  const state = ref<T>(defaultValue) as { value: T };

  const read = () => {
    const raw = getQueryParam(key);
    const next = parse ? parse(raw) : ((raw ?? defaultValue) as T);
    state.value = next;
  };

  const write = (value: T) => {
    const current = getQueryParam(key);
    const next = serialize
      ? serialize(value)
      : (value === (defaultValue as any) ? null : String(value));
    if (next === current || (next === null && current === null)) return;
    setQueryParam(key, next, { replace: true });
  };

  const canUseDom = typeof window !== 'undefined';
  if (canUseDom) read();

  watch(
    () => route.path,
    () => {
      if (canUseDom) read();
    }
  );

  watch(
    state,
    (value) => {
      if (canUseDom) write(value);
    },
    { deep: false }
  );

  onMounted(() => {
    if (!canUseDom) return;
    window.addEventListener('popstate', read, { passive: true } as any);
  });

  onUnmounted(() => {
    if (!canUseDom) return;
    window.removeEventListener('popstate', read as any);
  });

  return state;
};
