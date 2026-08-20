<template>
  <section class="apply-form">
    <header class="apply-form__header">
      <div>
        <h3 class="apply-form__title">发起 USD 出金</h3>
        <p class="apply-form__subtitle">选择已审核通过的交易主体，确认扣款后提交平台审核</p>
      </div>
      <span class="apply-form__currency">USD</span>
    </header>

    <el-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      label-position="top"
      class="apply-form__form"
      @submit.prevent="handleSubmit"
    >
      <div class="apply-form__workspace">
        <div class="apply-form__main">
          <section class="apply-form__section">
            <header class="apply-form__section-header">
              <span>01</span>
              <div>
                <h4>选择交易主体</h4>
                <p>付款人和收款人均来自审核通过的白名单</p>
              </div>
            </header>
            <div class="apply-form__party-fields">
              <el-form-item label="付款人" prop="payer_whitelist_id">
                <el-select
                  v-model="formState.payer_whitelist_id"
                  placeholder="请选择付款人"
                  :loading="configLoading"
                  filterable
                >
                  <el-option
                    v-for="item in payers"
                    :key="item.id"
                    :value="item.id"
                    :label="`${item.subject_name} · ${item.whitelist_no}`"
                  />
                </el-select>
                <p v-if="payers.length === 0 && !configLoading" class="apply-form__notice warning">
                  暂无可用付款人，请先提交并通过白名单审核。
                </p>
              </el-form-item>

              <span class="apply-form__direction" aria-hidden="true">
                <el-icon><Right /></el-icon>
              </span>

              <el-form-item label="收款人" prop="payee_whitelist_id">
                <el-select
                  v-model="formState.payee_whitelist_id"
                  placeholder="请选择收款人"
                  :loading="configLoading"
                  filterable
                >
                  <el-option
                    v-for="item in payees"
                    :key="item.id"
                    :value="item.id"
                    :label="`${item.subject_name} · ${item.whitelist_no}`"
                  />
                </el-select>
                <p v-if="payees.length === 0 && !configLoading" class="apply-form__notice warning">
                  暂无可用收款人，请先提交并通过白名单审核。
                </p>
              </el-form-item>
            </div>
          </section>

          <section class="apply-form__section">
            <header class="apply-form__section-header">
              <span>02</span>
              <div>
                <h4>填写出金金额</h4>
                <p>手续费将与出金金额一并从 USD 可用余额中冻结</p>
              </div>
            </header>
            <el-form-item label="出金金额" prop="amount" class="apply-form__amount-field">
              <el-input
                v-model="formState.amount"
                placeholder="0.00"
                :prefix-icon="Money"
                inputmode="decimal"
              >
                <template #append>
                  <span class="apply-form__unit">USD</span>
                </template>
              </el-input>
              <div class="apply-form__balance-tip">
                <span>最高可出 {{ maximumAmount }} USD（已预留手续费）</span>
                <el-button
                  link
                  type="primary"
                  :disabled="maximumAmount === '—'"
                  @click="fillMaximum"
                >
                  全部出金
                </el-button>
              </div>
            </el-form-item>
          </section>

          <section class="apply-form__section is-files">
            <header class="apply-form__section-header">
              <span>03</span>
              <div>
                <h4>添加证明材料 <small>选填</small></h4>
                <p>初次申请无需强制上传；如有合同、账单等材料可在此附上</p>
              </div>
            </header>
            <el-upload
              v-model:file-list="fileList"
              :auto-upload="false"
              :multiple="true"
              :limit="fileRules.max_files_per_round || undefined"
              :accept="acceptedExtensions"
              @change="handleFileChange"
            >
              <el-button plain :icon="Upload">选择文件</el-button>
              <template #tip>
                <p class="apply-form__file-tip">
                  最多 {{ fileRules.max_files_per_round }} 个，每个不超过
                  {{ fileRules.max_file_size_mb }} MB；支持
                  {{ fileRules.allowed_extensions.join(' / ').toUpperCase() }}
                </p>
              </template>
            </el-upload>
          </section>
        </div>

        <aside class="apply-form__summary">
          <header>
            <div>
              <small>资金核对</small>
              <h4>本次扣款明细</h4>
            </div>
            <span>USD</span>
          </header>

          <div class="apply-form__available">
            <small>当前可用余额</small>
            <strong>{{ balance?.available_balance || '—' }} <span>USD</span></strong>
          </div>

          <dl class="apply-form__summary-rows">
            <div>
              <dt>出金金额</dt>
              <dd>{{ amountPreview }}<span v-if="amountPreview !== '—'"> USD</span></dd>
            </div>
            <div>
              <dt>固定手续费</dt>
              <dd>{{ feeAmount || '—' }}<span v-if="feeAmount"> USD</span></dd>
            </div>
            <div class="is-total">
              <dt>预计总扣款</dt>
              <dd>{{ totalPreview }}<span v-if="totalPreview !== '—'"> USD</span></dd>
            </div>
            <div>
              <dt>扣款后可用</dt>
              <dd :class="{ 'is-warning': insufficientBalance }">
                {{ remainingPreview
                }}<span v-if="remainingPreview !== '—' && !insufficientBalance"> USD</span>
              </dd>
            </div>
          </dl>

          <p class="apply-form__server-note">
            <el-icon><InfoFilled /></el-icon>
            最终手续费和冻结金额以订单创建时的服务端计算结果为准。
          </p>

          <el-button
            type="primary"
            native-type="submit"
            class="apply-form__action"
            :loading="submitting || uploading"
            :disabled="configLoading || insufficientBalance"
          >
            确认并提交出金
          </el-button>
        </aside>
      </div>
    </el-form>
  </section>
</template>

<script setup lang="ts">
/**
 * 出金申请表单组件
 * - 只负责表单 UI 与事件；
 * - 白名单 / 费率 / 文件规则由父组件传入；
 * - 上传和提交在父组件 useWithdrawalForm 中执行；这里仅做本地收集。
 */
import { computed, reactive, ref as refHook, watch } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import type { UploadFile, UploadFiles, UploadRawFile, UploadUserFile } from 'element-plus';
import { InfoFilled, Money, Right, Upload } from '@element-plus/icons-vue';

import type {
  WithdrawalBalance,
  WithdrawalFileRules,
  WithdrawalWhitelistOption,
} from '@/api/modules/withdrawal';

const props = defineProps<{
  balance?: WithdrawalBalance;
  payers?: WithdrawalWhitelistOption[];
  payees?: WithdrawalWhitelistOption[];
  feeAmount?: string;
  fileRules?: WithdrawalFileRules;
  configLoading?: boolean;
  submitting?: boolean;
  uploading?: boolean;
}>();

const emit = defineEmits<{
  (
    e: 'submit',
    payload: {
      payer_whitelist_id: number;
      payee_whitelist_id: number;
      amount: string;
      files: File[];
    },
  ): void;
}>();

const formRef = refHook<FormInstance>();

const formState = reactive({
  payer_whitelist_id: null as number | null,
  payee_whitelist_id: null as number | null,
  amount: '',
});

const fileList = refHook<UploadUserFile[]>([]);

const fileRules = computed<WithdrawalFileRules>(
  () =>
    props.fileRules ?? {
      initial_required: false,
      max_files_per_round: 5,
      max_file_size_mb: 10,
      allowed_extensions: ['pdf', 'png', 'jpg', 'jpeg'],
      unbound_expire_hours: 24,
    },
);
const payers = computed(() => props.payers ?? []);
const payees = computed(() => props.payees ?? []);
const acceptedExtensions = computed(() =>
  fileRules.value.allowed_extensions.map((item) => `.${item}`).join(','),
);
const totalPreview = computed(() => {
  if (!props.feeAmount) return '—';
  return addDecimalStrings(formState.amount, props.feeAmount, 2);
});
const amountPreview = computed(() => addDecimalStrings(formState.amount, '0.00', 2));
const maximumAmount = computed(() =>
  subtractDecimalStrings(props.balance?.available_balance, props.feeAmount, 2),
);
const remainingPreview = computed(() => {
  if (totalPreview.value === '—') return '—';
  const value = subtractDecimalStrings(props.balance?.available_balance, totalPreview.value, 2);
  return value === '—' ? '余额不足' : value;
});
const insufficientBalance = computed(() => remainingPreview.value === '余额不足');

const rules: FormRules = {
  payer_whitelist_id: [{ required: true, message: '请选择付款人', trigger: 'change' }],
  payee_whitelist_id: [{ required: true, message: '请选择收款人', trigger: 'change' }],
  amount: [
    { required: true, message: '请输入金额', trigger: 'blur' },
    {
      pattern: /^(?!0+(?:\.0+)?$)\d{1,20}(?:\.\d{1,2})?$/,
      message: '请输入大于 0 的金额，整数最多 20 位、小数最多 2 位',
      trigger: 'blur',
    },
  ],
};

watch(
  () => props.fileRules?.max_files_per_round,
  (count) => {
    if (count && fileList.value.length > count) fileList.value = fileList.value.slice(0, count);
  },
);

function handleFileChange(_file: UploadFile, files: UploadFiles) {
  fileList.value = files;
}

/**
 * 使用字符串逐位相加生成 USD 预计总扣款，避免资金金额经过 JavaScript 浮点数。
 * 此值只用于提示，提交参数仍只包含 amount，最终结果以服务端为准。
 */
function addDecimalStrings(left: string, right: string, scale: number) {
  const pattern = new RegExp(`^\\d+(?:\\.\\d{1,${scale}})?$`);
  if (!pattern.test(left.trim()) || !pattern.test(right.trim())) return '—';

  const normalize = (value: string) => {
    const [integer, fraction = ''] = value.trim().split('.');
    return `${integer}${fraction.padEnd(scale, '0')}`.replace(/^0+(?=\d)/, '');
  };
  const a = normalize(left);
  const b = normalize(right);
  const digitsMap = '0123456789';
  const length = Math.max(a.length, b.length);
  const digits: number[] = [];
  let carry = 0;

  for (let index = 0; index < length; index += 1) {
    const leftDigit = digitsMap.indexOf(a[a.length - 1 - index] ?? '0');
    const rightDigit = digitsMap.indexOf(b[b.length - 1 - index] ?? '0');
    const sum = leftDigit + rightDigit + carry;
    digits.push(sum % 10);
    carry = Math.floor(sum / 10);
  }
  if (carry) digits.push(carry);

  const raw = digits
    .reverse()
    .join('')
    .padStart(scale + 1, '0');
  const integer = raw.slice(0, -scale).replace(/^0+(?=\d)/, '') || '0';
  return `${integer}.${raw.slice(-scale)}`;
}

/** 以十进制字符串相减，避免大额 USD 使用浮点数产生精度误差。 */
function subtractDecimalStrings(
  left: string | undefined,
  right: string | undefined,
  scale: number,
) {
  if (!left || !right) return '—';
  const pattern = new RegExp(`^\\d+(?:\\.\\d{1,${scale}})?$`);
  if (!pattern.test(left.trim()) || !pattern.test(right.trim())) return '—';

  const normalize = (value: string) => {
    const [integer, fraction = ''] = value.trim().split('.');
    return `${integer}${fraction.padEnd(scale, '0')}`.replace(/^0+(?=\d)/, '');
  };
  const a = normalize(left);
  const b = normalize(right);
  const length = Math.max(a.length, b.length);
  const paddedA = a.padStart(length, '0');
  const paddedB = b.padStart(length, '0');
  if (paddedA < paddedB) return '—';

  const digits: number[] = [];
  let borrow = 0;
  for (let index = length - 1; index >= 0; index -= 1) {
    let digit = Number(paddedA[index]) - borrow - Number(paddedB[index]);
    if (digit < 0) {
      digit += 10;
      borrow = 1;
    } else {
      borrow = 0;
    }
    digits.push(digit);
  }
  const raw = digits
    .reverse()
    .join('')
    .padStart(scale + 1, '0');
  const integer = raw.slice(0, -scale).replace(/^0+(?=\d)/, '') || '0';
  return `${integer}.${raw.slice(-scale)}`;
}

function fillMaximum() {
  if (maximumAmount.value !== '—') formState.amount = maximumAmount.value;
}

async function handleSubmit() {
  if (!(await formRef.value?.validate().catch(() => false))) return;
  if (formState.payer_whitelist_id == null || formState.payee_whitelist_id == null) return;
  const files = fileList.value
    .map((item) => item.raw)
    .filter((raw): raw is UploadRawFile => Boolean(raw)) as File[];
  emit('submit', {
    payer_whitelist_id: formState.payer_whitelist_id,
    payee_whitelist_id: formState.payee_whitelist_id,
    amount: formState.amount.trim(),
    files,
  });
}

function reset() {
  formRef.value?.resetFields();
  fileList.value = [];
}

defineExpose({ reset });
</script>

<style scoped lang="scss">
.apply-form {
  min-width: 0;
  padding: 24px;
  border: 1px solid #e5edf3;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 16px 40px rgb(22 34 51 / 6%);

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding-bottom: 20px;
    border-bottom: 1px solid #e8eef3;
  }

  &__title {
    margin: 0;
    color: #071833;
    font-size: 20px;
    font-weight: 700;
  }

  &__subtitle {
    margin: 5px 0 0;
    color: #718197;
    font-size: 13px;
    line-height: 1.6;
  }

  &__currency {
    display: inline-flex;
    width: 48px;
    height: 48px;
    flex: none;
    align-items: center;
    justify-content: center;
    border-radius: 14px;
    color: #087f79;
    background: #e7f8f5;
    font-size: 14px;
    font-weight: 750;
  }

  &__form {
    margin-top: 20px;
  }

  &__workspace {
    display: grid;
    min-width: 0;
    align-items: start;
    grid-template-columns: minmax(0, 1.55fr) minmax(300px, 0.72fr);
    gap: 22px;
  }

  &__main {
    display: grid;
    min-width: 0;
    gap: 14px;
  }

  &__section {
    min-width: 0;
    padding: 18px;
    border: 1px solid #e2eaf0;
    border-radius: 14px;
    background: #fbfcfd;
  }

  &__section-header {
    display: flex;
    align-items: center;
    gap: 11px;
    margin-bottom: 16px;

    > span {
      display: inline-flex;
      width: 34px;
      height: 34px;
      flex: none;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
      color: #087f79;
      background: #e6f7f4;
      font-size: 12px;
      font-weight: 700;
    }

    h4 {
      margin: 0;
      color: #122942;
      font-size: 15px;
      font-weight: 650;

      small {
        margin-left: 5px;
        color: #8794a6;
        font-size: 11px;
        font-weight: 500;
      }
    }

    p {
      margin: 3px 0 0;
      color: #7a899c;
      font-size: 12px;
    }
  }

  &__party-fields {
    display: grid;
    align-items: center;
    grid-template-columns: minmax(0, 1fr) 38px minmax(0, 1fr);
    gap: 10px;

    :deep(.el-form-item) {
      margin-bottom: 0;
    }
  }

  &__direction {
    display: inline-flex;
    width: 34px;
    height: 34px;
    align-items: center;
    justify-content: center;
    align-self: center;
    margin-top: 28px;
    border: 1px solid #d8e5ed;
    border-radius: 50%;
    color: #159d98;
    background: #fff;
  }

  &__amount-field {
    margin-bottom: 0;
  }

  &__unit {
    color: #087f79;
    font-weight: 700;
  }

  &__balance-tip {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-top: 7px;
    color: #718197;
    font-size: 12px;
  }

  &__notice,
  &__file-tip {
    margin: 6px 0 0;
    color: #8794a6;
    font-size: 12px;
    line-height: 1.6;
  }

  &__notice.warning {
    color: #b35806;
  }

  &__summary {
    position: sticky;
    top: 18px;
    overflow: hidden;
    border: 1px solid #cfe3e2;
    border-radius: 15px;
    background: linear-gradient(180deg, #f3fbfa 0%, #fff 42%);

    > header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 18px 18px 14px;

      small {
        color: #79908e;
        font-size: 11px;
      }

      h4 {
        margin: 4px 0 0;
        color: #0f2d3d;
        font-size: 16px;
      }

      > span {
        display: inline-flex;
        padding: 6px 9px;
        border-radius: 9px;
        color: #087f79;
        background: #dff5f1;
        font-size: 12px;
        font-weight: 700;
      }
    }
  }

  &__available {
    margin: 0 18px;
    padding: 15px;
    border: 1px solid #d9ebe8;
    border-radius: 12px;
    background: #fff;

    small {
      color: #718197;
      font-size: 12px;
    }

    strong {
      display: block;
      margin-top: 6px;
      color: #07978f;
      font-size: clamp(20px, 2vw, 27px);
      font-weight: 700;
      font-variant-numeric: tabular-nums;

      span {
        font-size: 13px;
        font-weight: 650;
      }
    }
  }

  &__summary-rows {
    display: grid;
    margin: 16px 18px 0;

    > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 11px 0;
      border-bottom: 1px dashed #dce6eb;
    }

    dt {
      color: #718197;
      font-size: 12px;
    }

    dd {
      margin: 0;
      color: #263b52;
      font-size: 13px;
      font-weight: 650;
      font-variant-numeric: tabular-nums;

      span {
        margin-left: 3px;
        color: #718197;
        font-size: 11px;
      }

      &.is-warning {
        color: #d15b38;
      }
    }

    .is-total {
      dt,
      dd {
        color: #071833;
        font-size: 14px;
        font-weight: 700;
      }
    }
  }

  &__server-note {
    display: flex;
    align-items: flex-start;
    gap: 7px;
    margin: 14px 18px;
    color: #718197;
    font-size: 11px;
    line-height: 1.55;

    .el-icon {
      flex: none;
      margin-top: 2px;
      color: #178f89;
    }
  }

  &__action {
    width: calc(100% - 36px);
    margin: 0 18px 18px;
  }
}

@include narrow {
  .apply-form__workspace {
    grid-template-columns: minmax(0, 1fr);
  }

  .apply-form__summary {
    position: static;
  }
}

@include mobile {
  .apply-form {
    padding: 18px 16px;
    border-radius: 14px;

    &__header {
      align-items: flex-start;
      padding-bottom: 16px;
    }

    &__workspace {
      gap: 14px;
    }

    &__section {
      padding: 15px;
    }

    &__party-fields {
      grid-template-columns: minmax(0, 1fr);
    }

    &__direction {
      margin: 0 auto;
      transform: rotate(90deg);
    }

    &__balance-tip {
      align-items: flex-start;
      flex-direction: column;
      gap: 2px;
    }
  }
}
</style>
