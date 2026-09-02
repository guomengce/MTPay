<template>
  <section class="order-header">
    <div class="order-header__identity">
      <small>{{ t('withdrawal.orderEyebrow') }}</small>
      <div>
        <h1>{{ detail.order_no }}</h1>
        <button type="button" :title="t('withdrawal.copyOrder')" :aria-label="t('withdrawal.copyOrder')" @click="copyOrderNo">
          <i class="ri-file-copy-line" />
        </button>
      </div>
    </div>

    <div class="order-header__meta">
      <span><small>{{ t('withdrawal.submittedAt') }}</small><strong>{{ detail.submitted_at || '—' }}</strong></span>
      <span><small>{{ t('withdrawal.updatedAt') }}</small><strong>{{ detail.updated_at || '—' }}</strong></span>
    </div>

    <StatusBadge :label="detail.status_name" :type="statusType" :effect="statusEffect" />
  </section>
</template>

<script setup lang="ts">
/** 法币出金订单顶部信息栏：只展示订单标识、时间和状态。 */
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';

import type { WithdrawalOrderDetail } from '@/api/modules/withdrawal';
import StatusBadge from '@/components/admin/StatusBadge.vue';
import type { StatusBadgeEffect, StatusBadgeType } from '@/components/admin/StatusBadge.vue';

const props = defineProps<{
  detail: WithdrawalOrderDetail;
  statusType: StatusBadgeType;
  statusEffect?: StatusBadgeEffect;
}>();

async function copyOrderNo() {
  try {
    await navigator.clipboard.writeText(props.detail.order_no);
    ElMessage.success(t('withdrawal.orderCopied'));
  } catch {
    ElMessage.error(t('withdrawal.copyFailed'));
  }
}
const { t } = useI18n();
</script>

<style scoped lang="scss">
.order-header {
  display: grid;
  min-width: 0;
  align-items: center;
  padding: 18px 22px;
  border: 1px solid #dce7ef;
  border-radius: 15px;
  background: #fff;
  box-shadow: 0 8px 24px rgb(20 46 78 / 5%);
  grid-template-columns: minmax(0, 1fr) auto auto;
  gap: 28px;

  &__identity {
    min-width: 0;

    > small { color: #77889c; font-size: 11px; font-weight: 600; }
    > div { display: flex; min-width: 0; align-items: center; gap: 8px; margin-top: 4px; }
    h1 { margin: 0; color: #10243d; font-size: clamp(18px, 2vw, 23px); font-weight: 720; line-height: 1.3; overflow-wrap: anywhere; }
    button { display: grid; width: 27px; height: 27px; flex: 0 0 27px; padding: 0; place-items: center; border: 1px solid #dce6ed; border-radius: 8px; color: #668098; background: #f8fafc; cursor: pointer; }
    button:hover { border-color: #a9dcd8; color: #078f89; background: #f0faf9; }
  }

  &__meta {
    display: grid;
    width: min(38vw, 460px);
    min-width: 360px;
    align-items: start;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 28px;

    span { display: grid; min-width: 0; gap: 5px; }
    small { color: #718399; font-size: 12px; }
    strong { color: #20364e; font-size: 14px; font-weight: 650; white-space: nowrap; }
  }
}

@include mobile {
  .order-header { align-items: flex-start; padding: 16px; grid-template-columns: minmax(0, 1fr) auto; gap: 14px; }
  .order-header__meta { width: 100%; min-width: 0; grid-column: 1 / -1; grid-template-columns: 1fr; gap: 12px; }
}
</style>
