﻿﻿<template>
  <section class="apply-form">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="top"
      class="apply-form__form"
      @submit.prevent="handleSubmit"
    >
      <el-form-item label="入金通道" prop="currency_network_id">
        <el-select
          v-model="form.currency_network_id"
          placeholder="请选择币种/网络"
          :loading="channelsLoading"
          :disabled="channelsLoading"
        >
          <el-option
            v-for="item in channels"
            :key="item.currency_network_id"
            :value="item.currency_network_id"
            :label="`${item.currency.name} · ${item.network.name}`"
          />
        </el-select>
      </el-form-item>

      <section class="apply-form__payment-address" :class="{ 'is-empty': !activeChannel }">
        <div class="apply-form__qr">
          <template v-if="activeChannel">
            <QrCode
              :value="activeChannel.receiving_address.address"
              :size="116"
              :show-value="false"
              :copyable="false"
            />
          </template>
          <div v-else class="apply-form__qr-placeholder">
            <i class="ri-qr-code-line" aria-hidden="true" />
            <span>二维码</span>
          </div>
        </div>

        <div class="apply-form__address-panel">
          <label>
            <template v-if="activeChannel">
              {{ activeChannel.currency.code }}（{{ activeChannel.network.code }}）入金地址
            </template>
            <template v-else>入金地址</template>
          </label>
          <div class="apply-form__address-row">
            <el-input
              class="apply-form__address-value"
              :model-value="activeChannel?.receiving_address.address ?? ''"
              placeholder="选择入金通道后显示收款地址"
              readonly
            />
            <el-button
              class="apply-form__copy"
              type="primary"
              :icon="CopyDocument"
              :disabled="!activeChannel"
              @click="copyAddress"
            >
              复制
            </el-button>
          </div>
          <p class="apply-form__notice">
            <template v-if="activeChannel">
              仅向此地址转入 {{ activeChannel.network.code }} 网络的
              {{ activeChannel.currency.code }}，其他币种或网络将无法入账。
            </template>
            <template v-else>选择入金通道后，将在此处显示对应网络的收款信息。</template>
          </p>
        </div>
      </section>

      <div class="apply-form__transaction-fields">
        <el-form-item label="转账金额" prop="amount">
          <el-input v-model="form.amount" placeholder="请输入转账金额" :prefix-icon="Money" />
        </el-form-item>

        <el-form-item label="交易哈希 Txid" prop="txid">
          <el-input v-model="form.txid" placeholder="请输入链上交易哈希" :prefix-icon="Coin" />
        </el-form-item>
      </div>

      <el-button
        type="primary"
        native-type="submit"
        class="apply-form__action"
        :loading="submitting"
      >
        提交入金
      </el-button>
    </el-form>
  </section>
</template>

<script setup lang="ts">
/**
 * 入金申请表单组件
 * - 负责通道选择、表单校验、收款地址展示与复制；
 * - 通道数据由父组件通过 props 传入，避免组件内重复请求；
 * - 校验通过后仅向父组件提交参数，接口调用统一由模块 composable 处理。
 */
import { computed, reactive, ref as refHook } from 'vue';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { Coin, CopyDocument, Money } from '@element-plus/icons-vue';

import type { DepositChannelItem } from '@/api/modules/deposit';
import QrCode from '@/components/admin/QrCode.vue';

const props = defineProps<{
  channels: DepositChannelItem[];
  channelsLoading?: boolean;
  submitting?: boolean;
}>();

const emit = defineEmits<{
  (e: 'submit', payload: { currency_network_id: number; amount: string; txid: string }): void;
  (e: 'refresh-channels'): void;
}>();

const formRef = refHook<FormInstance>();

const form = reactive({
  currency_network_id: null as number | null,
  amount: '',
  txid: '',
});

const activeChannel = computed(() => {
  if (!form.currency_network_id) return null;
  return props.channels.find((c) => c.currency_network_id === form.currency_network_id) ?? null;
});

const rules: FormRules<{ currency_network_id: number; amount: string; txid: string }> = {
  currency_network_id: [{ required: true, message: '请选择入金通道', trigger: 'change' }],
  amount: [
    { required: true, message: '请输入转账金额', trigger: 'blur' },
    {
      pattern: /^(?!0+(?:\.0+)?$)\d{1,20}(?:\.\d{1,8})?$/,
      message: '请输入大于 0 的金额，整数最多 20 位、小数最多 8 位',
      trigger: 'blur',
    },
  ],
  txid: [
    { required: true, message: '请输入交易哈希', trigger: 'blur' },
    { pattern: /^[A-Za-z0-9]{16,255}$/, message: 'Txid 需为 16–255 位字母或数字', trigger: 'blur' },
  ],
};

async function handleSubmit() {
  if (!(await formRef.value?.validate().catch(() => false))) return;
  if (form.currency_network_id == null) return;
  emit('submit', {
    currency_network_id: form.currency_network_id,
    amount: form.amount.trim(),
    txid: form.txid.trim(),
  });
}

async function copyAddress() {
  const address = activeChannel.value?.receiving_address.address;
  if (!address) return;
  try {
    await navigator.clipboard.writeText(address);
    ElMessage.success('入金地址已复制');
  } catch {
    ElMessage.warning('复制失败，请手动复制地址');
  }
}

function reset() {
  formRef.value?.resetFields();
}

defineExpose({ reset });
</script>

<style scoped lang="scss">
.apply-form {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 18px;
  padding: 24px;
  border: 1px solid #e5edf3;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 16px 40px rgb(22 34 51 / 6%);
  &__header {
    display: flex;
    width: 100%;
    max-width: 980px;
    flex-direction: column;
    gap: 4px;
    margin: 0 auto;
  }
  &__title {
    margin: 0;
    color: #071833;
    font-size: 18px;
  }
  &__subtitle {
    margin: 0;
    color: #718197;
    font-size: 13px;
    line-height: 1.6;
  }
  &__form {
    display: flex;
    width: 100%;
    max-width: 980px;
    flex-direction: column;
    gap: 12px;
    margin: 0 auto;
  }
  &__payment-address {
    display: grid;
    grid-template-columns: 134px minmax(0, 1fr);
    align-items: center;
    gap: 16px;
    padding: 12px;
    border: 1px solid #dce7ef;
    border-radius: 14px;
    background: #f8fbfd;

    &.is-empty {
      border-style: dashed;
    }
  }
  &__qr {
    display: grid;
    place-items: center;
  }
  &__qr-placeholder {
    display: grid;
    width: 132px;
    height: 132px;
    place-content: center;
    gap: 6px;
    border: 1px dashed #c5d7e5;
    border-radius: 10px;
    color: #86a0b3;
    background: #ffffff;
    text-align: center;

    i {
      color: #64aaa5;
      font-size: 34px;
    }

    span {
      font-size: 12px;
    }
  }
  &__qr :deep(.qr-code) {
    width: auto;
    gap: 0;
    padding: 0;
    border: 0;
    background: transparent;
    box-shadow: none;
  }
  &__qr :deep(.qr-code__body) {
    min-height: auto;
  }
  &__qr :deep(.qr-code__canvas) {
    padding: 7px;
    border: 1px solid #d8e3ec;
    border-radius: 10px;
    box-shadow: none;
  }
  &__address-panel {
    display: grid;
    min-width: 0;
    gap: 9px;

    label {
      color: #4f647d;
      font-size: 13px;
      font-weight: 700;
    }
  }
  &__address-row {
    display: grid;
    min-width: 0;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 8px;
  }
  &__address-value {
    min-width: 0;
  }
  &__copy {
    min-width: 64px;
    margin: 0;
    border-radius: 10px;
  }
  &__notice {
    margin: 0;
    padding: 10px 12px;
    border: 1px solid #f0d79b;
    border-radius: 10px;
    color: #9a6516;
    background: #fff8e7;
    font-size: 12px;
    line-height: 1.55;
  }
  &__transaction-fields {
    display: grid;
    grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
    gap: 16px;

    .el-form-item {
      margin-bottom: 0;
    }
  }
  &__action {
    width: 100%;
  }
}
@include mobile {
  .apply-form {
    gap: 16px;
    padding: 18px 16px;
    border-radius: 14px;
  }

  .apply-form__payment-address {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 12px;
  }

  .apply-form__address-row {
    grid-template-columns: 1fr;
  }

  .apply-form__address-row .el-button {
    width: 100%;
  }

  .apply-form__transaction-fields {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}
</style>
