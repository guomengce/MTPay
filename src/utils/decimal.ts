/** 去除十进制字符串末尾无意义的 0，不经过 Number，避免资金精度损失。 */
export function trimDecimalZeros(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === '') return '';
  const text = String(value).trim();
  if (!/^[+-]?\d+(?:\.\d+)?$/.test(text)) return text;
  if (!text.includes('.')) return text;
  return text.replace(/(\.\d*?[1-9])0+$/, '$1').replace(/\.0+$/, '');
}

/** 兑换比例展示格式。 */
export const formatExchangeRate = trimDecimalZeros;

/** 固定手续费展示格式；正常的整数手续费会显示为 50 而不是 50.00000000。 */
export const formatFixedFee = trimDecimalZeros;
