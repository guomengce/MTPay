<template>
  <DetailCard title="业务详情" description="对应业务的只读详情快照" icon="ri-information-line">
    <DetailFieldGrid :items="fields" />
  </DetailCard>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import type { TransactionBusinessType } from '@/api/modules/transaction';
import DetailCard from '@/components/detail/DetailCard.vue';
import DetailFieldGrid, { type DetailFieldItem } from '@/components/detail/DetailFieldGrid.vue';

const props = defineProps<{
  businessType: TransactionBusinessType;
  detail: Record<string, unknown>;
}>();

function text(value: unknown) {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'object') {
    const record = value as Record<string, unknown>;
    return String(record.name ?? record.code ?? JSON.stringify(record));
  }
  return String(value);
}

function field(label: string, value: unknown, options: Partial<DetailFieldItem> = {}): DetailFieldItem {
  return { label, value: text(value), ...options };
}

function notDash(item: DetailFieldItem) {
  return item.value !== '—';
}

const fields = computed<DetailFieldItem[]>(() => {
  const d = props.detail;
  if (props.businessType === 'deposit') {
    const review = (d.review ?? {}) as Record<string, unknown>;
    return [
      field('币种 / 网络', `${text(d.currency)} · ${text(d.network)}`),
      field('入金金额', d.amount, { mono: true }),
      field('交易哈希', d.txid, { wide: true, mono: true }),
      field('平台收款地址', d.receiving_address_snapshot, { wide: true, mono: true }),
      field('审核人', review.admin_name),
      field('审核时间', review.reviewed_at),
      field('审核说明', review.note, { wide: true }),
      field('入账时间', d.credited_at),
      field('当前状态', d.status_name),
    ].filter(notDash);
  }
  if (props.businessType === 'exchange') {
    const review = (d.review ?? {}) as Record<string, unknown>;
    return [
      field('兑换方向', `${text(d.source_currency)} → ${text(d.target_currency)}`),
      field('支付数量', d.source_amount, { mono: true }),
      field('采用比例', d.exchange_rate, { mono: true }),
      field('比例来源', d.rate_source_name),
      field('获得金额', d.target_amount, { mono: true, accent: true }),
      field('冻结时间', d.frozen_at),
      field('审核人', review.admin_name),
      field('审核时间', review.reviewed_at),
      field('审核说明', review.note, { wide: true }),
      field('完成时间', d.completed_at),
      field('当前状态', d.status_name),
    ].filter(notDash);
  }
  const payer = (d.payer ?? {}) as Record<string, unknown>;
  const payee = (d.payee ?? {}) as Record<string, unknown>;
  const review = (d.review ?? {}) as Record<string, unknown>;
  const payment = (d.payment ?? {}) as Record<string, unknown>;
  return [
    field('出金金额（实收）', d.amount, { mono: true, accent: true }),
    field('固定手续费', d.fee_amount, { mono: true }),
    field('总扣款', d.total_amount, { mono: true }),
    field('付款人', payer.name, { wide: true }),
    field('付款人白名单编号', payer.whitelist_no, { mono: true }),
    field('收款人', payee.name, { wide: true }),
    field('收款人白名单编号', payee.whitelist_no, { mono: true }),
    field('审核人', review.admin_name),
    field('审核时间', review.reviewed_at),
    field('审核说明', review.note, { wide: true }),
    field('进入付款处理', payment.processing_at),
    field('付款完成时间', payment.completed_at),
    field('付款失败时间', payment.failed_at),
    field('付款失败原因', payment.failure_reason, { wide: true }),
    field('当前状态', d.status_name),
  ].filter(notDash);
});
</script>
