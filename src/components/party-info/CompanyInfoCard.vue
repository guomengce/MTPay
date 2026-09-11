<template>
  <article class="party-card" :class="[tone, { 'is-english': locale === 'en-US' }]">
    <header v-if="showHeader">
      <div class="party-card__title">
        <i />
        <h3>{{ title }}</h3>
      </div>
      <div class="party-card__actions">
        <IdentityBadge v-if="role && entityType" :role="role" :entity-type="entityType" /><el-button
          v-if="showCopy"
          circle
          plain
          size="small"
          :icon="DocumentCopy"
          :aria-label="t('withdrawal.copyParty')"
          @click="copyAll"
        />
      </div>
    </header>
    <dl class="party-card__fields">
      <div v-for="field in fields" :key="field.key">
        <dt>{{ field.label }}</dt>
        <dd :class="{ 'is-mono': field.mono }">{{ field.value }}</dd>
      </div>
    </dl>
  </article>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { ElMessage } from 'element-plus';
import { DocumentCopy } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';
import IdentityBadge from '@/components/admin/IdentityBadge.vue';
import { formatPartyFields } from './fields';
const props = withDefaults(
  defineProps<{
    data: Record<string, unknown>;
    role?: 1 | 2;
    title?: string;
    showCopy?: boolean;
    showHeader?: boolean;
  }>(),
  { role: 2, showCopy: true, showHeader: true },
);
const { t, locale } = useI18n();
const entityType = 1;
const tone = computed(() => (props.role === 1 ? 'is-payer' : 'is-payee'));
const title = computed(() => props.title || t('whitelist.companyInfo'));
const payerKeys = [
  'company_name',
  'registration_country',
  'operating_country',
  'city',
  'address',
  'registration_date',
  'company_type',
  'document_no',
];
const payeeKeys = ['company_name', 'operating_country', 'city', 'address'];
const fields = computed(() =>
  formatPartyFields(props.data, props.role === 1 ? payerKeys : payeeKeys, t, locale.value, true),
);
async function copyAll() {
  const copyFields = fields.value;
  const content = copyFields.map((item) => `${item.label}：${item.value}`).join('\n');
  try {
    await navigator.clipboard.writeText(content);
    ElMessage.success(t('withdrawal.partyCopied'));
  } catch {
    ElMessage.error(t('withdrawal.copyFailed'));
  }
}
</script>
<style scoped lang="scss" src="./party-info.scss"></style>
