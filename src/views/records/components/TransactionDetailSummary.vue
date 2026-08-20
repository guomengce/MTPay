<template>
  <DetailCard title="交易摘要" description="统一交易记录的公共字段" icon="ri-file-list-3-line">
    <DetailFieldGrid :items="items" />
  </DetailCard>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import type { TransactionItem } from '@/api/modules/transaction';
import DetailCard from '@/components/detail/DetailCard.vue';
import DetailFieldGrid, { type DetailFieldItem } from '@/components/detail/DetailFieldGrid.vue';

const props = defineProps<{ transaction: TransactionItem }>();

const items = computed<DetailFieldItem[]>(() => {
  const t = props.transaction;
  const list: DetailFieldItem[] = [
    { label: '业务类型', value: t.business_name },
    { label: '订单号', value: t.order_no, mono: true },
    { label: '提交时间', value: t.submitted_at || '—' },
    { label: '状态', value: t.status_name },
  ];
  if (t.completed_at) list.push({ label: '完成时间', value: t.completed_at });
  if (t.finished_at) list.push({ label: '终态时间', value: t.finished_at });

  if (t.business_type === 'deposit') {
    list.push({
      label: '入金金额',
      value: `${t.amount} ${t.currency_code}${t.network_code ? ` · ${t.network_code}` : ''}`,
      accent: true,
    });
  } else if (t.business_type === 'exchange') {
    list.push({
      label: '兑换',
      value: `${t.amount} ${t.currency_code} → ${t.target_amount} ${t.target_currency_code}`,
      accent: true,
      wide: true,
    });
    if (t.exchange_rate) list.push({ label: '采用比例', value: t.exchange_rate, mono: true });
  } else {
    list.push({ label: '出金金额（实收）', value: `${t.amount} ${t.currency_code}`, accent: true });
    list.push({
      label: '手续费 / 总扣款',
      value: `${t.fee_amount} / ${t.total_amount} ${t.currency_code}`,
    });
    list.push({
      label: '付款人 → 收款人',
      value: `${t.payer_name || '—'} → ${t.payee_name || '—'}`,
      wide: true,
    });
  }
  return list;
});
</script>
