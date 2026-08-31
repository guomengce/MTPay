/**
 * 白名单详情展示模型
 *
 * 将 business_data 按资料区块整理。页面只负责组合组件，不在 Vue 模板中
 * 重复处理字段映射、空值和枚举文案。
 */
import { computed, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';

import type { WhitelistItemDetail } from '@/api/modules/whitelist';
import { getCountryLabel } from '@/constants/countries';
import { getRemittancePurposeLabel } from '@/constants/remittancePurposes';

export interface WhitelistDetailField {
  key: string;
  label: string;
  value: string;
  wide?: boolean;
  mono?: boolean;
  optional?: boolean;
  missing?: boolean;
}

const COUNTRY_FIELDS = new Set([
  'registration_country',
  'operating_country',
  'nationality',
  'residence_country',
]);

export function useWhitelistDetailView(detail: Ref<WhitelistItemDetail | null>) {
  const { t, locale } = useI18n();
  function field(
    key: string,
    label: string,
    options: Pick<WhitelistDetailField, 'wide' | 'mono' | 'optional'> = {},
  ): WhitelistDetailField {
    const raw = detail.value?.business_data?.[key];
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
    if (COUNTRY_FIELDS.has(key)) value = getCountryLabel(raw, locale.value);
    if (key === 'company_type') value = Number(raw) === 1 ? t('whitelist.nonFinancial') : Number(raw) === 2 ? t('whitelist.financial') : value;
    if (key === 'document_type') value = Number(raw) === 1 ? t('whitelist.identityDocument') : Number(raw) === 2 ? t('whitelist.passport') : value;
    if (key === 'remittance_purpose') value = getRemittancePurposeLabel(raw);
    return { key, label, value, ...options };
  }

  /* ---------- 付款人 / 公司 ---------- */
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

  /* ---------- 付款人 / 个人 ---------- */
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

  /* ---------- 收款人 / 公司 ---------- */
  const payeeCompanyFields = computed(() => [field('company_name', t('whitelist.companyName'))]);
  const payeeCompanyLocationFields = computed(() => [
    field('operating_country', t('whitelist.operatingCountry')),
    field('city', t('whitelist.city')),
    field('address', t('whitelist.address'), { wide: true }),
  ]);

  /* ---------- 收款人 / 个人 ---------- */
  const payeeIndividualIdentityFields = computed(() => [
    field('given_name', t('whitelist.givenName')),
    field('surname', t('whitelist.surname')),
    field('nationality', t('whitelist.nationality')),
  ]);
  const payeeIndividualResidenceFields = computed(() => [
    field('residence_country', t('whitelist.residenceCountry')),
    field('city', t('whitelist.city')),
    field('address', t('whitelist.address'), { wide: true }),
  ]);

  /* ---------- 收款账户信息（收款人公司、个人共用） ---------- */
  const payeeBankFields = computed(() => [
    field('bank_name', t('whitelist.bankName')),
    field('bank_account', t('whitelist.bankAccount'), { mono: true }),
    field('swift', 'SWIFT', { mono: true }),
    field('intermediary_swift', t('whitelist.intermediarySwift'), { mono: true, optional: true }),
    field('remittance_purpose', t('whitelist.remittancePurpose'), { wide: true }),
    field('remark', t('whitelist.remark'), { wide: true, optional: true }),
  ]);

  return {
    companyIdentityFields,
    registrationFields,
    payerIndividualIdentityFields,
    payerIndividualResidenceFields,
    payeeCompanyFields,
    payeeCompanyLocationFields,
    payeeIndividualIdentityFields,
    payeeIndividualResidenceFields,
    payeeBankFields,
  };
}
