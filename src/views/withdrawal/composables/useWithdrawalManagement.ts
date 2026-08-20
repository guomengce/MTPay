/**
 * 出金模块组合入口
 * - 串联配置 / 列表 / 详情 / 表单 / 补件 / 附件；
 * - 提交/补件成功后由列表 composable 触发刷新。
 */
import { useWithdrawalConfig } from './useWithdrawalConfig';
import { useWithdrawalDetail } from './useWithdrawalDetail';
import { useWithdrawalFiles } from './useWithdrawalFiles';
import { useWithdrawalForm } from './useWithdrawalForm';
import { useWithdrawalList } from './useWithdrawalList';
import { useWithdrawalSupplement } from './useWithdrawalSupplement';

export function useWithdrawalManagement() {
  const config = useWithdrawalConfig();
  const list = useWithdrawalList();
  const detail = useWithdrawalDetail();
  const form = useWithdrawalForm();
  const supplement = useWithdrawalSupplement();
  const files = useWithdrawalFiles();

  return {
    config: config.config,
    balance: config.balance,
    configLoading: config.loading,
    loadConfig: config.loadConfig,

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

    withdrawalSubmitting: form.submitting,
    withdrawalUploading: form.uploading,
    submitWithdrawal: form.submit,
    uploadWithdrawalFile: form.uploadFile,
    clearWithdrawalResult: form.clearLast,

    supplementSubmitting: supplement.submitting,
    supplementUploading: supplement.uploading,
    submitSupplement: supplement.submit,
    uploadSupplementFile: supplement.uploadFile,
    clearSupplementResult: supplement.clearLast,

    fileLoading: files.loading,
    openFilePreview: files.openPreview,
    downloadFile: files.triggerDownload,
  };
}
