import type { StatusBadgeType } from '@/components/admin/StatusBadge.vue';

export type IdentityRole = number | string;
export type IdentityEntityType = number | string;

export function getIdentityBadgeType(
  role: IdentityRole,
  entityType: IdentityEntityType,
): StatusBadgeType {
  const isPayer = role === 1 || role === '付款人' || role === '付款方';
  const isCompany = entityType === 1 || entityType === '公司';
  if (isPayer && isCompany) return 'primary';
  if (isPayer) return 'warning';
  if (isCompany) return 'mt';
  return 'success';
}

export function getIdentityBadgeLabel(
  role: IdentityRole,
  entityType: IdentityEntityType,
) {
  const roleLabel = role === 1 || role === '付款人' || role === '付款方' ? '付款人' : '收款人';
  const entityLabel = entityType === 1 || entityType === '公司' ? '公司' : '個人';
  return `${roleLabel} · ${entityLabel}`;
}
