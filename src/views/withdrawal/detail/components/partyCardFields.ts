import type { ComposerTranslation } from 'vue-i18n';
import type { WithdrawalPartySummary } from '@/api/modules/withdrawal';
import { getRemittancePurposeLabel } from '@/constants/remittancePurposes';

export type PartyField = { key: string; label: string; value: string; mono?: boolean };
export const PAYER_PERSON_KEYS = ['given_name','surname','nationality','residence_country','city','address','birth_date','document_type','document_no'];
export const PAYER_COMPANY_KEYS = ['company_name','company_type','registration_country','operating_country','city','address','registration_date','document_no'];
export const PAYEE_PERSON_KEYS = ['given_name','surname','nationality','residence_country','city','address'];
export const PAYEE_COMPANY_KEYS = ['company_name','operating_country','city','address'];
export const PAYEE_BANK_KEYS = ['bank_name','bank_account','swift','intermediary_swift','remittance_purpose','remark'];

const labels: Record<string,string> = { company_name:'companyName',company_type:'companyType',given_name:'givenName',surname:'surname',registration_country:'registrationCountry',operating_country:'operatingCountry',nationality:'nationality',residence_country:'residenceCountry',city:'city',address:'address',registration_date:'registrationDate',birth_date:'birthDate',document_type:'documentType',document_no:'documentNo',bank_name:'bankName',bank_account:'bankAccount',swift:'swift',intermediary_swift:'intermediarySwift',remittance_purpose:'remittancePurpose',remark:'remark' };

export function partyData(party: WithdrawalPartySummary) {
  const raw = party.data ?? party.snapshot ?? {};
  const merged: Record<string, unknown> = { ...raw };
  if (raw.business_data && typeof raw.business_data === 'object' && !Array.isArray(raw.business_data)) Object.assign(merged, raw.business_data);
  if (!merged.bank_account && merged.account_no) merged.bank_account = merged.account_no;
  if (!merged.swift && merged.swift_code) merged.swift = merged.swift_code;
  if (!merged.company_name) merged.company_name = party.name;
  return merged;
}

export function buildPartyFields(party: WithdrawalPartySummary, keys: string[], t: ComposerTranslation): PartyField[] {
  const data = partyData(party);
  return keys.map((key) => {
    const raw = data[key];
    let value = raw == null || raw === '' ? '—' : String(raw);
    if (key === 'company_type' && value !== '—') value = t(`whitelist.${Number(raw) === 2 ? 'financial' : 'nonFinancial'}`);
    if (key === 'document_type' && value !== '—') value = t(`whitelist.${Number(raw) === 2 ? 'passport' : 'identityDocument'}`);
    if (key === 'remittance_purpose' && value !== '—') value = getRemittancePurposeLabel(raw);
    const labelKey = key === 'document_no' && keys === PAYER_COMPANY_KEYS ? 'companyNo' : labels[key];
    return { key, label: t(`whitelist.${labelKey}`), value, mono: ['document_no','bank_account','swift','intermediary_swift'].includes(key) };
  });
}
