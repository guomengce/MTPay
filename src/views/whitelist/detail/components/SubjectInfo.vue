<template>
  <section class="subject-shell">
    <header class="subject-shell__header">
      <div class="subject-shell__heading">
        <span class="subject-shell__icon"><i :class="subjectIcon" /></span>
        <div>
          <h3>{{ subjectTitle }}</h3>
          <p>{{ detail.subject_name }}</p>
        </div>
      </div>
      <IdentityBadge :role="detail.role" :entity-type="detail.entity_type" />
    </header>

    <div class="subject-shell__body" :class="{ 'is-two-column': detail.role === 2 }">
      <section class="subject-panel">
        <header class="subject-panel__header">
          <span><i :class="subjectIcon" /></span>
          <h4>{{ subjectTitle }}</h4>
        </header>
        <dl class="subject-panel__grid">
          <div v-for="field in subjectFields" :key="field.key" :class="fieldClass(field)">
            <dt>{{ field.label }}</dt>
            <dd :class="{ 'is-mono': field.mono }">{{ field.value }}</dd>
          </div>
        </dl>
      </section>

      <section v-if="detail.role === 2" class="subject-panel subject-panel--bank">
        <header class="subject-panel__header">
          <span><i class="ri-bank-line" /></span>
          <h4>{{ t('whitelist.bankDetails') }}</h4>
        </header>
        <dl class="subject-panel__grid">
          <div v-for="field in bankFields" :key="field.key" :class="fieldClass(field)">
            <dt>{{ field.label }}</dt>
            <dd :class="{ 'is-mono': field.mono }">{{ field.value }}</dd>
          </div>
        </dl>
      </section>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { WhitelistItemDetail } from '@/api/modules/whitelist';
import IdentityBadge from '@/components/admin/IdentityBadge.vue';
import { getCountryLabel } from '@/constants/countries';
import { getRemittancePurposeLabel } from '@/constants/remittancePurposes';

interface DetailField {
  key: string;
  label: string;
  value: string;
  wide?: boolean;
  mono?: boolean;
  optional?: boolean;
  missing?: boolean;
}

const props = defineProps<{ detail: WhitelistItemDetail }>();
const { t, locale } = useI18n();

const countryFields = new Set([
  'registration_country',
  'operating_country',
  'nationality',
  'residence_country',
]);

function field(
  key: string,
  label: string,
  options: Pick<DetailField, 'wide' | 'mono' | 'optional'> = {},
): DetailField {
  const raw = props.detail.business_data?.[key];
  if (raw === undefined || raw === null || raw === '') {
    return {
      key,
      label,
      value: options.optional ? t('whitelistReview.notProvided') : t('whitelistReview.notReturned'),
      missing: true,
      ...options,
    };
  }

  let value = String(raw);
  if (countryFields.has(key)) value = getCountryLabel(raw, locale.value);
  if (key === 'company_type') {
    value = Number(raw) === 1 ? t('whitelist.nonFinancial') : Number(raw) === 2 ? t('whitelist.financial') : value;
  }
  if (key === 'document_type') {
    value = Number(raw) === 1 ? t('whitelist.identityDocument') : Number(raw) === 2 ? t('whitelist.passport') : value;
  }
  if (key === 'remittance_purpose') value = getRemittancePurposeLabel(raw, t);

  return { key, label, value, ...options };
}

const companyIdentityFields = computed(() => [
  field('company_name', t('whitelist.companyName')),
  field('company_type', t('whitelist.companyType')),
  field('document_no', t('whitelist.companyNo'), { mono: true }),
  field('registration_date', t('whitelist.registrationDate')),
]);

const registrationFields = computed(() => [
  field('registration_country', t('whitelist.registrationCountry')),
  field('operating_country', t('whitelist.operatingCountry')),
  field('city', t('whitelist.city')),
  field('address', t('whitelist.address'), { wide: true }),
]);

const payerIndividualIdentityFields = computed(() => [
  field('given_name', t('whitelist.givenName')),
  field('surname', t('whitelist.surname')),
  field('nationality', t('whitelist.nationality')),
  field('birth_date', t('whitelist.birthDate')),
  field('document_type', t('whitelist.documentType')),
  field('document_no', t('whitelist.documentNo'), { mono: true }),
]);

const payerIndividualResidenceFields = computed(() => [
  field('residence_country', t('whitelist.residenceCountry')),
  field('city', t('whitelist.city')),
  field('address', t('whitelist.address'), { wide: true }),
]);

const payeeCompanyFields = computed(() => [
  field('company_name', t('whitelist.companyName')),
  field('operating_country', t('whitelist.operatingCountry')),
  field('city', t('whitelist.city')),
  field('address', t('whitelist.address'), { wide: true }),
]);

const payeeIndividualFields = computed(() => [
  field('given_name', t('whitelist.givenName')),
  field('surname', t('whitelist.surname')),
  field('nationality', t('whitelist.nationality')),
  field('residence_country', t('whitelist.residenceCountry')),
  field('city', t('whitelist.city')),
  field('address', t('whitelist.address'), { wide: true }),
]);

const subjectFields = computed(() => {
  if (props.detail.entity_type === 1) {
    return props.detail.role === 1
      ? [...companyIdentityFields.value, ...registrationFields.value]
      : payeeCompanyFields.value;
  }
  return props.detail.role === 1
    ? [...payerIndividualIdentityFields.value, ...payerIndividualResidenceFields.value]
    : payeeIndividualFields.value;
});

const bankFields = computed(() => [
  field('bank_name', t('whitelist.bankName')),
  field('bank_account', t('whitelist.bankAccount'), { mono: true }),
  field('swift', 'SWIFT', { mono: true }),
  field('intermediary_swift', t('whitelist.intermediarySwift'), { mono: true, optional: true }),
  field('remittance_purpose', t('whitelist.remittancePurpose'), { wide: true }),
  field('remark', t('whitelist.remark'), { wide: true, optional: true }),
]);

const subjectTitle = computed(() => t(props.detail.entity_type === 1 ? 'whitelist.companyInfo' : 'whitelist.personalInfo'));
const subjectIcon = computed(() => (props.detail.entity_type === 1 ? 'ri-building-2-line' : 'ri-id-card-line'));

function fieldClass(field: DetailField) {
  return { 'is-wide': field.wide, 'is-missing': field.missing };
}
</script>

<style scoped lang="scss">
.subject-shell {
  position: relative;
  width: 100%;
  min-width: 0;
  overflow: hidden;
  border: 1px solid #d7e7ef;
  border-radius: 18px;
  background: linear-gradient(180deg, #ffffff 0%, #f7fbfd 100%);
  box-shadow: 0 14px 34px rgb(24 75 112 / 8%);
}

.subject-shell::before {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 4px;
  background: linear-gradient(90deg, #16bbb1, #72c8ef 58%, #4e8ee8);
  content: '';
}

.subject-shell__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  min-height: 76px;
  padding: 18px 22px 16px;
  border-bottom: 1px solid #e7f0f5;
  background: linear-gradient(90deg, #f0fbfa 0%, #f9fdff 62%, #eef6ff 100%);
}

.subject-shell__heading {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 13px;

  > div {
    min-width: 0;
  }

  h3 {
    margin: 0;
    color: #17324f;
    font-size: 18px;
    font-weight: 700;
  }

  p {
    margin: 5px 0 0;
    color: #758ba2;
    font-size: 12px;
    line-height: 1.45;
    overflow-wrap: anywhere;
  }
}

.subject-shell__header :deep(.identity-badge) {
  flex: 0 0 auto;
  margin-top: 3px;
}

.subject-shell__icon,
.subject-panel__header span {
  display: grid;
  place-items: center;
  color: #0a9b92;
  background: #e7f8f5;
}

.subject-shell__icon {
  width: 42px;
  height: 42px;
  flex: 0 0 42px;
  border-radius: 13px;
  font-size: 20px;
}

.subject-shell__body {
  display: grid;
  gap: 18px;
  padding: 18px 20px 22px;
}

.subject-shell__body.is-two-column {
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
}

.subject-panel {
  min-width: 0;
}

.subject-panel + .subject-panel {
  padding-left: 18px;
  border-left: 1px solid #e6eef3;
}

.subject-panel__header {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 14px;

  span {
    width: 30px;
    height: 30px;
    flex: 0 0 30px;
    border-radius: 10px;
    font-size: 16px;
  }

  h4 {
    margin: 0;
    color: #25425f;
    font-size: 14px;
    font-weight: 700;
  }
}

.subject-panel--bank .subject-panel__header span {
  color: #3f76c9;
  background: #edf4ff;
}

.subject-panel__grid {
  display: grid;
  margin: 0;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.subject-panel__grid > div {
  display: grid;
  min-width: 0;
  min-height: 66px;
  align-content: center;
  padding: 12px 14px;
  gap: 7px;
  border: 1px solid #e2edf3;
  border-radius: 12px;
  background: rgb(255 255 255 / 86%);
}

.subject-panel__grid > div.is-wide {
  grid-column: 1 / -1;
}

.subject-panel__grid > div.is-missing {
  background: #fffaf2;
}

.subject-panel__grid dt {
  color: #758ba2;
  font-size: 12px;
  line-height: 1.35;
}

.subject-panel__grid dd {
  min-width: 0;
  margin: 0;
  color: #17324f;
  font-size: 15px;
  font-weight: 650;
  line-height: 1.45;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.subject-panel__grid dd.is-mono {
  font-family: 'JetBrains Mono', Consolas, monospace;
  font-size: 14px;
}

.subject-panel__grid .is-missing dd {
  color: #b26a12;
  font-family: inherit;
  font-weight: 500;
}

@media (max-width: 980px) {
  .subject-shell__body.is-two-column {
    grid-template-columns: 1fr;
  }

  .subject-panel + .subject-panel {
    padding-top: 18px;
    padding-left: 0;
    border-top: 1px solid #e6eef3;
    border-left: 0;
  }
}

@media (max-width: 600px) {
  .subject-shell__header {
    flex-direction: column;
    align-items: stretch;
    padding: 16px;
  }

  .subject-shell__header :deep(.identity-badge) {
    align-self: flex-start;
    margin-top: 0;
  }

  .subject-shell__body {
    padding: 14px;
  }

  .subject-panel__grid {
    grid-template-columns: 1fr;
  }

  .subject-panel__grid > div.is-wide {
    grid-column: auto;
  }
}
</style>
