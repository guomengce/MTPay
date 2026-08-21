/**
 * 白名单详情展示模型
 *
 * 将 business_data 按资料区块整理。页面只负责组合组件，不在 Vue 模板中
 * 重复处理字段映射、空值和枚举文案。
 */
import { computed, type Ref } from 'vue';

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

const COMPANY_TYPES: Record<number, string> = { 1: '非金融机构', 2: '金融机构' };
const DOCUMENT_TYPES: Record<number, string> = { 1: '身份证件', 2: '护照' };
const COUNTRY_FIELDS = new Set([
  'registration_country',
  'operating_country',
  'nationality',
  'residence_country',
]);

export function useWhitelistDetailView(detail: Ref<WhitelistItemDetail | null>) {
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
        value: options.optional ? '未填写' : '接口未返回',
        missing: true,
        ...options,
      };
    }

    let value = String(raw);
    if (COUNTRY_FIELDS.has(key)) value = getCountryLabel(raw);
    if (key === 'company_type') value = COMPANY_TYPES[Number(raw)] || value;
    if (key === 'document_type') value = DOCUMENT_TYPES[Number(raw)] || value;
    if (key === 'remittance_purpose') value = getRemittancePurposeLabel(raw);
    return { key, label, value, ...options };
  }

  /* ---------- 付款人 / 公司 ---------- */
  const companyIdentityFields = computed(() => [
    field('company_name', '公司名称'),
    field('company_type', '公司类型'),
    field('document_no', '证件编号', { mono: true }),
    field('registration_date', '注册日期'),
  ]);
  const registrationFields = computed(() => [
    field('registration_country', '注册国家／地区'),
    field('operating_country', '经营国家／地区'),
    field('city', '所在城市'),
    field('address', '详细地址', { wide: true }),
  ]);

  /* ---------- 付款人 / 个人 ---------- */
  const payerIndividualIdentityFields = computed(() => [
    field('given_name', '名'),
    field('surname', '姓'),
    field('nationality', '国籍'),
    field('birth_date', '出生日期'),
    field('document_type', '证件类型'),
    field('document_no', '证件编号', { mono: true }),
  ]);
  const payerIndividualResidenceFields = computed(() => [
    field('residence_country', '居住国家／地区'),
    field('city', '所在城市'),
    field('address', '详细地址', { wide: true }),
  ]);

  /* ---------- 收款人 / 公司 ---------- */
  const payeeCompanyFields = computed(() => [field('company_name', '公司名称')]);
  const payeeCompanyLocationFields = computed(() => [
    field('operating_country', '经营国家／地区'),
    field('city', '所在城市'),
    field('address', '详细地址', { wide: true }),
  ]);

  /* ---------- 收款人 / 个人 ---------- */
  const payeeIndividualIdentityFields = computed(() => [
    field('given_name', '名'),
    field('surname', '姓'),
    field('nationality', '国籍'),
  ]);
  const payeeIndividualResidenceFields = computed(() => [
    field('residence_country', '居住国家／地区'),
    field('city', '所在城市'),
    field('address', '详细地址', { wide: true }),
  ]);

  /* ---------- 收款账户信息（收款人公司、个人共用） ---------- */
  const payeeBankFields = computed(() => [
    field('bank_name', '银行名称'),
    field('bank_account', '银行账号', { mono: true }),
    field('swift', 'SWIFT', { mono: true }),
    field('intermediary_swift', '中间行 SWIFT（可选）', { mono: true, optional: true }),
    field('remittance_purpose', '汇款目的', { wide: true }),
    field('remark', '备注（可选）', { wide: true, optional: true }),
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
