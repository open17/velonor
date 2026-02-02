import { ref, watch, nextTick } from 'vue';
import { useRoute } from 'vitepress/client';

export function useRefreshOnRouteChange() {
  const route = useRoute();
  const refreshFlag = ref<boolean>(false);
  watch(
    route,
    () => {
      refreshFlag.value = false;
      nextTick(() => {
        refreshFlag.value = true;
      });
    },
    {
      immediate: true,
    }
  );
  return { refreshFlag };
}
