<template>
  <section class="convert-form">
    <header class="convert-form__header">
      <div>
        <h3 class="convert-form__title">发起兑换</h3>
        <p class="convert-form__subtitle">选择支付资产并填写金额，平台审核后兑换为 USD</p>
      </div>
    </header>

    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="top"
      class="convert-form__form"
      @submit.prevent
    >
      <section class="convert-form__workspace">
        <article class="convert-form__asset-card is-source">
          <div class="convert-form__asset-head">
            <div>
              <small>支付资产</small>
              <strong>选择来源币种</strong>
            </div>
            <el-form-item prop="source_currency_code" class="convert-form__currency-field">
              <el-radio-group v-model="form.source_currency_code" class="convert-form__source">
                <el-radio-button v-for="code in sourceOptions" :key="code" :value="code">
                  {{ code }}
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
          </div>

          <el-form-item prop="amount" class="convert-form__amount-field">
            <el-input v-model="form.amount" placeholder="0.00" :prefix-icon="Money">
              <template #suffix>
                <strong>{{ form.source_currency_code }}</strong>
              </template>
            </el-input>
          </el-form-item>

          <footer class="convert-form__asset-foot">
            <span class="convert-form__balance-label">可用余额</span>
            <strong v-if="balance">
              {{ balance.available_balance }} {{ balance.currency.code }}
            </strong>
            <strong v-else>—</strong>
            <el-button v-if="balance" link @click="useMaxBalance">全部兑换</el-button>
          </footer>
        </article>

        <div class="convert-form__connector" aria-hidden="true">
          <el-icon><Right /></el-icon>
        </div>

        <article class="convert-form__asset-card is-target">
          <div class="convert-form__asset-head">
            <div>
              <small>到账资产</small>
              <strong>兑换目标</strong>
            </div>
            <span class="convert-form__usd-badge">USD</span>
          </div>

          <div class="convert-form__target-value">
            <small>预计到账</small>
            <div>
              <span>{{ estimatedTargetAmount }}</span>
              <strong>USD</strong>
            </div>
          </div>

          <footer class="convert-form__asset-foot">
            <span>当前汇率</span>
            <strong v-if="rate"> 1 {{ form.source_currency_code }} ≈ {{ rate.rate }} USD </strong>
            <strong v-else>暂无可用汇率</strong>
            <em v-if="rate">{{ rate.rate_source_name }}</em>
          </footer>
        </article>
      </section>

      <section class="convert-form__summary">
        <div>
          <i class="ri-lock-2-line" aria-hidden="true" />
          <span><strong>资产冻结</strong><small>提交后冻结来源金额</small></span>
        </div>
        <div>
          <i class="ri-scales-3-line" aria-hidden="true" />
          <span><strong>服务端计价</strong><small>提交时重新确认实际汇率</small></span>
        </div>
        <div>
          <i class="ri-shield-check-line" aria-hidden="true" />
          <span><strong>审核到账</strong><small>审核通过后计入 USD</small></span>
        </div>
      </section>

      <footer class="convert-form__submit-row">
        <p>
          <i class="ri-information-line" aria-hidden="true" />
          实际汇率与到账金额以服务端创建的订单快照为准
        </p>
        <el-button
          type="primary"
          class="convert-form__action"
          :loading="submitting"
          @click="handleSubmit"
        >
          确认兑换
          <el-icon class="el-icon--right"><Right /></el-icon>
        </el-button>
      </footer>
    </el-form>
  </section>
</template>

<script setup lang="ts">
/**
 * 兑换表单组件
 * - 只负责 UI 与提交事件；
 * - 来源币种、汇率、余额由父组件通过 props 传入；
 * - 表单字段直接 emit 到父组件，组件内部不保存业务状态。
 */
import { computed, reactive, ref as refHook } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { Money, Right } from '@element-plus/icons-vue';

import type { ExchangeBalance, ExchangeEffectiveRate } from '@/api/modules/exchange';

const props = defineProps<{
  submitting?: boolean;
  balances?: ExchangeBalance[];
  rates?: { USDT?: ExchangeEffectiveRate; USDC?: ExchangeEffectiveRate };
}>();

const emit = defineEmits<{
  (e: 'submit', payload: { source_currency_code: 'USDT' | 'USDC'; amount: string }): void;
}>();

const formRef = refHook<FormInstance>();
const sourceOptions = ['USDT', 'USDC'] as const;

const form = reactive({
  source_currency_code: 'USDT' as 'USDT' | 'USDC',
  amount: '',
});

const balance = computed<ExchangeBalance | undefined>(() =>
  (props.balances ?? []).find((b) => b.currency.code === form.source_currency_code),
);

const rate = computed<ExchangeEffectiveRate | undefined>(
  () => props.rates?.[form.source_currency_code],
);

/**
 * 根据当前配置汇率生成只读到账预估。
 * 使用 BigInt 做定点运算，不把资金金额转换成 JavaScript Number；最终到账仍以后端订单快照为准。
 */
const estimatedTargetAmount = computed(() => {
  if (!rate.value || !form.amount.trim()) return '0.00';
  return multiplyDecimalStrings(form.amount, rate.value.rate, 2) ?? '0.00';
});

const rules: FormRules<{ source_currency_code: 'USDT' | 'USDC'; amount: string }> = {
  source_currency_code: [{ required: true, message: '请选择来源币种', trigger: 'change' }],
  amount: [
    { required: true, message: '请输入金额', trigger: 'blur' },
    {
      pattern: /^(?!0+(?:\.0+)?$)\d{1,20}(?:\.\d{1,8})?$/,
      message: '请输入大于 0 的金额，整数最多 20 位、小数最多 8 位',
      trigger: 'blur',
    },
  ],
};

async function handleSubmit() {
  if (!(await formRef.value?.validate().catch(() => false))) return;
  emit('submit', { source_currency_code: form.source_currency_code, amount: form.amount.trim() });
}

function useMaxBalance() {
  if (!balance.value) return;
  form.amount = balance.value.available_balance;
}

/** 将两个正十进制字符串精确相乘，并按指定小数位四舍五入。 */
function multiplyDecimalStrings(left: string, right: string, outputScale: number) {
  const parse = (value: string) => {
    const normalized = value.trim();
    if (!/^\d+(?:\.\d+)?$/.test(normalized)) return null;
    const [integer, fraction = ''] = normalized.split('.');
    return {
      digits: `${integer}${fraction}`.replace(/^0+(?=\d)/, '') || '0',
      scale: fraction.length,
    };
  };

  const source = parse(left);
  const exchangeRate = parse(right);
  if (!source || !exchangeRate) return null;

  let scaledValue = BigInt(source.digits) * BigInt(exchangeRate.digits);
  const sourceScale = source.scale + exchangeRate.scale;

  if (sourceScale > outputScale) {
    const divisor = 10n ** BigInt(sourceScale - outputScale);
    const remainder = scaledValue % divisor;
    scaledValue /= divisor;
    if (remainder * 2n >= divisor) scaledValue += 1n;
  } else if (sourceScale < outputScale) {
    scaledValue *= 10n ** BigInt(outputScale - sourceScale);
  }

  const raw = scaledValue.toString().padStart(outputScale + 1, '0');
  const integer = raw.slice(0, -outputScale).replace(/^0+(?=\d)/, '') || '0';
  return outputScale > 0 ? `${integer}.${raw.slice(-outputScale)}` : integer;
}

function reset() {
  formRef.value?.resetFields();
}

defineExpose({ reset });
</script>

<style scoped lang="scss">
.convert-form {
  container-type: inline-size;
  display: flex;
  flex-direction: column;
  gap: 22px;
  padding: 28px;
  overflow: hidden;
  border: 1px solid #dfe9ef;
  border-radius: 18px;
  background: radial-gradient(circle at 100% 0, rgb(39 185 170 / 8%), transparent 28%), #ffffff;
  box-shadow: 0 18px 44px rgb(22 34 51 / 7%);
}
.convert-form__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
}

.convert-form__title {
  margin: 0;
  color: #071833;
  font-size: 22px;
  line-height: 1.3;
}
.convert-form__subtitle {
  margin: 5px 0 0;
  color: #718197;
  font-size: 13px;
  line-height: 1.6;
}
.convert-form__form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.convert-form__workspace {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 54px minmax(0, 1fr);
  align-items: stretch;
  gap: 10px;
}
.convert-form__asset-card {
  display: flex;
  min-width: 0;
  flex-direction: column;
  justify-content: space-between;
  gap: 22px;
  padding: 20px;
  border: 1px solid #dce7ef;
  border-radius: 16px;

  &.is-source {
    border-color: #bfe4df;
    background: linear-gradient(145deg, #ffffff, #f4fbfa);
    box-shadow: 0 12px 28px rgb(13 148 136 / 7%);
  }

  &.is-target {
    background: linear-gradient(145deg, #f7faff, #ffffff);
  }
}
.convert-form__asset-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;

  > div {
    display: grid;
    gap: 4px;
  }

  small {
    color: #8794a6;
    font-size: 12px;
  }

  strong {
    color: #24364d;
    font-size: 14px;
  }
}
.convert-form__currency-field,
.convert-form__amount-field {
  margin-bottom: 0;
}
.convert-form__source {
  display: flex;

  :deep(.el-radio-button__inner) {
    min-width: 72px;
    padding: 10px 16px;
    border-color: #d3e0e8;
    box-shadow: none;
  }
}
.convert-form__amount-field {
  :deep(.el-input__wrapper) {
    min-height: 68px;
    padding: 0 18px;
    border-radius: 14px;
    background: #ffffff;
    box-shadow: 0 0 0 1px #cfe0e7 inset;
  }

  :deep(.el-input__inner) {
    color: #071833;
    font-size: clamp(22px, 2.3vw, 30px);
    font-weight: 650;
    font-variant-numeric: tabular-nums;
  }

  :deep(.el-input__suffix strong) {
    color: #087e77;
    font-size: 14px;
  }
}
.convert-form__asset-foot {
  display: flex;
  min-height: 30px;
  align-items: center;
  gap: 8px;
  color: #718197;
  font-size: 12px;

  strong {
    min-width: 0;
    overflow-wrap: anywhere;
    color: #07978f;
    font-size: 13px;
    font-weight: 700;
  }

  .convert-form__balance-label {
    color: #07978f;
    font-weight: 600;
  }

  em {
    margin-left: auto;
    color: #8794a6;
    font-size: 11px;
    font-style: normal;
  }

  .el-button {
    margin-left: auto;
  }
}
.convert-form__connector {
  display: grid;
  width: 44px;
  height: 44px;
  align-self: center;
  justify-self: center;
  place-items: center;
  border: 5px solid #ffffff;
  border-radius: 50%;
  color: #ffffff;
  background: linear-gradient(135deg, #16b9aa, #1d8db5);
  box-shadow: 0 10px 24px rgb(22 158 160 / 24%);
  font-size: 20px;
}
.convert-form__usd-badge {
  display: grid;
  width: 48px;
  height: 48px;
  place-items: center;
  border-radius: 14px;
  color: #245fc7;
  background: #eaf2ff;
  font-size: 13px;
  font-weight: 700;
}
.convert-form__target-value {
  display: flex;
  min-height: 68px;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 0 18px;
  border: 1px dashed #cbd9e7;
  border-radius: 14px;
  color: #8794a6;
  background: rgb(255 255 255 / 72%);

  > div {
    display: flex;
    min-width: 0;
    align-items: baseline;
    justify-content: flex-end;
    gap: 10px;
  }

  small {
    color: #8794a6;
    font-size: 11px;
  }

  span {
    overflow: hidden;
    color: #071833;
    font-size: clamp(22px, 2.3vw, 30px);
    font-weight: 650;
    font-variant-numeric: tabular-nums;
    text-align: right;
    text-overflow: ellipsis;
  }

  strong {
    flex: none;
    color: #245fc7;
    font-size: 15px;
  }
}
.convert-form__summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  overflow: hidden;
  border: 1px solid #e2ebf1;
  border-radius: 14px;
  background: #f8fafc;

  > div {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: 11px;
    padding: 14px 16px;

    & + div {
      border-left: 1px solid #e2ebf1;
    }

    > i {
      display: grid;
      width: 34px;
      height: 34px;
      flex: none;
      place-items: center;
      border-radius: 10px;
      color: #07978f;
      background: #e5f7f4;
      font-size: 17px;
    }

    span {
      display: grid;
      min-width: 0;
      gap: 3px;
    }

    strong {
      color: #24364d;
      font-size: 13px;
    }

    small {
      color: #8794a6;
      font-size: 11px;
    }
  }
}
.convert-form__submit-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;

  p {
    display: flex;
    align-items: center;
    gap: 7px;
    margin: 0;
    color: #718197;
    font-size: 12px;
  }

  i {
    color: #1d8db5;
    font-size: 16px;
  }
}
.convert-form__action {
  min-width: 220px;
}

@container (max-width: 760px) {
  .convert-form__workspace {
    grid-template-columns: minmax(0, 1fr);
    gap: 8px;
  }
  .convert-form__connector {
    transform: rotate(90deg);
  }
  .convert-form__summary {
    grid-template-columns: minmax(0, 1fr);
  }
  .convert-form__summary > div + div {
    border-top: 1px solid #e2ebf1;
    border-left: 0;
  }
}

@container (max-width: 540px) {
  .convert-form__header,
  .convert-form__submit-row {
    align-items: stretch;
    flex-direction: column;
  }
  .convert-form__status {
    align-self: flex-start;
  }
  .convert-form__asset-head {
    align-items: flex-start;
    flex-direction: column;
  }
  .convert-form__currency-field,
  .convert-form__source {
    width: 100%;
  }
  .convert-form__source :deep(.el-radio-button) {
    flex: 1;
  }
  .convert-form__source :deep(.el-radio-button__inner) {
    width: 100%;
  }
  .convert-form__asset-foot {
    align-items: flex-start;
    flex-wrap: wrap;
  }
  .convert-form__action {
    width: 100%;
  }
}

@include mobile {
  .convert-form {
    gap: 18px;
    padding: 18px 16px;
    border-radius: 14px;
  }
  .convert-form__asset-card {
    padding: 16px;
  }
}
</style>
