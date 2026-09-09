/** 汇款目的枚举；value 必须与后端 remittance_purpose 编号保持一致。 */
export const REMITTANCE_PURPOSE_OPTIONS = [
  ...Array.from({ length: 32 }, (_, index) => ({
    value: index + 1,
    labelKey: `remittancePurposes.${index + 1}`,
  })),
] as const;

/** 未知编号保留原值，避免隐藏后端新增枚举。 */
export function getRemittancePurposeLabel(value: unknown, t: (key: string) => string): string {
  const numberValue = Number(value);
  return numberValue >= 1 && numberValue <= 32
    ? t(`remittancePurposes.${numberValue}`)
    : String(value ?? '—');
}
