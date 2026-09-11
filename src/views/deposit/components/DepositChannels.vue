<template>
  <section class="deposit-channels">
    <div class="deposit-channels__selectors">
      <div class="deposit-channels__field">
        <label id="deposit-currency-label">{{ t('deposit.currency') }}</label>
        <el-select v-model="currencyCode" aria-labelledby="deposit-currency-label" :placeholder="t('deposit.currencyPlaceholder')" :loading="channelsLoading" :disabled="channelsLoading || !currencies.length">
          <el-option v-for="currency in currencies" :key="currency.code" :value="currency.code" :label="`${currency.code} · ${currency.name}`" />
        </el-select>
      </div>
      <div class="deposit-channels__field">
        <label id="deposit-network-label">{{ t('deposit.network') }}</label>
        <el-select v-model="networkCode" aria-labelledby="deposit-network-label" :placeholder="t('deposit.networkPlaceholder')" :loading="channelsLoading" :disabled="channelsLoading || !networkChannels.length">
          <el-option v-for="channel in networkChannels" :key="channel.wallet_address_id" :value="channel.network.code" :label="`${channel.network.code} · ${channel.network.name}`" />
        </el-select>
      </div>
    </div>

    <div class="deposit-channels__payment" :class="{ 'is-empty': !address }">
      <div class="deposit-channels__qr">
        <QrcodeVue v-if="address" :value="address" :size="134" level="H" :margin="1" foreground="#141c3e" render-as="svg" />
        <div v-else class="deposit-channels__placeholder">
          <i class="ri-qr-code-line" aria-hidden="true" />
          <span>{{ t('deposit.qrCode') }}</span>
        </div>
      </div>
      <div class="deposit-channels__address-panel">
        <label for="deposit-address">{{ activeChannel ? t('deposit.addressWithNetwork', { currency: activeChannel.currency.code, network: activeChannel.network.code }) : t('deposit.address') }}</label>
        <div class="deposit-channels__address-row">
          <el-input id="deposit-address" :model-value="address" :placeholder="t('deposit.addressPlaceholder')" readonly />
          <el-button class="deposit-channels__copy" :disabled="!address" @click="copyAddress">{{ t('deposit.copy') }}</el-button>
        </div>
      </div>
    </div>

    <aside class="deposit-channels__notice">
      <strong>{{ t('deposit.warmReminder') }}</strong>
      <ul>
        <li>{{ t('deposit.depositNoticeUnsupportedNetworks') }}</li>
        <li>{{ t('deposit.depositNoticeAsset') }}</li>
        <li>{{ t('deposit.depositNoticeConfirmations') }}</li>
        <li>{{ t('deposit.depositNoticeMinimum') }}</li>
        <li>{{ t('deposit.depositNoticeAddress') }}</li>
        <li>{{ t('deposit.depositNoticeSecurity') }}</li>
      </ul>
    </aside>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import QrcodeVue from 'qrcode.vue';
import type { DepositChannelItem } from '@/api/modules/deposit';
import { useDepositSelection } from '../composables/useDepositSelection';

const props = defineProps<{ channels: DepositChannelItem[]; channelsLoading?: boolean }>();
const { t } = useI18n();
const { currencyCode, networkCode, currencies, networkChannels, activeChannel } = useDepositSelection(
  () => props.channelsLoading ? [] : props.channels,
);
const address = computed(() => activeChannel.value?.receiving_address.address ?? '');

async function copyAddress() {
  if (!address.value) return;
  try {
    await navigator.clipboard.writeText(address.value);
    ElMessage.success(t('deposit.copied'));
  } catch {
    ElMessage.warning(t('deposit.copyFailed'));
  }
}
</script>

<style scoped lang="scss">
.deposit-channels {
  display: grid;
  min-width: 0;
  gap: 16px;
  padding: 24px;
  border: 1px solid #e5edf3;
  border-radius: 16px;
  background: #fff;

  &__selectors {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }

  &__field, &__address-panel {
    display: grid;
    min-width: 0;
    gap: 10px;

    label { color: #4f647d; font-size: 13px; }
  }

  &__field :deep(.el-select) { width: 100%; }
  &__field :deep(.el-select__wrapper) { min-height: 46px; border-radius: 10px; }

  &__payment {
    display: grid;
    grid-template-columns: 156px minmax(0, 1fr);
    align-items: center;
    gap: 22px;
    padding: 20px;
    border: 1px solid #d8e1f1;
    border-radius: 14px;
    background: #f6f8fc;

    &.is-empty { border-style: dashed; }
  }

  &__qr {
    display: grid;
    width: 156px;
    height: 156px;
    box-sizing: border-box;
    place-items: center;
    border: 1px solid #d8e1f1;
    border-radius: 10px;
    background: #fff;
  }

  &__placeholder {
    display: grid;
    gap: 6px;
    color: #86a0b3;
    text-align: center;
    font-size: 12px;

    i { font-size: 34px; }
  }

  &__address-row {
    display: grid;
    min-width: 0;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 8px;

    :deep(.el-input__wrapper) { min-height: 64px; border-radius: 10px; }
  }

  &__copy {
    min-width: 64px;
    height: 64px;
    margin: 0;
    border: 0;
    border-radius: 10px;
    color: #fff;
    background: #141c3e;

    &:hover:not(:disabled), &:focus-visible { color: #fff; background: #263456; }
    &:disabled { color: #8c96aa; background: #e5e9f1; }
  }

  &__notice {
    padding: 16px 20px;
    border: 1px solid #dce7ef;
    border-radius: 12px;
    color: #52667d;
    background: #f8fbfd;
    font-size: 13px;
    line-height: 1.7;

    strong {
      color: #087f79;
      font-size: 14px;
      font-weight: 700;
    }

    ul {
      margin: 6px 0 0;
      padding-left: 20px;
    }

    li::marker {
      color: #18a89f;
    }
  }
}

@include mobile {
  .deposit-channels {
    padding: 16px;
    &__selectors { grid-template-columns: 1fr; }
    &__payment { grid-template-columns: 1fr; gap: 16px; padding: 14px; }
    &__qr { justify-self: center; }
    &__address-row :deep(.el-input__wrapper) { min-height: 52px; }
    &__copy { height: 52px; }
  }
}
</style>
