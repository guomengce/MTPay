<template>
  <section class="transaction-overview">
    <div class="amounts">
      <header class="section-title"><i />{{ t('withdrawal.amountDetails') }}</header>
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
            >{{ formatMoney(formatFixedFee(detail.fee_amount)) }}
            <small>{{ detail.currency.code }}</small></strong
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
      <header class="section-title"><i />{{ t('withdrawal.transactionParties') }}</header>
      <div class="parties__grid">
        <PayerCompanyCard v-if="detail.payer.entity_type === 1" :party="detail.payer" />
        <PayerPersonCard v-else-if="detail.payer.entity_type === 2" :party="detail.payer" />
        <div class="parties__payee-group">
          <PayeeCompanyCard v-if="detail.payee.entity_type === 1" :party="detail.payee" />
          <PayeePersonCard v-else-if="detail.payee.entity_type === 2" :party="detail.payee" />
          <PayeeBankCard :party="detail.payee" />
        </div>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { WithdrawalOrderDetail } from '@/api/modules/withdrawal';
import { formatMoney } from '@/utils/formatMoney';
import { formatFixedFee } from '@/utils/decimal';
import PayerCompanyCard from './PayerCompanyCard.vue';
import PayerPersonCard from './PayerPersonCard.vue';
import PayeeCompanyCard from './PayeeCompanyCard.vue';
import PayeePersonCard from './PayeePersonCard.vue';
import PayeeBankCard from './PayeeBankCard.vue';
defineProps<{ detail: WithdrawalOrderDetail }>();
const { t } = useI18n();
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
  gap: 10px;
  padding: 11px 14px;
  color: #29445e;
  border-bottom: 1px solid #e2e9ef;
  background: #f5f8fb;
  font-size: 13px;
  font-weight: 700;

  i {
    width: 3px;
    height: 18px;
    border-radius: 99px;
    background: #0aa49a;
    box-shadow: 0 0 0 3px rgb(10 164 154 / 8%);
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
