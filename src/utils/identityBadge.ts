import type { StatusBadgeType } from '@/components/admin/StatusBadge.vue';

export type IdentityRole = number | string;
export type IdentityEntityType = number | string;

export function isPayerRole(role: IdentityRole) {
  const normalized = String(role).trim().toLowerCase();
  return role === 1 || normalized === '1' || normalized === '付款人' || normalized === '付款方' || normalized === 'payer';
}

export function isCompanyEntity(entityType: IdentityEntityType) {
  const normalized = String(entityType).trim().toLowerCase();
  return entityType === 1 || normalized === '1' || normalized === '公司' || normalized === 'company';
}

export function getIdentityBadgeType(
  role: IdentityRole,
  entityType: IdentityEntityType,
): StatusBadgeType {
  const isPayer = isPayerRole(role);
  const isCompany = isCompanyEntity(entityType);
  if (isPayer && isCompany) return 'primary';
  if (isPayer) return 'warning';
  if (isCompany) return 'mt';
  return 'success';
}

