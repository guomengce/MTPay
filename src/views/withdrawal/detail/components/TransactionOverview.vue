<template>
  <section class="transaction-overview">
    <div class="amounts">
      <header class="section-title">
        <div class="section-title__main">
          <span class="section-title__icon"><i class="ri-wallet-3-line" /></span>
          <h2>{{ t('withdrawal.amountDetails') }}</h2>
        </div>
        <el-button
          circle
          plain
          size="small"
          :icon="DocumentCopy"
          :aria-label="t('withdrawal.copyParty')"
          @click="copyWithdrawalSummary"
        />
      </header>
      <div class="amounts__rows">
        <div>
          <span><i class="is-debit" />{{ t('withdrawal.accountDeduction') }}</span
          ><strong
            >{{ formatMoney(detail.total_amount) }}
            <small>{{ detail.currency.code }}</small></strong
          >
        </div>
        <div>
          <span><i class="is-fee" />{{ t('withdrawal.fixedFee') }}</span
          ><strong
            >{{ formatMoney(detail.fee_amount) }} <small>{{ detail.currency.code }}</small></strong
          >
        </div>
        <div class="is-result">
          <span><i />{{ t('withdrawal.actualWithdrawal') }}</span
          ><strong
            >{{ formatMoney(detail.amount) }} <small>{{ detail.currency.code }}</small></strong
          >
        </div>
      </div>
    </div>
    <div class="parties">
      <header class="section-title">
        <div class="section-title__main">
          <span class="section-title__icon"><i class="ri-group-line" /></span>
          <h2>{{ t('withdrawal.transactionParties') }}</h2>
        </div>
      </header>
      <div class="parties__grid">
        <CompanyInfoCard
          v-if="detail.payer.entity_type === 1"
          :data="detail.payer.data ?? {}"
          :role="1"
          :show-copy="false"
          :title="t('withdrawal.payerCompany')"
        />
        <IndividualInfoCard
          v-else-if="detail.payer.entity_type === 2"
          :data="detail.payer.data ?? {}"
          :role="1"
          :show-copy="false"
          :title="t('withdrawal.payerPerson')"
        />
        <div class="parties__payee-group">
          <CompanyInfoCard
            v-if="detail.payee.entity_type === 1"
            :data="detail.payee.data ?? {}"
            :role="2"
            :show-copy="false"
            :title="t('withdrawal.payeeCompany')"
          />
          <IndividualInfoCard
            v-else-if="detail.payee.entity_type === 2"
            :data="detail.payee.data ?? {}"
            :role="2"
            :show-copy="false"
            :title="t('withdrawal.payeePerson')"
          />
          <BankInfoCard
            :data="detail.payee.data ?? {}"
            :role="2"
            :show-copy="false"
            :title="t('withdrawal.bankDetails')"
          />
        </div>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import CompanyInfoCard from '@/components/party-info/CompanyInfoCard.vue';
import IndividualInfoCard from '@/components/party-info/IndividualInfoCard.vue';
import BankInfoCard from '@/components/party-info/BankInfoCard.vue';
import { DocumentCopy } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import type { WithdrawalOrderDetail } from '@/api/modules/withdrawal';
import { getCountryLabel } from '@/constants/countries';
import { formatMoney } from '@/utils/formatMoney';

const props = defineProps<{ detail: WithdrawalOrderDetail }>();
const { t, locale } = useI18n();

function text(value: unknown) {
  return value == null ? '' : String(value).trim();
}

function countryName(value: unknown) {
  const raw = text(value);
  return raw ? getCountryLabel(raw, locale.value) : '';
}

function partyName(party: WithdrawalOrderDetail['payer']) {
  const data = party.data ?? {};
  if (party.entity_type === 1) return text(data.company_name) || text(party.name);
  return [text(data.surname), text(data.given_name)].filter(Boolean).join(' ') || text(party.name);
}

function partyAddress(party: WithdrawalOrderDetail['payer']) {
  const data = party.data ?? {};
  const country =
    party.entity_type === 1
      ? countryName(data.operating_country) || countryName(data.registration_country)
      : countryName(data.residence_country);
  return [text(data.address), text(data.city), country].filter(Boolean).join(' ');
}

function moneyLabel(code: string) {
  return code.toUpperCase() === 'USD' ? t('withdrawal.copyUsd') : code.toUpperCase();
}

function buildWithdrawalSummary() {
  const { detail } = props;
  const payer = detail.payer;
  const payee = detail.payee;
  const bank = payee.data ?? {};
  return [
    `${t('withdrawal.orderNo')}： ${text(detail.order_no)}`,
    '',
    t('withdrawal.copyPayer'),
    `${t('withdrawal.copyName')}： ${partyName(payer)}`,
    `${t('whitelist.address')}： ${partyAddress(payer)}`,
    '',
    t('withdrawal.copyPayee'),
    `${t('withdrawal.copyName')}： ${partyName(payee)}`,
    `${t('whitelist.address')}： ${partyAddress(payee)}`,
    `${t('whitelist.bankName')}： ${text(bank.bank_name)}`,
    `${t('whitelist.bankAccount')}： ${text(bank.bank_account)}`,
    `${t('whitelist.swift')}： ${text(bank.swift)}`,
    `${t('whitelist.remark')}： ${text(bank.remark)}`,
    '',
    `${moneyLabel(detail.currency.code)}： ${formatMoney(detail.total_amount)}`,
  ].join('\n');
}

async function copyWithdrawalSummary() {
  try {
    await navigator.clipboard.writeText(buildWithdrawalSummary());
    ElMessage.success(t('withdrawal.partyCopied'));
  } catch {
    ElMessage.error(t('withdrawal.copyFailed'));
  }
}
</script>
<style scoped lang="scss">
.transaction-overview {
  overflow: hidden;
  border: 1px solid #d8e3ec;
  border-radius: 15px;
  background: #fff;
  box-shadow:
    0 2px 5px rgb(20 46 78 / 4%),
    0 12px 30px rgb(20 46 78 / 8%);
}

.section-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 11px;
  padding: 18px 20px 10px;
  color: #142e4e;
  background: #fff;

  &__main {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: 11px;
  }

  h2 {
    margin: 0;
    font-size: 16px;
    font-weight: 700;
  }

  &__icon {
    display: grid;
    place-items: center;
    width: 32px;
    height: 32px;
    flex: none;
    border-radius: 9px;
    color: #08a6a4;
    background: #e5f7f5;
    font-size: 18px;
  }

  .el-button {
    flex: none;
    margin-left: auto;
    color: #168f89;
  }
}

.amounts {
  padding: 0 15px 15px;

  &__rows {
    display: grid;
    padding-top: 10px;
    gap: 2px;
  }

  &__rows > div {
    display: flex;
    min-width: 0;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    min-height: 45px;
    padding: 7px 10px;
    color: #53677c;

    > span {
      display: inline-flex;
      align-items: center;
      gap: 9px;
      font-size: 13px;
    }

    span i {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #4c89cf;
    }

    span .is-fee {
      background: #d99a2b;
    }

    strong {
      color: #18314c;
      font-size: 20px;
      font-variant-numeric: tabular-nums;
      text-align: right;
    }

    small {
      font-size: 11px;
    }
  }

  &__rows .is-result {
    min-height: 54px;
    border-radius: 9px;
    color: #087f79;
    background: linear-gradient(90deg, #effaf8, #e8f7f4);
    font-weight: 700;

    span i {
      background: #07978f;
      box-shadow: 0 0 0 4px rgb(7 151 143 / 10%);
    }

    strong {
      color: #078f87;
      font-size: 26px;
    }
  }
}

.amounts > .section-title {
  margin: 0 -15px;
}

.parties {
  border-top: 1px solid #e2e9ef;

  &__grid {
    display: grid;
    align-items: start;
    padding: 18px 20px 20px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px;
  }

  &__payee-group {
    display: grid;
    min-width: 0;
    overflow: hidden;
    gap: 0;
    border: 1px solid #dce6f3;
    border-radius: 14px;
    background: #f8faff;
  }
}

.parties__payee-group :deep(.party-card) {
  overflow: visible;
  border: 0;
  border-radius: 0 !important;
  background: transparent;
  box-shadow: none;
}

.parties__payee-group :deep(.party-card.is-bank) {
  overflow: visible;
  border: 0;
  border-radius: 0;
  box-shadow: none;
}

.parties__payee-group :deep(.party-card.is-bank > header) {
  display: none;
}

.parties__payee-group :deep(.party-card.is-bank .party-card__title i),
.parties__payee-group :deep(.party-card.is-bank .party-card__actions) {
  display: none;
}

.parties__payee-group :deep(.party-card.is-bank .party-card__title h3) {
  color: #5e7186;
  font-size: 11px;
}

.parties__payee-group :deep(.party-card.is-bank .party-card__fields) {
  padding-top: 0;
}

.parties__payee-group :deep(.party-card:not(.is-bank) .party-card__fields) {
  padding-bottom: 0;
}

@include mobile {
  .amounts {
    padding: 0 12px 12px;

    > .section-title {
      margin: 0 -12px;
    }

    &__rows > div strong {
      font-size: 16px;
    }

    &__rows .is-result strong {
      font-size: 21px;
    }
  }

  .parties__grid {
    padding: 14px;
    grid-template-columns: 1fr;
  }
}
</style>
