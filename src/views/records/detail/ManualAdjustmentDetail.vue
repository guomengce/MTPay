<template>
  <section class="manual-detail">
    <DetailOrderHero
      :eyebrow="t('records.' + transaction.business_type)"
      :order-no="transaction.order_no"
      :status="transaction.status_name"
      :status-type="increase ? 'success' : 'danger'"
    />
    <DetailCard
      :title="t('records.adjustmentInfo')"
      icon="ri-file-list-3-line"
      class="manual-detail__card"
    >
      <div class="manual-detail__summary">
        <span class="manual-detail__icon" :class="{ 'is-decrease': !increase }">
          <i :class="increase ? 'ri-add-line' : 'ri-subtract-line'" />
        </span>
        <div>
          <small>{{ t('records.amount') }}</small>
          <strong>{{ transactionAmount(transaction) }}</strong>
        </div>
      </div>

      <div class="manual-detail__balance-flow">
        <div>
          <small>{{ t('records.beforeAvailableBalance') }}</small>
          <strong>{{ balance(detail.balance_before) }}</strong>
        </div>
        <span><i class="ri-arrow-right-line" /></span>
        <div class="is-result">
          <small>{{ t('records.afterAvailableBalance') }}</small>
          <strong>{{ balance(detail.balance_after) }}</strong>
        </div>
      </div>

      <div class="manual-detail__details">
        <section class="info-group is-agent">
          <header>
            <span><i class="ri-building-4-line" /></span>
            <strong>{{ t('records.agentAccount') }}</strong>
          </header>
          <dl>
            <div>
              <dt>{{ t('records.agentCompany') }}</dt>
              <dd>{{ transaction.user.company_name || '-' }}</dd>
            </div>
            <div>
              <dt>{{ t('records.agentEmail') }}</dt>
              <dd>{{ transaction.user.email || '-' }}</dd>
            </div>
          </dl>
        </section>
        <section class="info-group is-operation">
          <header>
            <span><i class="ri-user-settings-line" /></span>
            <strong>{{ t('records.operationInfo') }}</strong>
          </header>
          <dl>
            <div>
              <dt>{{ t('records.operator') }}</dt>
              <dd>{{ detail.admin?.name || detail.admin_name || '-' }}</dd>
            </div>
            <div>
              <dt>{{ t('records.operatedAt') }}</dt>
              <dd>{{ detail.adjusted_at || detail.created_at || transaction.submitted_at || '-' }}</dd>
            </div>
          </dl>
        </section>
        <section class="reason-panel">
          <header>
            <i class="ri-file-text-line" />
            <strong>{{ t('records.adjustmentReason') }}</strong>
          </header>
          <p>{{ detail.reason || '-' }}</p>
        </section>
      </div>
    </DetailCard>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type {
  ManualBalanceAdjustmentDetail,
  TransactionItem,
} from '@/api/modules/transaction';
import DetailCard from '@/components/detail/DetailCard.vue';
import DetailOrderHero from '@/components/detail/DetailOrderHero.vue';
import { formatMoney } from '@/utils/formatMoney';
import { transactionAmount } from '../transactionPresentation';

const props = defineProps<{
  transaction: TransactionItem;
  detail: ManualBalanceAdjustmentDetail;
}>();
const { t } = useI18n();

const increase = computed(() => props.transaction.business_type === 'manual_increase');

function balance(value?: string | null) {
  return value == null || value === '' ? '-' : `${formatMoney(value)} ${props.transaction.currency_code}`;
}
</script>

<style scoped lang="scss">
.manual-detail {
  display: grid;
  min-width: 0;
  gap: 18px;
}

.manual-detail__card:deep(.detail-card__body) {
  margin: 0 -24px -22px;
}

.manual-detail__summary {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  border-bottom: 1px solid #e5edf3;
  background: linear-gradient(135deg, #fbfefd, #f6fbff);
}

.manual-detail__icon {
  display: grid;
  width: 56px;
  height: 56px;
  flex: 0 0 56px;
  place-items: center;
  border-radius: 16px;
  color: #fff;
  background: linear-gradient(135deg, #12b59f, #078f79);
  font-size: 28px;
  box-shadow: 0 10px 22px rgb(8 143 121 / 18%);
}

.manual-detail__icon.is-decrease {
  background: linear-gradient(135deg, #fb7185, #dc3d51);
  box-shadow: 0 10px 22px rgb(220 61 81 / 18%);
}

.manual-detail__summary > div {
  min-width: 0;
}

.manual-detail__summary small,
.manual-detail__balance-flow small {
  color: #74869b;
  font-size: 12px;
}

.manual-detail__summary strong {
  display: block;
  margin-top: 5px;
  color: #10243d;
  font-size: clamp(27px, 3vw, 38px);
  font-variant-numeric: tabular-nums;
  overflow-wrap: anywhere;
}

.manual-detail__balance-flow {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 40px minmax(0, 1fr);
  align-items: center;
  gap: 14px;
  padding: 18px 24px;
  border-bottom: 1px solid #e5edf3;
  background: #fff;
}

.manual-detail__balance-flow > div {
  display: grid;
  gap: 6px;
  padding: 14px 16px;
  border: 1px solid #dfe8ef;
  border-radius: 12px;
  background: #f8fafc;
}

.manual-detail__balance-flow strong {
  color: #10243d;
  font-size: 17px;
  font-variant-numeric: tabular-nums;
  overflow-wrap: anywhere;
}

.manual-detail__balance-flow > div.is-result {
  border-color: #bfe5df;
  background: linear-gradient(135deg, #f0fbf8, #f7fcff);
}

.manual-detail__balance-flow > div.is-result strong {
  color: #078f84;
}

.manual-detail__balance-flow > span {
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  border: 1px solid #cfe0e9;
  border-radius: 50%;
  color: #0a9b91;
  background: #fff;
}

.manual-detail__details {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  padding: 20px 24px 24px;
  background: #fbfcfe;
}

.info-group {
  overflow: hidden;
  border: 1px solid #dfe8f0;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 8px 22px rgb(21 50 82 / 4%);
}

.info-group > header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  border-bottom: 1px solid #e7edf3;
  color: #10243d;
  background: #f6fafc;
}

.info-group > header span {
  display: grid;
  width: 32px;
  height: 32px;
  place-items: center;
  border-radius: 9px;
  color: #087f78;
  background: #e4f6f3;
  font-size: 17px;
}

.info-group.is-operation > header span {
  color: #2767c7;
  background: #eaf2ff;
}

.info-group > header strong {
  font-size: 14px;
}

.info-group dl {
  display: grid;
  margin: 0;
  padding: 4px 16px 10px;
}

.info-group dl > div {
  display: grid;
  grid-template-columns: 92px minmax(0, 1fr);
  gap: 14px;
  padding: 13px 0;
  border-bottom: 1px dashed #e5ebf1;
}

.info-group dl > div:last-child {
  border-bottom: 0;
}

.info-group dt {
  color: #74869b;
  font-size: 12px;
}

.info-group dd {
  min-width: 0;
  margin: 0;
  color: #10243d;
  font-size: 14px;
  font-weight: 650;
  overflow-wrap: anywhere;
}

.reason-panel {
  grid-column: 1 / -1;
  padding: 16px 18px;
  border: 1px solid #d9e6ee;
  border-left: 4px solid #0a9b91;
  border-radius: 12px;
  background: linear-gradient(100deg, #f2fbf9, #f8fbff);
}

.reason-panel header {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #087f78;
  font-size: 14px;
}

.reason-panel p {
  margin: 12px 0 0;
  color: #30475f;
  font-size: 14px;
  font-weight: 550;
  line-height: 1.7;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
}

@include mobile {
  .manual-detail {
    gap: 14px;
  }

  .manual-detail__card:deep(.detail-card__body) {
    margin: 0 -18px -19px;
  }

  .manual-detail__summary {
    align-items: flex-start;
    padding: 18px;
  }

  .manual-detail__icon {
    width: 48px;
    height: 48px;
    flex-basis: 48px;
    border-radius: 14px;
    font-size: 24px;
  }

  .manual-detail__balance-flow {
    grid-template-columns: 1fr;
    padding: 14px;
  }

  .manual-detail__balance-flow > span {
    margin: auto;
    transform: rotate(90deg);
  }

  .manual-detail__details {
    grid-template-columns: 1fr;
    padding: 14px;
  }

  .reason-panel {
    grid-column: auto;
  }

  .info-group dl > div {
    grid-template-columns: 82px minmax(0, 1fr);
  }
}
</style>
