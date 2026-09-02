import type { Ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const appliedQueries = new Map<string, Record<string, string>>();

export function clearListQueryState() {
  appliedQueries.clear();
}

/** 恢复列表查询条件，并只在实际查询时同步 URL。 */
export function useListQueryState(fields: Record<string, Ref>, numeric: string[] = []) {
  const route = useRoute();
  const router = useRouter();
  const path = route.path;
  const defaults = Object.fromEntries(Object.entries(fields).map(([key, field]) => [key, field.value]));
  const hasExplicitQuery = Object.keys(fields).some((key) => Object.prototype.hasOwnProperty.call(route.query, key));
  const savedQuery = hasExplicitQuery ? route.query : appliedQueries.get(path) ?? route.query;

  for (const [key, field] of Object.entries(fields)) {
    const raw = savedQuery[key];
    if (typeof raw !== 'string' || raw === '') continue;
    if (numeric.includes(key) || typeof defaults[key] === 'number') {
      if (!/^\d+$/.test(raw)) continue;
      const value = Number(raw);
      if (!Number.isSafeInteger(value) || ((key === 'page' || key === 'limit') && value < 1)) continue;
      field.value = value;
    } else {
      field.value = raw;
    }
  }

  return async function saveListQuery() {
    if (route.path !== path) return;
    const query = { ...route.query };
    const snapshot: Record<string, string> = {};
    for (const [key, field] of Object.entries(fields)) {
      const value = field.value;
      if (value == null || value === '' || value === defaults[key]) delete query[key];
      else {
        query[key] = String(value);
        snapshot[key] = String(value);
      }
    }
    appliedQueries.set(path, snapshot);
    if (JSON.stringify(query) !== JSON.stringify(route.query)) await router.replace({ path, query, hash: route.hash });
  };
}
