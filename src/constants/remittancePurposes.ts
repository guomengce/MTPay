/** 汇款目的枚举；value 必须与后端 remittance_purpose 编号保持一致。 */
export const REMITTANCE_PURPOSE_OPTIONS = [
  { value: 1, label: 'Salary (Compensation of employees)' },
  { value: 2, label: 'Purchase of real estate abroad from residents' },
  { value: 3, label: 'Allowance' },
  { value: 4, label: 'Agency Commissions' },
  { value: 5, label: 'Advance Payment against EOS' },
  { value: 6, label: 'Bonus' },
  { value: 7, label: 'Commission' },
  { value: 8, label: 'Compensation' },
  { value: 9, label: 'End of Service/ Final Settlement' },
  { value: 10, label: 'Leave Salary' },
  { value: 11, label: 'Own Account Transfer' },
  { value: 12, label: 'Overtime' },
  { value: 13, label: 'Pension' },
  { value: 14, label: 'Personal Investment' },
  { value: 15, label: 'Salary Advance' },
  { value: 16, label: 'Transfer of Funds between persons Normal and Judicial' },
  { value: 17, label: 'Educational Support' },
  {
    value: 18,
    label: 'Equity other than investment fund shares in not related companies abroad',
  },
  { value: 19, label: 'Investment fund shares foreign' },
  { value: 20, label: 'Tickets' },
  { value: 21, label: 'Leasing abroad' },
  { value: 22, label: 'Repos on foreign securities' },
  { value: 23, label: 'Trade credits and advances receivable' },
  { value: 24, label: 'Loan Interest Payments' },
  { value: 25, label: 'Loan Charges' },
  { value: 26, label: 'Monetary Claim Reimbursements' },
  { value: 27, label: 'Equated Monthly Installments' },
  { value: 28, label: 'Trade credits and advances payable' },
  { value: 29, label: 'Rent Payments' },
  { value: 30, label: 'Utility Bill Payments' },
  { value: 31, label: 'Goods sold' },
  { value: 32, label: 'Goods bought' },
] as const;

const REMITTANCE_PURPOSE_LABELS = new Map<number, string>(
  REMITTANCE_PURPOSE_OPTIONS.map(({ value, label }) => [value, label]),
);

/** 未知编号保留原值，避免隐藏后端新增枚举。 */
export function getRemittancePurposeLabel(value: unknown): string {
  const numberValue = Number(value);
  return REMITTANCE_PURPOSE_LABELS.get(numberValue) || String(value ?? '—');
}
