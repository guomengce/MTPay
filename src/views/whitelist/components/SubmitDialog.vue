<template>
  <AgentDialog
    :model-value="modelValue"
    class="whitelist-submit-dialog"
    :title="t('whitelist.add')"
    :icon="DocumentAdd"
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
                    :placeholder="t('common.messages.selectField', { field: t('whitelist.operatingCountry') })"
                  />
                </el-form-item>
              </div>

              <div v-if="formState.role === 1" class="submit-form__row">
                <el-form-item :label="t('whitelist.registrationCountry')" prop="registration_country">
                  <CountrySelect
                    v-model="formState.registration_country"
                    :placeholder="t('common.messages.selectField', { field: t('whitelist.registrationCountry') })"
                  />
                </el-form-item>
                <el-form-item :label="t('whitelist.operatingCountry')" prop="operating_country">
                  <CountrySelect
                    v-model="formState.operating_country"
                    :placeholder="t('common.messages.selectField', { field: t('whitelist.operatingCountry') })"
                  />
                </el-form-item>
              </div>
            </template>

            <template v-else>
              <div class="submit-form__row">
                <el-form-item :label="t('whitelist.givenName')" prop="given_name">
                  <el-input v-model="formState.given_name" :placeholder="t('common.messages.enterField', { field: t('whitelist.givenName') })" />
                </el-form-item>
                <el-form-item :label="t('whitelist.surname')" prop="surname">
                  <el-input v-model="formState.surname" :placeholder="t('common.messages.enterField', { field: t('whitelist.surname') })" />
                </el-form-item>
              </div>
              <div class="submit-form__row">
                <el-form-item :label="t('whitelist.nationality')" prop="nationality">
                  <CountrySelect v-model="formState.nationality" :placeholder="t('common.messages.selectField', { field: t('whitelist.nationality') })" />
                </el-form-item>
                <el-form-item :label="t('whitelist.residenceCountry')" prop="residence_country">
                  <CountrySelect
                    v-model="formState.residence_country"
                    :placeholder="t('common.messages.selectField', { field: t('whitelist.residenceCountry') })"
                  />
                </el-form-item>
              </div>
            </template>

            <div class="submit-form__row">
              <el-form-item :label="t('whitelist.city')" prop="city">
                <el-input v-model="formState.city" :placeholder="t('common.messages.enterField', { field: t('whitelist.city') })" />
              </el-form-item>
              <el-form-item :label="t('whitelist.address')" prop="address">
                <el-input v-model="formState.address" :placeholder="t('common.messages.enterField', { field: t('whitelist.address') })" />
              </el-form-item>
            </div>

            <template v-if="formState.role === 1">
              <div v-if="formState.entity_type === 1" class="submit-form__row">
                <el-form-item :label="t('whitelist.registrationDate')" prop="registration_date">
                  <el-date-picker
                    v-model="formState.registration_date"
                    type="date"
                    value-format="YYYY-MM-DD"
                    :placeholder="t('common.messages.selectField', { field: t('whitelist.registrationDate') })"
                  />
                </el-form-item>
                <el-form-item :label="t('whitelist.companyNo')" prop="document_no">
                  <el-input v-model="formState.document_no" :placeholder="t('common.messages.enterField', { field: t('whitelist.companyNo') })" />
                </el-form-item>
              </div>
              <div v-else class="submit-form__row submit-form__row--three">
                <el-form-item :label="t('whitelist.birthDate')" prop="birth_date">
                  <el-date-picker
                    v-model="formState.birth_date"
                    type="date"
                    value-format="YYYY-MM-DD"
                    :placeholder="t('common.messages.selectField', { field: t('whitelist.birthDate') })"
                  />
                </el-form-item>
                <el-form-item :label="t('whitelist.documentType')" prop="document_type">
                  <el-select v-model="formState.document_type" :placeholder="t('common.messages.selectField', { field: t('whitelist.documentType') })">
                    <el-option :value="1" :label="t('whitelist.identityDocument')" /><el-option :value="2" :label="t('whitelist.passport')" />
                  </el-select>
                </el-form-item>
                <el-form-item :label="t('whitelist.documentNo')" prop="document_no">
                  <el-input v-model="formState.document_no" :placeholder="t('common.messages.enterField', { field: t('whitelist.documentNo') })" />
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
                <el-input v-model="formState.bank_name" :placeholder="t('common.messages.enterField', { field: t('whitelist.bankName') })" />
              </el-form-item>
              <el-form-item :label="t('whitelist.bankAccount')" prop="bank_account">
                <el-input v-model="formState.bank_account" :placeholder="t('common.messages.enterField', { field: t('whitelist.bankAccount') })" />
              </el-form-item>
            </div>
            <div class="submit-form__row">
              <el-form-item label="SWIFT" prop="swift">
                <el-input v-model="formState.swift" :placeholder="t('common.messages.enterField', { field: 'SWIFT' })" />
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
                  :placeholder="t('common.messages.selectField', { field: t('whitelist.remittancePurpose') })"
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
                <el-input v-model="formState.remark" :placeholder="t('whitelist.remark')" />
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

            <el-form-item class="upload-form-item">
              <el-upload
                v-model:file-list="fileList"
                class="submit-form__upload"
                :auto-upload="false"
                :multiple="true"
                :limit="5"
                :on-exceed="handleExceed"
                accept=".pdf,.png,.jpg,.jpeg"
                drag
                @change="onFileChange"
              >
                <el-icon class="submit-form__upload-icon"><UploadFilled /></el-icon>
                <strong>{{ t('whitelist.uploadText') }}</strong><small>{{ t('whitelist.uploadHint') }}</small>
              </el-upload>
            </el-form-item>
          </section>
        </template>
      </el-form>
    </div>

    <template #footer>
      <footer class="submit-dialog__footer">
          <el-button v-if="activeStep === 0" plain @click="close">{{ t('common.actions.cancel') }}</el-button><el-button v-else plain @click="activeStep = 0">{{ t('whitelist.previous') }}</el-button>
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
            {{ t('whitelist.submitApplication') }}
          </el-button>
      </footer>
    </template>
  </AgentDialog>
</template>

<script setup lang="ts">
/**
 * 新增白名单弹框
 * - 只负责表单 UI、弹框开关和提交事件转发；
 * - 表单状态、动态校验、参数组装和附件校验统一由 useWhitelistSubmitForm 管理；
 * - 文件上传与接口提交仍由父级 useWhitelistForm 处理。
 */
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type { UploadFile, UploadFiles } from 'element-plus';
import { DocumentAdd, UploadFilled } from '@element-plus/icons-vue';

import type { SubmitWhitelistPayload, WhitelistFile, WhitelistItemDetail } from '@/api/modules/whitelist';
import CountrySelect from '@/components/common/CountrySelect.vue';
import AgentDialog from '@/components/common/AgentDialog.vue';
import { REMITTANCE_PURPOSE_OPTIONS } from '@/constants/remittancePurposes';
import { useWhitelistSubmitForm } from '../composables/useWhitelistSubmitForm';

const props = defineProps<{
  modelValue: boolean;
  submitting?: boolean;
  uploading?: boolean;
  uploadFile: (file: File) => Promise<WhitelistFile>;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void;
  (event: 'submit', payload: { business: SubmitWhitelistPayload }): void;
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
} = useWhitelistSubmitForm();

const activeStep = ref(0);
const { t } = useI18n();

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

watch(
  () => props.modelValue,
  (val) => {
    if (!val) {
      activeStep.value = 0;
      resetForm();
    }
  },
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

}
</style>
