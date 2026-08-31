import { computed, ref, watchEffect } from 'vue';
import type { DepositChannelItem } from '@/api/modules/deposit';

/** 按接口提供的通道联动币种、网络，不推算或拼接收款地址。 */
export function useDepositSelection(getChannels: () => DepositChannelItem[]) {
  const currencyCode = ref('');
  const networkCode = ref('');
  const currencies = computed(() => [...new Map(
    getChannels().map(({ currency }) => [currency.code, currency]),
  ).values()]);
  const networkChannels = computed(() => getChannels().filter(
    ({ currency }) => currency.code === currencyCode.value,
  ));

  watchEffect(() => {
    if (!currencies.value.some(({ code }) => code === currencyCode.value)) {
      currencyCode.value = currencies.value[0]?.code ?? '';
    }
    if (!networkChannels.value.some(({ network }) => network.code === networkCode.value)) {
      networkCode.value = networkChannels.value[0]?.network.code ?? '';
    }
  });

  const activeChannel = computed(() => networkChannels.value.find(
    ({ network }) => network.code === networkCode.value,
  ) ?? null);

  return { currencyCode, networkCode, currencies, networkChannels, activeChannel };
}
