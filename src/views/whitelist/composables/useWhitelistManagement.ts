/**
 * 白名单模块组合入口
 * - 串联列表 / 详情 / 提交 / 补件 / 文件预览；
 * - 显式命名组合字段，避免对象展开冲突；
 * - 提交/补件成功后由页面级编排刷新列表与详情。
 */
import { useWhitelistActions } from './useWhitelistActions';
import { useWhitelistDetail } from './useWhitelistDetail';
import { useWhitelistFiles } from './useWhitelistFiles';
import { useWhitelistForm } from './useWhitelistForm';
import { useWhitelistList } from './useWhitelistList';
import { useWhitelistPreview } from './useWhitelistPreview';
import { useWhitelistSupplement } from './useWhitelistSupplement';

export function useWhitelistManagement() {
  const list = useWhitelistList();
  const detail = useWhitelistDetail();
  const form = useWhitelistForm();
  const supplement = useWhitelistSupplement();
  const files = useWhitelistFiles();
  const preview = useWhitelistPreview();
  const actions = useWhitelistActions();

  return {
    // 列表
    list: list.list,
    total: list.total,
    page: list.page,
    limit: list.limit,
    role: list.role,
    entityType: list.entityType,
    status: list.status,
    listLoading: list.loading,
    fetchList: list.fetchList,
    setPage: list.setPage,
    setLimit: list.setLimit,
    applyFilters: list.applyFilters,
    refreshList: list.refresh,

    // 详情
    detail: detail.detail,
    detailLoading: detail.loading,
    fetchDetail: detail.fetchDetail,
    clearDetail: detail.clear,

    // 提交
    submitSubmitting: form.submitting,
    submitUploading: form.uploading,
    submitWhitelist: form.submit,

    // 补件
    supplementSubmitting: supplement.submitting,
    supplementUploading: supplement.uploading,
    submitSupplement: supplement.submit,

    // 附件预览/下载（共享 loading 避免冲突）
    fileLoading: preview.loading,
    openFilePreview: preview.openPreview,
    downloadFile: preview.triggerDownload,
    uploadFile: files.uploadFile,

    // 卡片操作
    actionSubmitting: actions.submitting,
    editWhitelist: actions.edit,
    deleteWhitelist: actions.remove,
    updateWhitelistStatus: actions.updateStatus,
  };
}


