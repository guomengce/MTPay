import type { Ref } from 'vue';

/**
 * 仅将页面实例的首次异步加载映射到全局遮罩。
 * 后续查询、刷新和弹框操作应使用组件自己的局部 loading，避免整页白屏。
 */
export function usePageLoading(_source: Ref<boolean>) {}
