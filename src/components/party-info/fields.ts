import type { ComposerTranslation } from 'vue-i18n';
import { getCountryLabel } from '@/constants/countries';
import { getRemittancePurposeLabel } from '@/constants/remittancePurposes';
export type PartyField = { key: string; label: string; value: string; mono?: boolean };
const labels: Record<string, string> = {
  company_name: 'companyName',
  company_type: 'companyType',
  given_name: 'givenName',
  surname: 'surname',
  registration_country: 'registrationCountry',
  operating_country: 'operatingCountry',
  nationality: 'nationality',
  residence_country: 'residenceCountry',
  city: 'city',
  address: 'address',
  registration_date: 'registrationDate',
  birth_date: 'birthDate',
  document_type: 'documentType',
  document_no: 'documentNo',
  bank_name: 'bankName',
  bank_account: 'bankAccount',
  swift: 'swift',
  intermediary_swift: 'intermediarySwift',
  remittance_purpose: 'remittancePurpose',
  remark: 'remark',
};
const OPTIONAL_PARTY_FIELDS = new Set(['intermediary_swift', 'remark']);

function hasPartyValue(raw: unknown) {
  return raw !== null && raw !== undefined && (typeof raw !== 'string' || raw.trim() !== '');
}

export function formatPartyFields(
  data: Record<string, unknown>,
  keys: string[],
  t: ComposerTranslation,
  locale: string,
  company = false,
): PartyField[] {
  return keys
    .filter((key) => !OPTIONAL_PARTY_FIELDS.has(key) || hasPartyValue(data[key]))
    .map((key) => {
      const raw = data[key];
      let value = raw == null || raw === '' ? '—' : String(raw);
      if (key === 'company_type' && value !== '—')
        value = t(`whitelist.${Number(raw) === 2 ? 'financial' : 'nonFinancial'}`);
      if (key === 'document_type' && value !== '—')
        value = t(`whitelist.${Number(raw) === 2 ? 'passport' : 'identityDocument'}`);
      if (key === 'remittance_purpose' && value !== '—') value = getRemittancePurposeLabel(raw, t);
      if (
        ['registration_country', 'operating_country', 'nationality', 'residence_country'].includes(
          key,
        ) &&
        value !== '—'
      ) {
        value = getCountryLabel(raw, locale);
      }
      const labelKey = key === 'document_no' && company ? 'companyNo' : labels[key];
      return {
        key,
        label: t(`whitelist.${labelKey}`),
        value,
        mono: ['document_no', 'bank_account', 'swift', 'intermediary_swift'].includes(key),
      };
    });
}
