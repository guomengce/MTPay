/**
 * 入金模块组合入口
 * - 串联入金列表 / 详情 / 申请表单 / 通道加载；
 * - 列表刷新由表单和详情在操作成功后触发；
 * - 复杂副作用集中在各子 composable，组合层只做转发。
 */
import { useDepositChannel } from './useDepositChannel';
import { useDepositDetail } from './useDepositDetail';
import { useDepositForm } from './useDepositForm';
import { useDepositList } from './useDepositList';

export function useDepositManagement() {
  const channel = useDepositChannel();
  const list = useDepositList();
  const detail = useDepositDetail();
  const form = useDepositForm();

  return {
    channels: channel.channels,
    channelLoading: channel.loading,
    loadChannels: channel.loadChannels,

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

    detail: detail.detail,
    detailLoading: detail.loading,
    fetchDetail: detail.fetchDetail,
    clearDetail: detail.clear,

    submitting: form.submitting,
    lastResult: form.lastResult,
    submitDeposit: form.submit,
    clearLastResult: form.clearLast,
  };
}
