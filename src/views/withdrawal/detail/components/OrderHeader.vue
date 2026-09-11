<template>
  <header class="wd-heading">
    <div>
      <h1>{{ t('menu.withdrawalDetail') }}</h1>
      <p class="wd-number">{{ detail.order_no }}</p>
    </div>
    <div class="wd-reference">
      <StatusBadge
        :label="statusLabel"
        :type="statusType"
        :effect="[0, 1, 2].includes(detail.status) ? 'pending' : undefined"
      /><span>{{ t('withdrawal.submittedAt') }} · {{ detail.submitted_at || '—' }}</span>
    </div>
  </header>
</template>
<script setup lang="ts">
import { computed, toRef } from 'vue';
import { useI18n } from 'vue-i18n';
import type { WithdrawalOrderDetail } from '@/api/modules/withdrawal';
const props = defineProps<{ detail: WithdrawalOrderDetail }>();
const detail = toRef(props, 'detail');
const { t } = useI18n();
import StatusBadge, { type StatusBadgeType } from '@/components/admin/StatusBadge.vue';
const statusLabel = computed(() => {
  const keys = ['pending', 'filesRequired', 'processing', 'completed', 'rejected', 'failed'];
  const key = keys[detail.value?.status ?? 0];
  return key ? t(`withdrawal.${key}`) : detail.value?.status_name || '—';
});
const statusType = computed<StatusBadgeType>(() =>
  detail.value?.status === 3
    ? 'success'
    : [4, 5].includes(detail.value?.status ?? 0)
      ? 'danger'
      : 'warning',
);
</script>
