<template>
  <DetailCard title="交易主体" description="本次出金使用的已审核白名单" icon="ri-arrow-left-right-line">
    <div class="party-flow">
      <article>
        <span class="party-flow__tag is-payer">付款人 · {{ entityTypeName(detail.payer.entity_type) }}</span>
        <strong :title="detail.payer.name">{{ detail.payer.name }}</strong>
        <button type="button" @click="copyNo('付款人', detail.payer.whitelist_no)">
          <small>{{ detail.payer.whitelist_no }}</small><i class="ri-file-copy-line" />
        </button>
      </article>

      <div class="party-flow__arrow" aria-hidden="true">
        <span></span><i class="ri-arrow-right-line" /><span></span>
      </div>

      <article>
        <span class="party-flow__tag is-payee">收款人 · {{ entityTypeName(detail.payee.entity_type) }}</span>
        <strong :title="detail.payee.name">{{ detail.payee.name }}</strong>
        <button type="button" @click="copyNo('收款人', detail.payee.whitelist_no)">
          <small>{{ detail.payee.whitelist_no }}</small><i class="ri-file-copy-line" />
        </button>
      </article>
    </div>
  </DetailCard>
</template>

<script setup lang="ts">
/** 出金交易主体：突出付款人、收款人及资金流向。 */
import { ElMessage } from 'element-plus';

import type { WithdrawalOrderDetail } from '@/api/modules/withdrawal';
import DetailCard from '@/components/detail/DetailCard.vue';

defineProps<{ detail: WithdrawalOrderDetail }>();

function entityTypeName(value: 1 | 2) {
  return value === 1 ? '公司' : '个人';
}

async function copyNo(role: string, value: string) {
  try {
    await navigator.clipboard.writeText(value);
    ElMessage.success(`${role}白名单编号已复制`);
  } catch {
    ElMessage.error('复制失败，请手动复制');
  }
}
</script>

<style scoped lang="scss">
.party-flow {
  display: grid;
  min-width: 0;
  align-items: center;
  grid-template-columns: minmax(0, 1fr) 58px minmax(0, 1fr);
  gap: 8px;

  article { display: grid; min-width: 0; gap: 9px; padding: 15px; border: 1px solid #dce8ee; border-radius: 12px; background: #f8fbfc; }
  article:last-child { border-color: #dce6f3; background: #f8faff; }
  article > strong { overflow: hidden; color: #17324f; font-size: 16px; font-weight: 680; text-overflow: ellipsis; white-space: nowrap; }
  article > button { display: flex; width: fit-content; max-width: 100%; align-items: center; gap: 6px; padding: 0; overflow: hidden; border: 0; color: #718399; background: transparent; cursor: pointer; }
  article > button:hover { color: #078f89; }
  article > button small { overflow: hidden; font-family: 'JetBrains Mono', Consolas, monospace; font-size: 10px; text-overflow: ellipsis; white-space: nowrap; }

  &__tag { display: inline-flex; width: fit-content; height: 25px; align-items: center; padding: 0 9px; border-radius: 7px; font-size: 10px; font-weight: 700; }
  &__tag.is-payer { color: #087f79; background: #e6f7f4; }
  &__tag.is-payee { color: #3469a5; background: #edf4fb; }
  &__arrow { display: flex; align-items: center; color: #0d9b94; }
  &__arrow span { height: 1px; flex: 1; background: #c7e2df; }
  &__arrow i { display: grid; width: 28px; height: 28px; flex: 0 0 28px; place-items: center; border: 1px solid #bfe0dd; border-radius: 50%; background: #fff; }
}

@include mobile {
  .party-flow { grid-template-columns: 1fr; }
  .party-flow__arrow { display: none; }
}
</style>
