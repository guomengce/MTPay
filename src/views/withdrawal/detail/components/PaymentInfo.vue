<template>
  <div
    v-if="paymentFields.length"
    class="wd-review"
    :class="{ 'wd-review--failed': detail.status === 5 }"
  >
    <h2><i class="ri-bank-card-line" />{{ t('withdrawal.paymentInfo') }}</h2>
    <dl class="wd-review__fields">
      <div v-for="field in paymentFields" :key="field.key">
        <dt>{{ field.label }}</dt>
        <dd>{{ field.value }}</dd>
      </div>
    </dl>
  </div>
</template>
<script setup lang="ts">
import { computed, toRef } from 'vue';
import { useI18n } from 'vue-i18n';
import type { WithdrawalOrderDetail } from '@/api/modules/withdrawal';
const props = defineProps<{ detail: WithdrawalOrderDetail }>();
const detail = toRef(props, 'detail');
const { t } = useI18n();
type Field = { key: string; label: string; value: string };
function nonemptyFields(data: Record<string, unknown>, labels: Record<string, string>): Field[] {
  return Object.entries(labels)
    .filter(([key]) => data[key] != null && data[key] !== '')
    .map(([key, label]) => ({ key, label: t(label), value: String(data[key]) }));
}
const paymentFields = computed(() =>
  detail.value
    ? nonemptyFields(detail.value.payment, {
        admin_name: 'withdrawal.paymentOperator',
        processing_at: 'withdrawal.paymentProcessingAt',
        completed_at: 'withdrawal.paymentCompletedAt',
        failed_at: 'withdrawal.paymentFailedAt',
        failure_reason: 'withdrawal.paymentFailureReason',
      })
    : [],
);
</script>
