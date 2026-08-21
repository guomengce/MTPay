<template>
  <div class="withdrawal-detail-content">
    <OrderHeader :detail="detail" :status-type="statusType" :status-effect="detail.status === 0 ? 'pending' : undefined" />
    <div class="withdrawal-detail-content__workspace" :class="{ 'is-single': !detail.records.length }">
      <main class="withdrawal-detail-content__main">
        <SettlementCard :detail="detail" />
        <PartyCard :detail="detail" />
        <ReviewCard v-if="hasReviewInfo" :detail="detail" />
      </main>
      <aside v-if="detail.records.length" class="withdrawal-detail-content__aside">
        <Timeline :records="detail.records" :loading="fileLoading" @preview="emit('preview', $event)" @download="emit('download', $event)" />
      </aside>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import type { WithdrawalOrderDetail } from '@/api/modules/withdrawal';
import type { StatusBadgeType } from '@/components/admin/StatusBadge.vue';
import { WITHDRAWAL_STATUS_MAP } from '@/views/withdrawal/composables/useWithdrawalList';
import OrderHeader from './OrderHeader.vue'; import PartyCard from './PartyCard.vue'; import ReviewCard from './ReviewCard.vue'; import SettlementCard from './SettlementCard.vue'; import Timeline from './Timeline.vue';
const props=defineProps<{detail:WithdrawalOrderDetail;fileLoading?:boolean}>();const emit=defineEmits<{(e:'preview'|'download',id:number):void}>();
const hasReviewInfo=computed(()=>Boolean(props.detail.review?.admin_name||props.detail.review?.reviewed_at||props.detail.review?.note));
const statusType=computed<StatusBadgeType>(()=>WITHDRAWAL_STATUS_MAP[props.detail.status]?.type??'gray');
</script>
<style scoped lang="scss">
.withdrawal-detail-content { display: grid; min-width: 0; gap: 18px; }
.withdrawal-detail-content__workspace { display: grid; min-width: 0; align-items: start; grid-template-columns: minmax(0, 1.15fr) minmax(420px, .95fr); gap: 18px; }
.withdrawal-detail-content__workspace.is-single { grid-template-columns: 1fr; }
.withdrawal-detail-content__main { display: grid; min-width: 0; gap: 18px; }
.withdrawal-detail-content__aside { position: sticky; top: 24px; min-width: 0; }

@include narrow {
  .withdrawal-detail-content__workspace { grid-template-columns: minmax(0, 1fr); }
  .withdrawal-detail-content__aside { position: static; }
}

@include mobile {
  .withdrawal-detail-content,
  .withdrawal-detail-content__main { gap: 14px; }
  .withdrawal-detail-content__workspace { grid-template-columns: minmax(0, 1fr); gap: 14px; }
  .withdrawal-detail-content__aside { position: static; }
}
</style>
