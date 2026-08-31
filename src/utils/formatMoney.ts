/** Display-only thousands grouping. Keeps decimal precision and never changes API values. */
export function formatMoney(value: unknown, fallback = '—'): string {
  if (value == null || value === '') return fallback;
  const text = String(value);
  // Support existing display labels with a currency suffix; never parse them as numbers.
  return text.replace(/(^|[\s≈])([+-]?)(\d+)((?:\.\d+)?)(?=$|\s)/g,
    (_match, before, sign, integer, decimal) => before + sign + integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + decimal);
}
