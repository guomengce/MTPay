/** 去除十进制字符串末尾无意义的 0，不经过 Number，避免资金精度损失。 */
export function trimDecimalZeros(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === '') return '';
  const text = String(value).trim();
  if (!/^[+-]?\d+(?:\.\d+)?$/.test(text)) return text;
  if (!text.includes('.')) return text;
  return text.replace(/(\.\d*?[1-9])0+$/, '$1').replace(/\.0+$/, '');
}

/** 兑换比例固定显示 4 位小数，超过 4 位时四舍五入。 */
export function formatExchangeRate(value: string | number | null | undefined): string {
  const text = trimDecimalZeros(value);
  if (!text || !/^[+-]?\d+(?:\.\d+)?$/.test(text)) return text;

  const [integerPart, fractionPart = ''] = text.split('.');
  if (fractionPart.length <= 4) {
    return `${integerPart}.${fractionPart.padEnd(4, '0')}`;
  }

  const negative = integerPart.startsWith('-');
  const unsignedInteger = integerPart.replace(/^[+-]/, '');
  const digits = `${unsignedInteger}${fractionPart.slice(0, 4)}`.split('').map(Number);

  if (Number(fractionPart[4]) >= 5) {
    for (let index = digits.length - 1; index >= 0; index -= 1) {
      digits[index] += 1;
      if (digits[index] < 10) break;
      digits[index] = 0;
      if (index === 0) digits.unshift(1);
    }
  }

  const rounded = digits.join('');
  const integer = rounded.slice(0, -4) || '0';
  const fraction = rounded.slice(-4).padStart(4, '0');
  return `${negative ? '-' : ''}${integer}.${fraction}`;
}

/** 固定手续费展示格式；正常的整数手续费会显示为 50 而不是 50.00000000。 */
export const formatFixedFee = trimDecimalZeros;
