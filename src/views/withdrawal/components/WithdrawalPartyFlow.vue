<template>
  <div class="withdrawal-party-flow">
    <div class="withdrawal-party-flow__party">
      <IdentityBadge v-if="payerType" :role="1" :entity-type="payerType" />
      <strong :title="payerName || undefined">{{ payerName || '—' }}</strong>
    </div>
    <FlowArrow class="withdrawal-party-flow__arrow" />
    <div class="withdrawal-party-flow__party">
      <IdentityBadge v-if="payeeType" :role="2" :entity-type="payeeType" />
      <strong :title="payeeName || undefined">{{ payeeName || '—' }}</strong>
    </div>
  </div>
</template>

<script setup lang="ts">
import FlowArrow from '@/components/common/FlowArrow.vue';
import IdentityBadge from '@/components/admin/IdentityBadge.vue';

defineProps<{
  payerName?: string | null;
  payerType?: number | string | null;
  payeeName?: string | null;
  payeeType?: number | string | null;
}>();
</script>

<style scoped lang="scss">
.withdrawal-party-flow {
  display: grid;
  width: min(100%, 280px);
  min-width: 0;
  align-items: stretch;
  margin: 0 auto;
  padding: 8px 0;
  grid-template-columns: minmax(0, 1fr) 40px minmax(0, 1fr);
  gap: 4px;

  &__party {
    display: flex;
    min-width: 0;
    min-height: 52px;
    justify-content: center;
    flex-direction: column;
    gap: 7px;

    &:first-child { align-items: flex-end; text-align: right; }
    &:last-child { align-items: flex-start; text-align: left; }

    strong {
      display: block;
      width: 100%;
      min-width: 0;
      overflow: hidden;
      color: #213a54;
      font-size: 13px;
      font-weight: 600;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &:first-child strong { text-align: right; }
    &:last-child strong { text-align: left; }
  }

  :deep(.status-badge) { height: 24px; padding: 0 9px; font-size: 11px; }
  &__party:first-child :deep(.status-badge) { transform: translateX(4px); }
  &__party:last-child :deep(.status-badge) { transform: translateX(-4px); }

  &__arrow { align-self: center; justify-self: center; }
}
</style>
