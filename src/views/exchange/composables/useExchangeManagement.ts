/**
 * 兑换模块组合入口
 * - 串联兑换配置 / 列表 / 表单；详情由独立路由页面负责；
 * - 提交/审核成功后由列表 composable 触发刷新。
 */
import { useExchangeConfig } from './useExchangeConfig';
import { useExchangeForm } from './useExchangeForm';
import { useExchangeList } from './useExchangeList';

export function useExchangeManagement() {
  const config = useExchangeConfig();
  const list = useExchangeList();
  const form = useExchangeForm();

  return {
    config: config.config,
    configLoading: config.loading,
    loadConfig: config.loadConfig,
    findBalance: config.findBalance,
    findRate: config.findRate,

    list: list.list,
    total: list.total,
    page: list.page,
    limit: list.limit,
    query: list.query,
    listLoading: list.loading,
    fetchList: list.fetchList,
    resetQuery: list.resetQuery,
    setPage: list.setPage,
    refreshList: list.refresh,

    submitting: form.submitting,
    lastResult: form.lastResult,
    submitExchange: form.submit,
    clearLastResult: form.clearLast,
  };
}
