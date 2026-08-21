<template>
  <DetailCard
    class="subject-info"
    title="主体信息"
    description="代理提交并由平台审核的完整白名单资料"
    icon="ri-profile-line"
  >
    <div class="subject-info__tags">
      <span><i class="ri-id-card-line" />{{ roleName }}</span>
      <span class="is-entity">
        <i :class="entityType === 1 ? 'ri-building-2-line' : 'ri-user-3-line'" />
        {{ entityTypeName }}（{{ entityType === 1 ? 'B' : 'C' }}）
      </span>
    </div>

    <div class="subject-info__sections whitelist-subject-info">
      <!-- 聚合层只判断角色与主体类型，五个资料组件在不同组合间复用。 -->
      <template v-if="entityType === 1">
        <CompanyInfo :fields="role === 1 ? companyIdentityFields : payeeCompanyFields" />
        <CompanyAddress :fields="role === 1 ? registrationFields : payeeCompanyLocationFields" />
      </template>

      <template v-else>
        <PersonalInfo
          :fields="role === 1 ? payerIndividualIdentityFields : payeeIndividualIdentityFields"
        />
        <ResidenceInfo
          :fields="role === 1 ? payerIndividualResidenceFields : payeeIndividualResidenceFields"
        />
      </template>

      <BankInfo v-if="role === 2" :fields="payeeBankFields" />
    </div>
  </DetailCard>
</template>

<script setup lang="ts">
/** 主体资料聚合层：仅组合五个可复用资料组件，不处理接口字段。 */
import DetailCard from '@/components/detail/DetailCard.vue';
import type { WhitelistDetailField } from '../../composables/useWhitelistDetailView';

import BankInfo from './subject/BankInfo.vue';
import CompanyAddress from './subject/CompanyAddress.vue';
import CompanyInfo from './subject/CompanyInfo.vue';
import PersonalInfo from './subject/PersonalInfo.vue';
import ResidenceInfo from './subject/ResidenceInfo.vue';

defineProps<{
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
</script>

<style scoped lang="scss">
.subject-info__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: -4px 0 14px;

  span {
    display: inline-flex;
    height: 28px;
    align-items: center;
    gap: 6px;
    padding: 0 11px;
    border-radius: 8px;
    color: #087f79;
    background: #e7f7f4;
    font-size: 12px;
    font-weight: 650;
  }

  .is-entity { color: #3469a5; background: #edf4fb; }
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
