import { onBeforeUnmount, watch, type Ref } from 'vue';
import { usePageLoadingStore } from '@/stores/modules/pageLoading';

/** 将页面级异步状态映射到 Header 下方进度条。 */
export function usePageLoading(source: Ref<boolean>) {
  const store = usePageLoadingStore();
  let tracked = false;
  watch(source, (loading) => {
    if (loading && !tracked) { tracked = true; store.start(); }
    if (!loading && tracked) { tracked = false; store.finish(); }
  }, { immediate: true });
  onBeforeUnmount(() => { if (tracked) store.finish(); });
}
