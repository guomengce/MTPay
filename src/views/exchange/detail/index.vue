<template>
  <main class="business-detail exchange-detail">
    <button class="business-detail__back" type="button" @click="goBack">
      <i class="ri-arrow-left-line" />返回兑换列表
    </button>

    <div v-loading="loading" class="business-detail__content">
      <template v-if="detail">
        <DetailOrderHero
          eyebrow="兑换订单"
          :order-no="detail.order_no"
          :status="detail.status_name"
          :status-type="statusType"
          :status-effect="detail.status === 0 ? 'pending' : undefined"
        >
          <div class="exchange-flow">
            <div class="exchange-flow__asset is-source">
              <small>支付金额</small>
              <p>
                <strong>{{ detail.source_amount }}</strong
                ><span>{{ detail.source_currency.code }}</span>
              </p>
              <em>{{ detail.source_currency.name }}</em>
            </div>
            <span class="exchange-flow__arrow"><i class="ri-arrow-right-line" /></span>
            <div class="exchange-flow__asset is-target">
              <small>{{ targetAmountLabel }}</small>
              <p>
                <strong>{{ detail.target_amount }}</strong
                ><span>{{ detail.target_currency.code }}</span>
              </p>
              <em>{{ detail.target_currency.name }}</em>
            </div>
          </div>

          <template #meta>
            <div class="detail-meta-item">
              <i class="ri-calendar-event-line" />
              <span
                ><small>提交时间</small><strong>{{ detail.submitted_at || '—' }}</strong></span
              >
            </div>
          </template>
        </DetailOrderHero>

        <div
          class="business-detail__sections"
          :class="{ 'has-no-timeline': !detail.timeline.length }"
        >
          <DetailCard
            title="订单汇率快照"
            description="订单提交时由后端锁定，后续不随平台比例变化"
            icon="ri-exchange-dollar-line"
          >
            <DetailFieldGrid :items="snapshotItems" />
          </DetailCard>

          <DetailCard
            v-if="detail.timeline.length"
            title="处理时间线"
            description="由后端返回的订单真实处理节点"
            icon="ri-time-line"
          >
            <DetailTimeline :items="detail.timeline" />
          </DetailCard>

          <DetailCard
            v-if="showResolution"
            class="business-detail__wide"
            :title="detail.status === 1 ? '兑换完成' : '兑换驳回'"
            :description="detail.status === 1 ? '审核与资产到账结果' : '订单驳回及资金释放记录'"
            :icon="detail.status === 1 ? 'ri-checkbox-circle-line' : 'ri-close-circle-line'"
          >
            <DetailFieldGrid :items="resolutionItems" />
          </DetailCard>
        </div>
      </template>

      <el-empty v-else-if="!loading" description="未找到该兑换订单">
        <el-button type="primary" @click="goBack">返回兑换列表</el-button>
      </el-empty>
    </div>
  </main>
</template>

<script setup lang="ts">
/**
 * 兑换详情
 * 接口汇率快照和金额转换关系是页面核心；同一字段只出现一次。
 * 当前代理身份及数据库技术字段不展示，待审核时不创建空审核区域。
 */
import { computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import type { StatusBadgeType } from '@/components/admin/StatusBadge.vue';
import DetailCard from '@/components/detail/DetailCard.vue';
import DetailFieldGrid from '@/components/detail/DetailFieldGrid.vue';
import type { DetailFieldItem } from '@/components/detail/DetailFieldGrid.vue';
import DetailOrderHero from '@/components/detail/DetailOrderHero.vue';
import DetailTimeline from '@/components/detail/DetailTimeline.vue';
import { useExchangeDetail } from '@/views/exchange/composables/useExchangeDetail';

const route = useRoute();
const router = useRouter();
const { loading, detail, fetchDetail } = useExchangeDetail();
const id = computed(() => Number(route.params.id));

const statusType = computed<StatusBadgeType>(() => {
  if (detail.value?.status === 1) return 'success';
  if (detail.value?.status === 2) return 'danger';
  return 'warning';
});

const targetAmountLabel = computed(() => {
  if (detail.value?.status === 1) return '实际到账';
  if (detail.value?.status === 2) return '原计划到账';
  return '审核通过后到账';
});

const snapshotItems = computed<DetailFieldItem[]>(() => {
  if (!detail.value) return [];
  const items: DetailFieldItem[] = [
    {
      label: '实际兑换比例',
      value: `1 ${detail.value.source_currency.code} = ${detail.value.exchange_rate} ${detail.value.target_currency.code}`,
      wide: true,
      accent: true,
    },
    { label: '比例来源', value: detail.value.rate_source_name },
  ];
  if (detail.value.frozen_at) items.push({ label: '资金冻结时间', value: detail.value.frozen_at });
  return items;
});

const resolutionItems = computed<DetailFieldItem[]>(() => {
  if (!detail.value || detail.value.status === 0) return [];
  const review = detail.value.review;
  const items: DetailFieldItem[] = [];

  if (detail.value.status === 1 && detail.value.completed_at) {
    items.push({ label: '到账完成时间', value: detail.value.completed_at, accent: true });
  }
  if (review.admin_name) items.push({ label: '审核人', value: review.admin_name });
  if (review.reviewed_at) items.push({ label: '审核时间', value: review.reviewed_at });
  if (review.note) {
    items.push({
      label: detail.value.status === 2 ? '驳回原因' : '审核备注',
      value: review.note,
      wide: true,
    });
  }
  return items;
});

const showResolution = computed(() =>
  Boolean(detail.value && detail.value.status !== 0 && resolutionItems.value.length),
);

async function reload() {
  if (!Number.isInteger(id.value) || id.value <= 0) return;
  await fetchDetail(id.value);
}

function goBack() {
  void router.replace({ name: 'Exchange' });
}

onMounted(reload);
watch(id, reload);
</script>

<style scoped lang="scss">
.business-detail {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 16px;
  padding: 24px 32px 40px;

  &__back {
    display: inline-flex;
    width: fit-content;
    align-items: center;
    gap: 7px;
    padding: 0;
    border: 0;
    color: #5d7087;
    background: transparent;
    cursor: pointer;
    font: inherit;
    font-size: 13px;

    &:hover {
      color: #0b9b92;
    }
  }

  &__content {
    min-height: 300px;
  }
  &__sections {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px;
    margin-top: 18px;
  }
  &__sections.has-no-timeline > :first-child {
    grid-column: 1 / -1;
  }
  &__wide {
    grid-column: 1 / -1;
  }
}

.exchange-flow {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 52px minmax(0, 1fr);
  align-items: center;
  gap: 18px;
}
.exchange-flow__asset {
  min-width: 0;
  padding: 18px 20px;
  border: 1px solid #dbe7ef;
  border-radius: 15px;
  background: rgb(255 255 255 / 72%);
}
.exchange-flow__asset.is-source {
  border-color: #bfe7e2;
  background: linear-gradient(135deg, #f7fffd, #effaf8);
}
.exchange-flow__asset.is-target {
  border-color: #cfddf4;
  background: linear-gradient(135deg, #fafcff, #f1f6ff);
}
.exchange-flow__asset small,
.detail-meta-item small {
  color: #74869b;
  font-size: 12px;
}
.exchange-flow__asset p {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 8px;
  margin: 7px 0 5px;
}
.exchange-flow__asset strong {
  color: #10243d;
  font-size: clamp(25px, 3.5vw, 36px);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  overflow-wrap: anywhere;
}
.exchange-flow__asset span {
  color: #078c84;
  font-size: 15px;
  font-weight: 700;
}
.exchange-flow__asset.is-target span {
  color: #246fc9;
}
.exchange-flow__asset em {
  color: #74869b;
  font-size: 12px;
  font-style: normal;
}
.exchange-flow__arrow {
  display: grid;
  width: 46px;
  height: 46px;
  place-items: center;
  border: 5px solid #fff;
  border-radius: 50%;
  color: #fff;
  background: linear-gradient(135deg, #16b9aa, #1d8db5);
  box-shadow: 0 9px 20px rgb(22 158 160 / 22%);
  font-size: 20px;
}
.detail-meta-item {
  display: flex;
  align-items: center;
  gap: 9px;
}
.detail-meta-item > i {
  color: #138f9f;
  font-size: 18px;
}
.detail-meta-item > span {
  display: grid;
  gap: 3px;
}
.detail-meta-item strong {
  color: #2e425a;
  font-size: 13px;
  font-weight: 600;
}

@include narrow {
  .business-detail {
    padding: 18px 20px 32px;
  }
}

@include mobile {
  .business-detail {
    padding: 16px 0 28px;
  }
  .business-detail__back {
    margin-left: 2px;
  }
  .business-detail__sections {
    grid-template-columns: minmax(0, 1fr);
    gap: 14px;
    margin-top: 14px;
  }
  .business-detail__wide,
  .business-detail__sections.has-no-timeline > :first-child {
    grid-column: auto;
  }
  .exchange-flow {
    grid-template-columns: minmax(0, 1fr);
    gap: 8px;
  }
  .exchange-flow__arrow {
    transform: rotate(90deg);
    justify-self: center;
  }
  .exchange-flow__asset {
    padding: 16px;
  }
}
</style>
