<template>
  <section class="order-header">
    <div class="order-header__identity">
      <small>USD 出金订单</small>
      <div>
        <h1>{{ detail.order_no }}</h1>
        <button type="button" title="复制订单号" aria-label="复制订单号" @click="copyOrderNo">
          <i class="ri-file-copy-line" />
        </button>
      </div>
    </div>

    <div class="order-header__meta">
      <span><small>提交时间</small><strong>{{ detail.submitted_at || '—' }}</strong></span>
      <span><small>最后更新</small><strong>{{ detail.updated_at || '—' }}</strong></span>
    </div>

    <StatusBadge :label="detail.status_name" :type="statusType" :effect="statusEffect" />
  </section>
</template>

<script setup lang="ts">
/** 出金订单顶部信息栏：只展示订单标识、时间和状态。 */
import { ElMessage } from 'element-plus';

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
    ElMessage.success('订单号已复制');
  } catch {
    ElMessage.error('复制失败，请手动复制');
  }
}
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
    display: flex;
    align-items: center;
    gap: 26px;

    span { display: grid; gap: 3px; }
    small { color: #7b8b9f; font-size: 10px; }
    strong { color: #30475f; font-size: 12px; font-weight: 600; white-space: nowrap; }
  }
}

@include mobile {
  .order-header { align-items: flex-start; padding: 16px; grid-template-columns: minmax(0, 1fr) auto; gap: 14px; }
  .order-header__meta { align-items: flex-start; flex-direction: column; grid-column: 1 / -1; gap: 9px; }
}
</style>
