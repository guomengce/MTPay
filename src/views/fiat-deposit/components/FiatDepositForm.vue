<template>
  <section class="fiat-apply">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top" class="fiat-apply__form" @submit.prevent="submit">
      <div class="fiat-apply__workspace">
        <div class="fiat-apply__main">
          <section class="fiat-apply__section">
            <header class="fiat-apply__section-header"><span>01</span><h4>填写入金信息</h4></header>
            <div class="fiat-apply__grid">
              <el-form-item label="入金币种" prop="currency_id"><el-select v-model="form.currency_id" placeholder="请选择币种"><el-option v-for="item in currencies" :key="item.id" :label="`${item.code} · ${item.name}`" :value="item.id" /></el-select></el-form-item>
              <el-form-item label="入金金额" prop="amount"><el-input v-model="form.amount" placeholder="请输入金额" inputmode="decimal" /></el-form-item>
              <el-form-item label="付款人名称" prop="payer_name"><el-input v-model="form.payer_name" placeholder="请输入付款人名称" /></el-form-item>
              <el-form-item label="付款银行" prop="payer_bank"><el-input v-model="form.payer_bank" placeholder="例如：DBS Bank" /></el-form-item>
              <el-form-item label="付款账户后四位" prop="payer_account_last4"><el-input v-model="form.payer_account_last4" maxlength="4" placeholder="0000" inputmode="numeric" /></el-form-item>
              <el-form-item label="银行流水号 / 汇款参考号" prop="remittance_reference"><el-input v-model="form.remittance_reference" maxlength="191" placeholder="请输入流水号或参考号" /></el-form-item>
              <el-form-item label="汇款日期" prop="remittance_date"><el-date-picker v-model="form.remittance_date" type="date" value-format="YYYY-MM-DD" placeholder="请选择日期" /></el-form-item>
              <el-form-item label="备注（选填）"><el-input v-model="form.remark" maxlength="1000" placeholder="请输入备注" /></el-form-item>
            </div>
          </section>
          <section class="fiat-apply__section is-files">
            <header class="fiat-apply__section-header"><span>02</span><h4>添加汇款凭证 <small>{{ uploadRequired ? '必填' : '选填' }}</small></h4></header>
            <el-form-item prop="file_ids">
              <FiatDepositUploader :files="files" :rules="normalizedFileRules" :uploading="uploading" @select="upload" @remove="removeFile" />
            </el-form-item>
          </section>
        </div>
        <aside class="fiat-apply__summary">
          <header><h4>提交前请确认</h4></header>
          <dl>
            <div><dt>入金币种</dt><dd>{{ selectedCurrency?.code || '—' }}</dd></div>
            <div class="is-amount"><dt>入金金额</dt><dd>{{ amountSummary }}</dd></div>
            <div><dt>付款人</dt><dd>{{ form.payer_name.trim() || '—' }}</dd></div>
            <div><dt>付款银行</dt><dd>{{ form.payer_bank.trim() || '—' }}</dd></div>
            <div><dt>汇款日期</dt><dd>{{ form.remittance_date || '—' }}</dd></div>
            <div><dt>汇款凭证</dt><dd>{{ files.length ? `已上传 ${files.length} 个` : uploadRequired ? '必填' : '选填' }}</dd></div>
          </dl>
          <el-button class="fiat-apply__submit" type="primary" native-type="submit" :loading="submitting || uploading">提交法币入金申请</el-button>
        </aside>
      </div>
    </el-form>
  </section>
</template>
<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage } from 'element-plus';
import { uploadFiatFile, type FiatCurrency, type FiatFile, type FiatFileRules, type FiatSubmit } from '@/api/modules/fiatDeposit';
import FiatDepositUploader from './FiatDepositUploader.vue';
const props = defineProps<{ currencies: FiatCurrency[]; fileRules?: FiatFileRules; submitting: boolean }>();
const emit = defineEmits<{ (event: 'submit', value: FiatSubmit): void }>();
const formRef = ref<FormInstance>();
const uploading = ref(false);
const files = ref<FiatFile[]>([]);
type FiatFormState = Omit<FiatSubmit, 'currency_id'> & { currency_id: number | null };
const form = reactive<FiatFormState>({ currency_id: null, amount: '', payer_name: '', payer_bank: '', payer_account_last4: '', remittance_reference: '', remittance_date: '', remark: '', file_ids: [] });
const normalizedFileRules = computed<FiatFileRules>(() => props.fileRules ?? ({ required: false, max_files: 5, max_file_size_mb: 10, allowed_extensions: ['pdf', 'png', 'jpg', 'jpeg'] }));
const uploadRequired = computed(() => normalizedFileRules.value.required);
const selectedCurrency = computed(() => props.currencies.find((item) => item.id === form.currency_id));
const amountSummary = computed(() => form.amount.trim() ? `${form.amount.trim()} ${selectedCurrency.value?.code || ''}`.trim() : '—');
const amountRule = (_rule: unknown, value: string, callback: (error?: Error) => void) => {
  const scale = props.currencies.find((item) => item.id === form.currency_id)?.decimal_places ?? 2;
  const pattern = new RegExp(`^(?!0+(?:\\.0+)?$)\\d{1,20}(?:\\.\\d{1,${scale}})?$`);
  callback(pattern.test(value.trim()) ? undefined : new Error(`请输入大于 0 的金额，最多 ${scale} 位小数`));
};
const validateFiles = (_rule: unknown, _value: unknown, callback: (error?: Error) => void) => callback(uploadRequired.value && files.value.length === 0 ? new Error('请上传汇款凭证') : undefined);
const rules: FormRules = {
  currency_id: [{ required: true, message: '请选择币种', trigger: 'change' }],
  amount: [{ required: true, message: '请输入金额', trigger: 'blur' }, { validator: amountRule, trigger: 'blur' }],
  payer_name: [{ required: true, message: '请输入付款人名称', trigger: 'blur' }],
  payer_bank: [{ required: true, message: '请输入付款银行', trigger: 'blur' }],
  payer_account_last4: [{ required: true, pattern: /^\d{4}$/, message: '请输入 4 位数字', trigger: 'blur' }],
  remittance_reference: [{ required: true, message: '请输入流水号或参考号', trigger: 'blur' }],
  remittance_date: [{ required: true, message: '请选择汇款日期', trigger: 'change' }],
  file_ids: [{ validator: validateFiles, trigger: 'change' }],
};
watch(
  () => props.currencies,
  (currencies) => {
    if (!currencies.some((item) => item.id === form.currency_id)) form.currency_id = currencies[0]?.id ?? null;
  },
  { immediate: true },
);
watch(
  () => form.currency_id,
  (currencyId, previousCurrencyId) => {
    if (previousCurrencyId == null || currencyId === previousCurrencyId || files.value.length === 0) return;
    files.value = [];
    form.file_ids = [];
    ElMessage.info('入金币种已变更，请重新上传对应币种的汇款凭证');
  },
);
async function upload(file: File) {
  const currencyId = form.currency_id;
  if (currencyId == null) {
    ElMessage.warning('请先选择入金币种');
    return;
  }
  uploading.value = true;
  try {
    const uploaded = await uploadFiatFile(file, currencyId);
    files.value.push(uploaded);
    form.file_ids = files.value.map((item) => item.file_id);
    formRef.value?.validateField('file_ids').catch(() => undefined);
  } catch { ElMessage.error('文件上传失败'); } finally { uploading.value = false; }
}
function removeFile(fileId: number) { files.value = files.value.filter((item) => item.file_id !== fileId); form.file_ids = files.value.map((item) => item.file_id); }
async function submit() {
  if (uploading.value || props.submitting || !(await formRef.value?.validate().catch(() => false))) return;
  if (form.currency_id == null) return;
  emit('submit', { ...form, currency_id: form.currency_id, amount: form.amount.trim(), file_ids: [...(form.file_ids ?? [])] });
}
</script>
<style scoped lang="scss">
.fiat-apply {
  min-width: 0;
  padding: 0 20px 20px;
  border: 1px solid #e5edf3;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 16px 40px rgb(22 34 51 / 6%);

  &__form { margin-top: 20px; }
  &__workspace { display: grid; min-width: 0; align-items: start; grid-template-columns: minmax(0, 1.55fr) minmax(300px, .72fr); gap: 22px; }
  &__main { display: grid; min-width: 0; gap: 14px; }
  &__section { min-width: 0; padding: 18px; border: 1px solid #cbdfe3; border-radius: 14px; background: linear-gradient(90deg, #f6fbfb 0%, #fbfcfd 24%, #fbfcfd 100%); box-shadow: inset 3px 0 0 #22aaa5; }
  &__section-header { display: flex; align-items: center; gap: 10px; margin-bottom: 16px;
    span { display: grid; width: 29px; height: 29px; place-items: center; border-radius: 8px; background: #dff6f4; color: #079b97; font-size: 12px; font-weight: 800; }
    h4 { margin: 0; color: #102440; font-size: 15px; }
    small { margin-left: 4px; color: #7c8da2; font-size: 12px; font-weight: 500; }
  }
  :deep(.el-form-item) { margin-bottom: 16px; }
  :deep(.el-form-item__label) { color: #172a47; font-weight: 600; }
  :deep(.el-select), :deep(.el-date-editor) { width: 100%; }
  &__grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0 16px; }
  .is-files :deep(.el-form-item) { margin-bottom: 0; }
  &__summary { overflow: hidden; align-self: start; border: 1px solid #d8e5eb; border-radius: 14px; background: #fff; box-shadow: 0 10px 28px rgb(24 63 85 / 8%);
    header { padding: 17px 18px; border-bottom: 1px solid #e4edf2; background: linear-gradient(135deg, #f5fffd, #f7fbff); }
    h4 { margin: 0; color: #102440; font-size: 15px; }
    dl { margin: 0; padding: 8px 18px; }
    dl div { display: grid; grid-template-columns: minmax(88px, auto) 1fr; gap: 14px; padding: 11px 0; border-bottom: 1px dashed #e4ebf0; }
    dl div:last-child { border-bottom: 0; }
    dt { color: #60758f; }
    dd { margin: 0; color: #102440; font-weight: 700; text-align: right; overflow-wrap: anywhere; }
    .is-amount dd { color: #079b97; font-size: 17px; }
  }
  &__submit { width: calc(100% - 36px); height: 42px; margin: 8px 18px 18px; font-weight: 700; }
}
@include narrow { .fiat-apply__workspace { grid-template-columns: 1fr; } .fiat-apply__summary { position: static; } }
@include mobile { .fiat-apply { padding: 0 14px 14px; } .fiat-apply__grid { grid-template-columns: 1fr; } .fiat-apply__section { padding: 15px; } }
</style>
