<template>
  <div>
    <template v-if="!readonly">
      <div v-for="action in supplementActions" :key="action.mode" class="wd-request">
        <div class="wd-request__copy">
          <h2>
            <i class="ri-file-warning-line" />{{ t('whitelistReview.adminSupplementRequirement') }}
          </h2>
          <p>{{ action.requirement }}</p>
        </div>
        <el-button type="warning" :icon="Upload" @click="emit('supplement', action.mode)">{{
          t('withdrawal.supplement')
        }}</el-button>
      </div>
    </template>
    <div v-if="reviewFields.length" class="wd-review">
      <h2><i class="ri-shield-check-line" />{{ t('withdrawal.reviewInfo') }}</h2>
      <dl class="wd-review__fields">
        <div v-for="field in reviewFields" :key="field.key">
          <dt>{{ field.label }}</dt>
          <dd>{{ field.value }}</dd>
        </div>
      </dl>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, toRef } from 'vue';
import { useI18n } from 'vue-i18n';
import type { WithdrawalOrderDetail } from '@/api/modules/withdrawal';
const props = defineProps<{ detail: WithdrawalOrderDetail; readonly?: boolean }>();
const detail = toRef(props, 'detail');
const { t } = useI18n();
import { Upload } from '@element-plus/icons-vue';
type Mode = 'business' | 'risk';
type Field = { key: string; label: string; value: string };
const emit = defineEmits<{ supplement: [mode: Mode] }>();
const supplementActions = computed(() => {
  const actions: { mode: Mode; requirement: string }[] = [];
  if (detail.value?.available_actions?.can_supplement_withdrawal === true)
    actions.push({
      mode: 'business',
      requirement: detail.value.supplement_request || t('withdrawal.defaultSupplement'),
    });
  if (detail.value?.risk?.can_supplement_risk === true)
    actions.push({
      mode: 'risk',
      requirement: customerText(
        detail.value.risk.risk_supplement_request || t('withdrawal.defaultSupplement'),
      ),
    });
  return actions;
});
function customerText(value: string) {
  return value
    .replace(/風控|风控/g, '平台')
    .replace(/risk\s+(?:control|review)/gi, 'platform')
    .replace(/\brisk\b/gi, 'platform');
}
function nonemptyFields(data: Record<string, unknown>, labels: Record<string, string>): Field[] {
  return Object.entries(labels)
    .filter(([key]) => data[key] != null && data[key] !== '')
    .map(([key, label]) => ({ key, label: t(label), value: String(data[key]) }));
}
const reviewFields = computed(() =>
  detail.value
    ? nonemptyFields(detail.value.review, {
        admin_name: 'withdrawal.reviewer',
        reviewed_at: 'withdrawal.reviewedAt',
        note: detail.value.status === 4 ? 'withdrawal.rejectionReason' : 'withdrawal.reviewNote',
      })
    : [],
);
</script>
