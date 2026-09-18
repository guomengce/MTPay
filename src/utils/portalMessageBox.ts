import { i18n } from '@/locales';
import { ElMessageBox } from 'element-plus';
import type { VNode } from 'vue';

interface PortalConfirmOptions {
  title: string;
  message: string | VNode;
  confirmText?: string;
  cancelText?: string;
}

/** 代理端统一确认框；取消或关闭时返回 false。 */
export async function confirmPortalAction({
  title,
  message,
  confirmText = i18n.global.t('common.actions.confirm'),
  cancelText = i18n.global.t('common.actions.cancel'),
}: PortalConfirmOptions): Promise<boolean> {
  try {
    await ElMessageBox.confirm(message, title, {
      type: 'info',
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      closeOnClickModal: false,
    });
    return true;
  } catch {
    return false;
  }
}
