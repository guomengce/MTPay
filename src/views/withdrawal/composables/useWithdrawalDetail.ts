import { ref } from 'vue';
import { fetchWithdrawalDetail } from '@/api/modules/withdrawal';
import type { WithdrawalOrderDetail } from '@/api/modules/withdrawal';
/** 直接读取出金接口的 payer.data/payee.data，不补查白名单。 */
export function useWithdrawalDetail() {
  const loading = ref(false);
  const detail = ref<WithdrawalOrderDetail | null>(null);
  let version = 0;
  async function fetchDetail(id: number) {
    const current = ++version;
    loading.value = true;
    try {
      const result = await fetchWithdrawalDetail(id);
      if (current === version) detail.value = result;
    } finally {
      if (current === version) loading.value = false;
    }
  }
  function clear() {
    version++;
    detail.value = null;
    loading.value = false;
  }
  return { loading, detail, fetchDetail, clear };
}
