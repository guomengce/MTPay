<template>
  <main class="business-detail deposit-detail">
    <button class="business-detail__back" type="button" @click="goBack">
      <i class="ri-arrow-left-line" />返回入金列表
    </button>

    <div v-loading="loading" class="business-detail__content">
      <template v-if="detail">
        <DetailOrderHero
          eyebrow="入金订单"
          :order-no="detail.order_no"
          :status="detail.status_name"
          :status-type="statusType"
          :status-effect="detail.status === 0 ? 'pending' : undefined"
        >
          <div class="deposit-detail__primary">
            <span class="deposit-detail__asset-icon"><i class="ri-wallet-3-line" /></span>
            <div class="deposit-detail__amount">
              <small>入金金额</small>
              <p>
                <strong>{{ detail.amount }}</strong
                ><span>{{ detail.currency.code }}</span>
              </p>
            </div>
            <div class="deposit-detail__channel">
              <small>入金网络</small>
              <strong>{{ detail.network.name }}（{{ detail.network.code }}）</strong>
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

        <div class="business-detail__sections" :class="{ 'is-single': !showResolution }">
          <DetailCard
            class="business-detail__wide"
            title="链上凭证"
            description="订单提交时保存的收款地址与链上交易哈希"
            icon="ri-links-line"
          >
            <DetailFieldGrid :items="chainItems" @copy="copyField" />
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
            :title="detail.status === 1 ? '入账结果' : '驳回结果'"
            :description="detail.status === 1 ? '资金入账及审核记录' : '本次入金未通过审核'"
            :icon="detail.status === 1 ? 'ri-checkbox-circle-line' : 'ri-close-circle-line'"
          >
            <DetailFieldGrid :items="resolutionItems" />
          </DetailCard>
        </div>
      </template>

      <el-empty v-else-if="!loading" description="未找到该入金订单">
        <el-button type="primary" @click="goBack">返回入金列表</el-button>
      </el-empty>
    </div>
  </main>
</template>

<script setup lang="ts">
/**
 * 入金详情
 * 只展示当前代理有业务价值的订单、链上凭证、后端时间线和最终审核结果。
 * 当前代理身份、数据库 ID、更新时间等无辨识价值字段不进入页面。
 */
import { computed, onMounted, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';

import type { StatusBadgeType } from '@/components/admin/StatusBadge.vue';
import DetailCard from '@/components/detail/DetailCard.vue';
import DetailFieldGrid from '@/components/detail/DetailFieldGrid.vue';
import type { DetailFieldItem } from '@/components/detail/DetailFieldGrid.vue';
import DetailOrderHero from '@/components/detail/DetailOrderHero.vue';
import DetailTimeline from '@/components/detail/DetailTimeline.vue';
import { useDepositDetail } from '@/views/deposit/composables/useDepositDetail';

const route = useRoute();
const router = useRouter();
const { loading, detail, fetchDetail } = useDepositDetail();
const id = computed(() => Number(route.params.id));

const statusType = computed<StatusBadgeType>(() => {
  if (detail.value?.status === 1) return 'success';
  if (detail.value?.status === 2) return 'danger';
  return 'warning';
});

const chainItems = computed<DetailFieldItem[]>(() =>
  detail.value
    ? [
        {
          label: '平台收款地址',
          value: detail.value.receiving_address_snapshot,
          wide: true,
          mono: true,
          copyable: true,
        },
        {
          label: '交易哈希 Txid',
          value: detail.value.txid,
          wide: true,
          mono: true,
          copyable: true,
        },
      ]
    : [],
);

const resolutionItems = computed<DetailFieldItem[]>(() => {
  if (!detail.value || detail.value.status === 0) return [];
  const review = detail.value.review;
  const items: DetailFieldItem[] = [];

  if (detail.value.status === 1 && detail.value.credited_at) {
    items.push({ label: '入账时间', value: detail.value.credited_at, accent: true });
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
  void router.replace({ name: 'Deposit' });
}

async function copyField(item: DetailFieldItem) {
  try {
    await navigator.clipboard.writeText(item.value);
    ElMessage.success(`${item.label}已复制`);
  } catch {
    ElMessage.error('复制失败，请手动复制');
  }
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
  &__sections.is-single > :not(.business-detail__wide) {
    grid-column: 1 / -1;
  }
  &__wide {
    grid-column: 1 / -1;
  }
}

.deposit-detail__primary {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 18px;
}
.deposit-detail__asset-icon {
  display: grid;
  width: 58px;
  height: 58px;
  flex: 0 0 58px;
  place-items: center;
  border-radius: 16px;
  color: #fff;
  background: linear-gradient(135deg, #16b9aa, #168ab5);
  box-shadow: 0 10px 24px rgb(22 157 158 / 22%);
  font-size: 27px;
}
.deposit-detail__amount {
  min-width: 0;
}
.deposit-detail__amount small,
.deposit-detail__channel small,
.detail-meta-item small {
  color: #74869b;
  font-size: 12px;
}
.deposit-detail__amount p {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 8px;
  margin: 5px 0 0;
}
.deposit-detail__amount strong {
  color: #10243d;
  font-size: clamp(28px, 4vw, 40px);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  overflow-wrap: anywhere;
}
.deposit-detail__amount span {
  color: #078c84;
  font-size: 16px;
  font-weight: 700;
}
.deposit-detail__channel {
  display: grid;
  min-width: 0;
  gap: 6px;
  margin-left: auto;
  padding-left: 22px;
  border-left: 1px solid #dce8ef;
}
.deposit-detail__channel strong {
  color: #2e425a;
  font-size: 15px;
  font-weight: 600;
  overflow-wrap: anywhere;
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
  .business-detail__sections.is-single > :not(.business-detail__wide) {
    grid-column: auto;
  }
  .deposit-detail__primary {
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 14px;
  }
  .deposit-detail__asset-icon {
    width: 50px;
    height: 50px;
    flex-basis: 50px;
    border-radius: 14px;
  }
  .deposit-detail__amount {
    flex: 1;
  }
  .deposit-detail__channel {
    width: 100%;
    margin-left: 0;
    padding: 14px 0 0;
    border-top: 1px solid #dce8ef;
    border-left: 0;
  }
}
</style>
