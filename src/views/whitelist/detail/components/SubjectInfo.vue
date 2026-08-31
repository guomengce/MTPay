<template>
  <DetailCard
    class="subject-info"
    :title="t('whitelist.subjectInfo')"
    icon="ri-profile-line"
  >
    <div class="subject-info__tags">
      <IdentityBadge :role="role" :entity-type="entityType" />
    </div>

    <div class="subject-info__sections whitelist-subject-info">
      <section class="subject-section">
        <header class="subject-section__header">
          <span class="subject-section__icon"><i :class="subjectIcon" /></span>
          <div><h3>{{ subjectTitle }}</h3></div>
        </header>
        <dl class="subject-section__grid">
          <div v-for="field in subjectFields" :key="field.key" :class="fieldClass(field)">
            <dt>{{ field.label }}</dt>
            <dd :class="{ 'is-mono': field.mono }">{{ field.value }}</dd>
          </div>
        </dl>
      </section>

      <BankInfo v-if="role === 2" :fields="payeeBankFields" />
    </div>
  </DetailCard>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
/** 公司/个人的基础资料与地址资料合并展示，银行资料保持独立区块。 */
import DetailCard from '@/components/detail/DetailCard.vue';
import IdentityBadge from '@/components/admin/IdentityBadge.vue';
import type { WhitelistDetailField } from '../../composables/useWhitelistDetailView';

import BankInfo from './subject/BankInfo.vue';

const props = defineProps<{
  role: 1 | 2;
  entityType: 1 | 2;
  roleName: string;
  entityTypeName: string;
  companyIdentityFields: WhitelistDetailField[];
  registrationFields: WhitelistDetailField[];
  payerIndividualIdentityFields: WhitelistDetailField[];
  payerIndividualResidenceFields: WhitelistDetailField[];
  payeeCompanyFields: WhitelistDetailField[];
  payeeCompanyLocationFields: WhitelistDetailField[];
  payeeIndividualIdentityFields: WhitelistDetailField[];
  payeeIndividualResidenceFields: WhitelistDetailField[];
  payeeBankFields: WhitelistDetailField[];
}>();
const { t } = useI18n();
const subjectFields = computed(() => {
  if (props.entityType === 1) {
    return props.role === 1
      ? [...props.companyIdentityFields, ...props.registrationFields]
      : [...props.payeeCompanyFields, ...props.payeeCompanyLocationFields];
  }
  return props.role === 1
    ? [...props.payerIndividualIdentityFields, ...props.payerIndividualResidenceFields]
    : [...props.payeeIndividualIdentityFields, ...props.payeeIndividualResidenceFields];
});
const subjectTitle = computed(() => t(props.entityType === 1 ? 'whitelist.companyInfo' : 'whitelist.personalInfo'));
const subjectIcon = computed(() => props.entityType === 1 ? 'ri-building-2-line' : 'ri-id-card-line');
function fieldClass(field: WhitelistDetailField) {
  return { 'is-wide': field.wide, 'is-missing': field.missing };
}
</script>

<style scoped lang="scss">
.subject-info__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: -4px 0 14px;

}

.subject-info__sections { display: grid; gap: 12px; }
</style>

<!-- 子资料均为独立组件，使用有命名空间的公共样式，避免 scoped 跨组件失效。 -->
<style lang="scss">
.whitelist-subject-info .subject-section {
  min-width: 0;
  padding: 16px;
  border-radius: 13px;
  background: #f5f8fb;
}

.whitelist-subject-info .subject-section__header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;

  h3 { margin: 0; color: #17324f; font-size: 15px; }
  p { margin: 3px 0 0; color: #718298; font-size: 11px; }
}

.whitelist-subject-info .subject-section__icon {
  display: grid;
  width: 34px;
  height: 34px;
  flex: 0 0 34px;
  place-items: center;
  border-radius: 9px;
  color: #087f79;
  background: #e8f7f5;
  font-size: 16px;
}

.whitelist-subject-info .subject-section__grid {
  display: grid;
  margin: 0;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 9px;

  > div { min-width: 0; min-height: 66px; padding: 11px 13px; border-radius: 9px; background: #fff; }
  > div.is-wide { grid-column: 1 / -1; }
  > div.is-missing { background: #fffaf2; }
  dt { color: #718298; font-size: 11px; }
  dd { margin: 6px 0 0; color: #203249; font-size: 13px; font-weight: 600; line-height: 1.5; overflow-wrap: anywhere; }
  dd.is-mono { font-family: 'JetBrains Mono', Consolas, monospace; font-size: 12px; }
  .is-missing dd { color: #b26a12; font-family: inherit; font-weight: 500; }
}

@include mobile {
  .whitelist-subject-info .subject-section { padding: 13px; }
  .whitelist-subject-info .subject-section__grid { grid-template-columns: 1fr; }
  .whitelist-subject-info .subject-section__grid > div.is-wide { grid-column: auto; }
}
</style>
