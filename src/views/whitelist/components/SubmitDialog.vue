<template>
  <AgentDialog
    :model-value="modelValue"
    class="whitelist-submit-dialog"
    :title="dialogTitle"
    :icon="dialogIcon"
    width="min(880px, calc(100vw - 32px))"
    top="4vh"
    :close-on-click-modal="false"
    destroy-on-close
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="submit-dialog__body">
      <el-steps
        class="submit-dialog__steps"
        :active="activeStep"
        finish-status="success"
        align-center
      >
        <el-step :title="t('whitelist.selectIdentity')" /><el-step :title="t('whitelist.fillApplication')" />
      </el-steps>

      <el-form
        ref="formRef"
        :model="formState"
        :rules="rules"
        :validate-on-rule-change="false"
        label-position="top"
        class="submit-form"
      >
        <section v-show="activeStep === 0" class="form-section form-section--identity">
          <div class="identity-grid">
            <el-form-item :label="t('whitelist.role')" prop="role">
              <el-select v-model="formState.role" :placeholder="t('whitelist.rolePlaceholder')">
                <el-option :value="1" :label="t('whitelist.payer')" /><el-option :value="2" :label="t('whitelist.payee')" />
              </el-select>
            </el-form-item>

            <el-form-item :label="t('whitelist.entityType')" prop="entity_type">
              <el-select v-model="formState.entity_type" :placeholder="t('whitelist.entityPlaceholder')">
                <el-option :value="1" :label="t('whitelist.company')" /><el-option :value="2" :label="t('whitelist.individual')" />
              </el-select>
            </el-form-item>
          </div>
        </section>

        <template v-if="activeStep === 1 && hasSubjectSelection">
          <section class="form-section">
            <header class="form-section__header">
              <span>01</span>
              <div>
                <h3>{{ formSectionTitle }}</h3>
              </div>
            </header>

            <template v-if="formState.entity_type === 1">
              <div class="submit-form__row">
                <el-form-item :label="t('whitelist.companyName')" prop="company_name">
                  <el-input v-model="formState.company_name" :placeholder="t('whitelist.companyNamePlaceholder')" />
                </el-form-item>
                <el-form-item v-if="formState.role === 1" :label="t('whitelist.companyType')" prop="company_type">
                  <el-select v-model="formState.company_type" :placeholder="t('whitelist.companyTypePlaceholder')">
                    <el-option :value="1" :label="t('whitelist.nonFinancial')" /><el-option :value="2" :label="t('whitelist.financial')" />
                  </el-select>
                </el-form-item>
                <el-form-item v-else :label="t('whitelist.operatingCountry')" prop="operating_country">
                  <CountrySelect
                    v-model="formState.operating_country"
                    :placeholder="selectPlaceholder(t('whitelist.operatingCountry'))"
                  />
                </el-form-item>
              </div>

              <div v-if="formState.role === 1" class="submit-form__row">
                <el-form-item :label="t('whitelist.registrationCountry')" prop="registration_country">
                  <CountrySelect
                    v-model="formState.registration_country"
                    :placeholder="selectPlaceholder(t('whitelist.registrationCountry'))"
                  />
                </el-form-item>
                <el-form-item :label="t('whitelist.operatingCountry')" prop="operating_country">
                  <CountrySelect
                    v-model="formState.operating_country"
                    :placeholder="selectPlaceholder(t('whitelist.operatingCountry'))"
                  />
                </el-form-item>
              </div>
            </template>

            <template v-else>
              <div class="submit-form__row">
                <el-form-item :label="t('whitelist.givenName')" prop="given_name">
                  <el-input v-model="formState.given_name" :placeholder="enterPlaceholder(t('whitelist.givenName'))" />
                </el-form-item>
                <el-form-item :label="t('whitelist.surname')" prop="surname">
                  <el-input v-model="formState.surname" :placeholder="enterPlaceholder(t('whitelist.surname'))" />
                </el-form-item>
              </div>
              <div class="submit-form__row">
                <el-form-item :label="t('whitelist.nationality')" prop="nationality">
                  <CountrySelect v-model="formState.nationality" :placeholder="selectPlaceholder(t('whitelist.nationality'))" />
                </el-form-item>
                <el-form-item :label="t('whitelist.residenceCountry')" prop="residence_country">
                  <CountrySelect
                    v-model="formState.residence_country"
                    :placeholder="selectPlaceholder(t('whitelist.residenceCountry'))"
                  />
                </el-form-item>
              </div>
            </template>

            <div class="submit-form__row">
              <el-form-item :label="t('whitelist.city')" prop="city">
                <el-input v-model="formState.city" :placeholder="enterPlaceholder(t('whitelist.city'))" />
              </el-form-item>
              <el-form-item :label="t('whitelist.address')" prop="address">
                <el-input v-model="formState.address" :placeholder="enterPlaceholder(t('whitelist.address'))" />
              </el-form-item>
            </div>

            <template v-if="formState.role === 1">
              <div v-if="formState.entity_type === 1" class="submit-form__row">
                <el-form-item :label="t('whitelist.registrationDate')" prop="registration_date">
                  <el-date-picker
                    v-model="formState.registration_date"
                    type="date"
                    value-format="YYYY-MM-DD"
                    :placeholder="selectPlaceholder(t('whitelist.registrationDate'))"
                  />
                </el-form-item>
                <el-form-item :label="t('whitelist.companyNo')" prop="document_no">
                  <el-input v-model="formState.document_no" :placeholder="enterPlaceholder(t('whitelist.companyNo'))" />
                </el-form-item>
              </div>
              <div v-else class="submit-form__row submit-form__row--three">
                <el-form-item :label="t('whitelist.birthDate')" prop="birth_date">
                  <el-date-picker
                    v-model="formState.birth_date"
                    type="date"
                    value-format="YYYY-MM-DD"
                    :placeholder="selectPlaceholder(t('whitelist.birthDate'))"
                  />
                </el-form-item>
                <el-form-item :label="t('whitelist.documentType')" prop="document_type">
                  <el-select v-model="formState.document_type" :placeholder="selectPlaceholder(t('whitelist.documentType'))">
                    <el-option :value="1" :label="t('whitelist.identityDocument')" /><el-option :value="2" :label="t('whitelist.passport')" />
                  </el-select>
                </el-form-item>
                <el-form-item :label="t('whitelist.documentNo')" prop="document_no">
                  <el-input v-model="formState.document_no" :placeholder="enterPlaceholder(t('whitelist.documentNo'))" />
                </el-form-item>
              </div>
            </template>
          </section>

          <section v-if="formState.role === 2" class="form-section">
            <header class="form-section__header">
              <span>02</span>
              <div>
                <h3>{{ t('whitelist.bankInfo') }}</h3>
              </div>
            </header>

            <div class="submit-form__row">
              <el-form-item :label="t('whitelist.bankName')" prop="bank_name">
                <el-input v-model="formState.bank_name" :placeholder="enterPlaceholder(t('whitelist.bankName'))" />
              </el-form-item>
              <el-form-item :label="t('whitelist.bankAccount')" prop="bank_account">
                <el-input v-model="formState.bank_account" :placeholder="enterPlaceholder(t('whitelist.bankAccount'))" />
              </el-form-item>
            </div>
            <div class="submit-form__row">
              <el-form-item label="SWIFT" prop="swift">
                <el-input v-model="formState.swift" :placeholder="enterPlaceholder('SWIFT')" />
              </el-form-item>
              <el-form-item :label="t('whitelist.intermediarySwift')" prop="intermediary_swift">
                <el-input v-model="formState.intermediary_swift" :placeholder="t('whitelist.optional')" />
              </el-form-item>
            </div>
            <div class="submit-form__row">
              <el-form-item :label="t('whitelist.remittancePurpose')" prop="remittance_purpose">
                <el-select
                  v-model="formState.remittance_purpose"
                  filterable
                  :placeholder="selectPlaceholder(t('whitelist.remittancePurpose'))"
                >
                  <el-option
                    v-for="option in REMITTANCE_PURPOSE_OPTIONS"
                    :key="option.value"
                    :label="t(option.labelKey)"
                    :value="option.value"
                  >
                    <span class="remittance-option">
                      <span>{{ t(option.labelKey) }}</span>
                    </span>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="t('whitelist.remark')" prop="remark">
                <el-input
                  v-model="formState.remark"
                  maxlength="64"
                  show-word-limit
                  :placeholder="t('whitelist.remarkPlaceholder')"
                />
              </el-form-item>
            </div>
          </section>

          <section class="form-section form-section--files">
            <header class="form-section__header">
              <span>{{ formState.role === 2 ? '03' : '02' }}</span>
              <div>
                <h3>{{ t('whitelist.proofFiles') }} <small>{{ t('whitelist.optional') }}</small></h3>
              </div>
            </header>

            <div v-if="formState.role === 1" class="proof-files-tip">
              <strong>{{ t(formState.entity_type === 1 ? 'whitelist.companyProofTitle' : 'whitelist.individualProofTitle') }}</strong>
              <ol v-if="formState.entity_type === 1">
                <li>{{ t('whitelist.companyProofBusinessRegistration') }}</li>
                <li>{{ t('whitelist.companyProofCertificate') }}</li>
                <li>{{ t('whitelist.companyProofAnnualReturn') }}</li>
                <li>{{ t('whitelist.companyProofDirectorIdentity') }}</li>
                <li>{{ t('whitelist.companyProofBankStatement') }}</li>
              </ol>
              <ul v-else>
                <li>{{ t('whitelist.individualProofPassport') }}</li>
                <li>{{ t('whitelist.individualProofBankStatement') }}</li>
              </ul>
            </div>

            <el-form-item class="upload-form-item">
              <el-upload
                v-upload-limit="uploadLimitReached"
                v-model:file-list="fileList"
                class="submit-form__upload"
                :auto-upload="false"
                :multiple="true"
                :limit="Math.max(0, 5 - retainedFiles.length)"
                :on-exceed="handleExceed"
                :show-file-list="false"
                accept=".pdf,.png,.jpg,.jpeg"
                drag
                @change="onFileChange"
              >
                <el-icon class="submit-form__upload-icon"><UploadFilled /></el-icon>
                <strong>{{ t('whitelist.uploadText') }}</strong><small>{{ t('whitelist.uploadHint') }}</small>
              </el-upload>
              <ul v-if="retainedFiles.length || fileList.length" class="retained-files el-upload-list el-upload-list--text">
                <li
                  v-for="file in retainedFiles"
                  :key="`retained-${file.file_id}`"
                  class="retained-files__item el-upload-list__item"
                >
                  <span class="retained-files__name el-upload-list__item-name" :title="file.original_name">
                    <el-icon><Document /></el-icon>
                    <span>{{ file.original_name }}</span>
                  </span>
                  <button
                    class="retained-files__remove"
                    type="button"
                    :aria-label="t('whitelist.removeFile')"
                    @click="removeRetainedFile(file.file_id)"
                  >
                    <el-icon><Close /></el-icon>
                  </button>
                </li>
                <li
                  v-for="file in fileList"
                  :key="`uploaded-${file.uid}`"
                  class="retained-files__item el-upload-list__item"
                >
                  <span class="retained-files__name el-upload-list__item-name" :title="file.name">
                    <el-icon><Document /></el-icon>
                    <span>{{ file.name }}</span>
                  </span>
                  <button
                    class="retained-files__remove"
                    type="button"
                    :aria-label="t('whitelist.removeFile')"
                    @click="removeUploadedFile(file.uid)"
                  >
                    <el-icon><Close /></el-icon>
                  </button>
                </li>
              </ul>
            </el-form-item>
          </section>
        </template>
      </el-form>
    </div>

    <template #footer>
      <footer class="submit-dialog__footer">
          <el-button v-if="activeStep === 0 || editing" plain @click="close">{{ t('common.actions.cancel') }}</el-button><el-button v-else plain @click="activeStep = 0">{{ t('whitelist.previous') }}</el-button>
          <el-button
            v-if="activeStep === 0"
            type="primary"
            @click="goNext"
          >
            {{ t('whitelist.next') }}
          </el-button>
          <el-button
            v-else
            type="primary"
            :loading="submitting || uploading"
            @click="handleSubmit"
          >
            {{ submitButtonText }}
          </el-button>
      </footer>
    </template>
  </AgentDialog>
</template>

<script setup lang="ts">
/**
 * 新增/修改白名单弹框
 * - 只负责表单 UI、弹框开关和提交事件转发；
 * - 表单状态、动态校验、参数组装和附件校验统一由 useWhitelistSubmitForm 管理；
 * - 文件上传与接口提交仍由父级 useWhitelistForm / useWhitelistActions 处理。
 */
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type { UploadFile, UploadFiles } from 'element-plus';
import { vUploadLimit } from '@/directives/uploadLimit';
import { Close, Document, DocumentAdd, EditPen, UploadFilled } from '@element-plus/icons-vue';

import type { EditWhitelistPayload, SubmitWhitelistPayload, WhitelistFile, WhitelistItemDetail } from '@/api/modules/whitelist';
import CountrySelect from '@/components/common/CountrySelect.vue';
import AgentDialog from '@/components/common/AgentDialog.vue';
import { REMITTANCE_PURPOSE_OPTIONS } from '@/constants/remittancePurposes';
import { useWhitelistSubmitForm } from '../composables/useWhitelistSubmitForm';

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    submitting?: boolean;
    uploading?: boolean;
    uploadFile: (file: File) => Promise<WhitelistFile>;
    mode?: 'create' | 'edit';
    initialDetail?: WhitelistItemDetail | null;
  }>(),
  {
    mode: 'create',
    initialDetail: null,
  },
);

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void;
  (event: 'submit', payload: { business: SubmitWhitelistPayload | Omit<EditWhitelistPayload, 'id'> }): void;
  (event: 'success', detail: WhitelistItemDetail): void;
}>();

const {
  formRef,
  formState,
  fileList,
  rules,
  hasSubjectSelection,
  formSectionTitle,
  handleExceed,
  handleFileChange,
  validateAndBuild,
  resetForm,
  loadDetail,
  retainedFiles,
  uploadLimitReached,
  removeRetainedFile,
  removeUploadedFile,
} = useWhitelistSubmitForm();

const activeStep = ref(0);
const { t, locale } = useI18n();
const editing = computed(() => props.mode === 'edit');
const dialogTitle = computed(() => t(editing.value ? 'whitelist.editTitle' : 'whitelist.add'));
const dialogIcon = computed(() => (editing.value ? EditPen : DocumentAdd));
const submitButtonText = computed(() => t(editing.value ? 'whitelist.saveChanges' : 'whitelist.submitApplication'));

function normalizePlaceholderField(field: string) {
  if (locale.value !== 'en-US' || field === 'SWIFT') return field;
  return field.charAt(0).toLocaleLowerCase('en-US') + field.slice(1);
}

function enterPlaceholder(field: string) {
  return t('common.messages.enterField', { field: normalizePlaceholderField(field) });
}

function selectPlaceholder(field: string) {
  return t('common.messages.selectField', { field: normalizePlaceholderField(field) });
}

async function goNext() {
  if (!formRef.value) return;
  const valid = await formRef.value
    .validateField(['role', 'entity_type'])
    .then(() => true)
    .catch(() => false);
  if (!valid) return;
  formRef.value.clearValidate();
  activeStep.value = 1;
}

async function handleSubmit() {
  const payload = await validateAndBuild();
  if (payload) emit('submit', payload);
}

function onFileChange(file: UploadFile, files: UploadFiles) {
  void handleFileChange(file, files, props.uploadFile);
}

function close() {
  emit('update:modelValue', false);
  activeStep.value = 0;
  resetForm();
}

function syncInitialDetail() {
  if (!props.modelValue) return;
  if (props.mode === 'edit' && props.initialDetail) {
    loadDetail(props.initialDetail);
    activeStep.value = 1;
    return;
  }
  activeStep.value = 0;
}

watch(
  () => props.modelValue,
  (val) => {
    if (!val) {
      activeStep.value = 0;
      resetForm();
      return;
    }
    syncInitialDetail();
  },
);

watch(
  () => props.initialDetail,
  () => syncInitialDetail(),
);

defineExpose({ close });
</script>

<style scoped lang="scss">
:global(.whitelist-submit-dialog) {
  background: #f5f8fb;
}

:global(.whitelist-submit-dialog .el-dialog__body) {
  padding: 0;
}

:global(.whitelist-submit-dialog .el-dialog__footer) {
  padding: 0;
}

.submit-dialog {
  &__body {
    max-height: calc(92vh - 174px);
    overflow-y: auto;
    padding: 20px 24px 24px;
  }

  &__steps {
    max-width: 620px;
    margin: 0 auto 20px;
    padding: 4px 8px 0;

    :deep(.el-step__title) {
      color: #60748a;
      font-size: 13px;
      font-weight: 650;
    }

    :deep(.el-step__title.is-process) { color: #087f79; }
    :deep(.el-step__head.is-process) { color: #0aa49a; border-color: #0aa49a; }
    :deep(.el-step__head.is-success) { color: #0aa49a; border-color: #0aa49a; }
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 18px;
    padding: 16px 24px;
    border-top: 1px solid #e2e9f0;
    background: #fff;

  }
}

.submit-form {
  display: grid;
  gap: 16px;

  &__row {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0 18px;

    &--three {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  &__upload {
    width: 100%;
  }

  &__upload-icon {
    margin-bottom: 8px;
    color: #18a89f;
    font-size: 30px;
  }

  :deep(.el-date-editor),
  :deep(.el-input-number) {
    width: 100%;
  }

  :deep(.el-form-item) {
    min-width: 0;
    margin-bottom: 18px;
  }

  :deep(.el-form-item__label) {
    color: #273b55;
    font-weight: 600;
  }

  :deep(.el-upload-dragger) {
    display: flex;
    min-height: 128px;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 20px;
    border: 1px dashed #b9d9dc;
    border-radius: 14px;
    background: #f7fcfc;
    transition: 0.2s ease;

    &:hover {
      border-color: #19a9a3;
      background: #f0fbfa;
    }

    strong {
      color: #253b55;
      font-size: 14px;
      font-weight: 650;
    }

    small {
      margin-top: 6px;
      color: #7a8a9c;
      font-size: 12px;
    }
  }
}

.form-section {
  padding: 20px 20px 2px;
  border: 1px solid #e0e8f0;
  border-radius: 17px;
  background: #fff;
  box-shadow: 0 8px 24px rgb(20 45 75 / 4%);

  &__header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 18px;

    > span {
      display: inline-flex;
      width: 34px;
      height: 34px;
      flex: 0 0 34px;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
      color: #078f89;
      background: #e9f8f6;
      font-size: 12px;
      font-weight: 750;
    }

    h3 {
      margin: 0;
      color: #102a49;
      font-size: 16px;
      font-weight: 700;
    }

    h3 small {
      margin-left: 6px;
      color: #8a98a9;
      font-size: 12px;
      font-weight: 500;
    }

  }

  &--identity {
    padding-top: 22px;
    padding-bottom: 4px;
  }

  &--files {
    padding-bottom: 2px;
  }
}

.identity-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

.upload-form-item {
  margin-bottom: 18px !important;
}
.retained-files {
  width: 100%;

  &__remove {
    position: absolute;
    top: 50%;
    right: 8px;
    display: inline-flex;
    width: 20px;
    height: 20px;
    align-items: center;
    justify-content: center;
    margin: 0;
    padding: 0;
    border: 1px solid rgb(211 72 72 / 35%);
    border-radius: 6px;
    color: #d34848;
    background: #fff;
    cursor: pointer;
    font-size: 14px;
    transform: translateY(-50%);

    &:hover,
    &:focus-visible {
      border-color: #df4b4b;
      color: #fff;
      background: #df4b4b;
      outline: none;
    }
  }
}

.proof-files-tip {
  margin: -4px 0 16px;
  padding: 14px 16px;
  border: 1px solid #d3e8e7;
  border-radius: 12px;
  color: #52667d;
  background: linear-gradient(90deg, #f1faf9 0%, #f8fbfc 100%);
  font-size: 13px;
  line-height: 1.55;

  strong {
    display: flex;
    align-items: center;
    gap: 7px;
    margin-bottom: 10px;
    color: #087f79;
    font-weight: 700;
    white-space: nowrap;

    &::before {
      display: inline-block;
      width: 7px;
      height: 7px;
      flex: 0 0 7px;
      border-radius: 50%;
      background: #18a89f;
      content: '';
      box-shadow: 0 0 0 4px rgb(24 168 159 / 10%);
    }
  }

  ol,
  ul {
    display: grid;
    margin: 0;
    padding-left: 22px;
    grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
    gap: 8px 28px;
  }

  li {
    padding-left: 2px;
    color: #435b72;
  }
}

.remittance-option {
  display: flex;
  min-width: 0;
  align-items: center;

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

@include mobile {
  :global(.whitelist-submit-dialog) {
    width: calc(100vw - 20px) !important;
    margin-top: 10px;
    border-radius: 16px;
  }

  .submit-dialog {
    &__header {
      align-items: flex-start;
      padding: 18px;
    }

    &__header-icon {
      width: 42px;
      height: 42px;
      flex-basis: 42px;
    }

    &__body {
      max-height: calc(100vh - 160px);
      padding: 14px;
    }

    &__footer {
      align-items: stretch;
      flex-direction: column;
      padding: 14px 16px;

    }
  }

  .form-section {
    padding: 17px 15px 1px;
  }

  .submit-form__row,
  .submit-form__row--three {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .identity-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }

  .proof-files-tip {
    ol,
    ul {
      grid-template-columns: 1fr;
    }
  }

}
</style>

















