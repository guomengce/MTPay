/**
 * 缩略展示哈希、钱包地址等长标识符。仅用于 UI，复制与接口提交应保留原值。
 */
export function formatLongIdentifier(value: unknown, head = 10, tail = 10): string {
  if (value === null || value === undefined || value === '') return '—';
  const text = String(value);
  if (text.length <= head + tail + 3) return text;
  return `${text.slice(0, head)}...${text.slice(-tail)}`;
}
