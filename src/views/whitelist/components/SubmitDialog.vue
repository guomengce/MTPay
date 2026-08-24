<template>
  <el-dialog
    :model-value="modelValue"
    class="whitelist-submit-dialog"
    width="min(880px, calc(100vw - 32px))"
    top="4vh"
    :show-close="false"
    :close-on-click-modal="false"
    destroy-on-close
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template #header>
      <header class="submit-dialog__header">
        <span class="submit-dialog__header-icon">
          <el-icon><DocumentAdd /></el-icon>
        </span>
        <div>
          <h2>新增白名单</h2>
          <p>填写付款人或收款人的真实资料，审核通过后可用于出金申请</p>
        </div>
        <el-button
          class="submit-dialog__close"
          text
          circle
          :icon="Close"
          aria-label="关闭"
          @click="close"
        />
      </header>
    </template>

    <div class="submit-dialog__body">
      <el-form
        ref="formRef"
        :model="formState"
        :rules="rules"
        label-position="top"
        class="submit-form"
      >
        <section class="form-section form-section--identity">
          <header class="form-section__header">
            <span>01</span>
            <div>
              <h3>选择主体身份</h3>
              <p>不同角色和主体类型需要填写不同的审核资料</p>
            </div>
          </header>

          <div class="identity-grid">
            <el-form-item label="白名单角色" prop="role">
              <el-radio-group v-model="formState.role" class="identity-options">
                <el-radio-button :value="1">
                  <span class="identity-option">
                    <el-icon><Upload /></el-icon>
                    <span><strong>付款人</strong><small>资金汇出方</small></span>
                  </span>
                </el-radio-button>
                <el-radio-button :value="2">
                  <span class="identity-option">
                    <el-icon><Download /></el-icon>
                    <span><strong>收款人</strong><small>资金接收方</small></span>
                  </span>
                </el-radio-button>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="主体类型" prop="entity_type">
              <el-radio-group v-model="formState.entity_type" class="identity-options">
                <el-radio-button :value="1">
                  <span class="identity-option">
                    <el-icon><OfficeBuilding /></el-icon>
                    <span><strong>公司</strong><small>企业或机构</small></span>
                  </span>
                </el-radio-button>
                <el-radio-button :value="2">
                  <span class="identity-option">
                    <el-icon><User /></el-icon>
                    <span><strong>个人</strong><small>自然人主体</small></span>
                  </span>
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
          </div>
        </section>

        <template v-if="hasSubjectSelection">
          <section class="form-section">
            <header class="form-section__header">
              <span>02</span>
              <div>
                <h3>{{ formSectionTitle }}</h3>
                <p>{{ formSectionDescription }}</p>
              </div>
            </header>

            <template v-if="formState.entity_type === 1">
              <div class="submit-form__row">
                <el-form-item label="公司名称" prop="company_name">
                  <el-input v-model="formState.company_name" placeholder="请输入公司完整名称" />
                </el-form-item>
                <el-form-item v-if="formState.role === 1" label="公司类型" prop="company_type">
                  <el-select v-model="formState.company_type" placeholder="请选择公司类型">
                    <el-option :value="1" label="非金融机构" />
                    <el-option :value="2" label="金融机构" />
                  </el-select>
                </el-form-item>
                <el-form-item v-else label="经营国家／地区" prop="operating_country">
                  <CountrySelect
                    v-model="formState.operating_country"
                    placeholder="請選擇經營國家／地區"
                  />
                </el-form-item>
              </div>

              <div v-if="formState.role === 1" class="submit-form__row">
                <el-form-item label="注册国家／地区" prop="registration_country">
                  <CountrySelect
                    v-model="formState.registration_country"
                    placeholder="請選擇註冊國家／地區"
                  />
                </el-form-item>
                <el-form-item label="经营国家／地区" prop="operating_country">
                  <CountrySelect
                    v-model="formState.operating_country"
                    placeholder="請選擇經營國家／地區"
                  />
                </el-form-item>
              </div>
            </template>

            <template v-else>
              <div class="submit-form__row">
                <el-form-item label="名" prop="given_name">
                  <el-input v-model="formState.given_name" placeholder="请输入名" />
                </el-form-item>
                <el-form-item label="姓" prop="surname">
                  <el-input v-model="formState.surname" placeholder="请输入姓" />
                </el-form-item>
              </div>
              <div class="submit-form__row">
                <el-form-item label="国籍" prop="nationality">
                  <CountrySelect v-model="formState.nationality" placeholder="請選擇國籍" />
                </el-form-item>
                <el-form-item label="居住国家／地区" prop="residence_country">
                  <CountrySelect
                    v-model="formState.residence_country"
                    placeholder="請選擇居住國家／地區"
                  />
                </el-form-item>
              </div>
            </template>

            <div class="submit-form__row">
              <el-form-item label="所在城市" prop="city">
                <el-input v-model="formState.city" placeholder="请输入所在城市" />
              </el-form-item>
              <el-form-item label="详细地址" prop="address">
                <el-input v-model="formState.address" placeholder="请输入完整地址" />
              </el-form-item>
            </div>

            <template v-if="formState.role === 1">
              <div v-if="formState.entity_type === 1" class="submit-form__row">
                <el-form-item label="注册日期" prop="registration_date">
                  <el-date-picker
                    v-model="formState.registration_date"
                    type="date"
                    value-format="YYYY-MM-DD"
                    placeholder="请选择注册日期"
                  />
                </el-form-item>
                <el-form-item label="证件编号" prop="document_no">
                  <el-input v-model="formState.document_no" placeholder="请输入证件编号" />
                </el-form-item>
              </div>
              <div v-else class="submit-form__row submit-form__row--three">
                <el-form-item label="出生日期" prop="birth_date">
                  <el-date-picker
                    v-model="formState.birth_date"
                    type="date"
                    value-format="YYYY-MM-DD"
                    placeholder="请选择出生日期"
                  />
                </el-form-item>
                <el-form-item label="证件类型" prop="document_type">
                  <el-select v-model="formState.document_type" placeholder="请选择证件类型">
                    <el-option :value="1" label="身份证件" />
                    <el-option :value="2" label="护照" />
                  </el-select>
                </el-form-item>
                <el-form-item label="证件编号" prop="document_no">
                  <el-input v-model="formState.document_no" placeholder="请输入证件编号" />
                </el-form-item>
              </div>
            </template>
          </section>

          <section v-if="formState.role === 2" class="form-section">
            <header class="form-section__header">
              <span>03</span>
              <div>
                <h3>银行与汇款资料</h3>
                <p>用于核对收款账户和汇款用途</p>
              </div>
            </header>

            <div class="submit-form__row">
              <el-form-item label="银行名称" prop="bank_name">
                <el-input v-model="formState.bank_name" placeholder="请输入银行名称" />
              </el-form-item>
              <el-form-item label="银行账号" prop="bank_account">
                <el-input v-model="formState.bank_account" placeholder="请输入银行账号" />
              </el-form-item>
            </div>
            <div class="submit-form__row">
              <el-form-item label="SWIFT" prop="swift">
                <el-input v-model="formState.swift" placeholder="请输入 SWIFT 代码" />
              </el-form-item>
              <el-form-item label="中间行 SWIFT（可选）" prop="intermediary_swift">
                <el-input v-model="formState.intermediary_swift" placeholder="没有可不填写" />
              </el-form-item>
            </div>
            <div class="submit-form__row">
              <el-form-item label="汇款目的" prop="remittance_purpose">
                <el-select
                  v-model="formState.remittance_purpose"
                  filterable
                  placeholder="请选择或搜索汇款目的"
                >
                  <el-option
                    v-for="option in REMITTANCE_PURPOSE_OPTIONS"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                  >
                    <span class="remittance-option">
                      <small>{{ option.value }}</small>
                      <span>{{ option.label }}</span>
                    </span>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="备注（可选）" prop="remark">
                <el-input v-model="formState.remark" placeholder="补充说明本次汇款用途" />
              </el-form-item>
            </div>
          </section>

          <section class="form-section form-section--files">
            <header class="form-section__header">
              <span>{{ formState.role === 2 ? '04' : '03' }}</span>
              <div>
                <h3>证明文件 <small>选填</small></h3>
                <p>上传有助于审核主体身份的证明材料</p>
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
                <strong>点击选择或拖动文件到此处</strong>
                <small>PDF / PNG / JPG / JPEG，单文件不超过 10 MB，最多 5 个</small>
              </el-upload>
            </el-form-item>
          </section>
        </template>
      </el-form>
    </div>

    <template #footer>
      <footer class="submit-dialog__footer">
        <p>
          <el-icon><Lock /></el-icon>
          提交资料将加密传输并仅用于业务审核
        </p>
        <div>
          <el-button plain @click="close">取消</el-button>
          <el-button
            type="primary"
            :loading="submitting || uploading"
            :disabled="!hasSubjectSelection"
            @click="handleSubmit"
          >
            提交申请
          </el-button>
        </div>
      </footer>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
/**
 * 新增白名单弹框
 * - 只负责表单 UI、弹框开关和提交事件转发；
 * - 表单状态、动态校验、参数组装和附件校验统一由 useWhitelistSubmitForm 管理；
 * - 文件上传与接口提交仍由父级 useWhitelistForm 处理。
 */
import { watch } from 'vue';
import type { UploadFile, UploadFiles } from 'element-plus';
import {
  Close,
  DocumentAdd,
  Download,
  Lock,
  OfficeBuilding,
  Upload,
  UploadFilled,
  User,
} from '@element-plus/icons-vue';

import type { SubmitWhitelistPayload, WhitelistFile, WhitelistItemDetail } from '@/api/modules/whitelist';
import CountrySelect from '@/components/common/CountrySelect.vue';
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
  formSectionDescription,
  handleExceed,
  handleFileChange,
  validateAndBuild,
  resetForm,
} = useWhitelistSubmitForm();

async function handleSubmit() {
  const payload = await validateAndBuild();
  if (payload) emit('submit', payload);
}

function onFileChange(file: UploadFile, files: UploadFiles) {
  void handleFileChange(file, files, props.uploadFile);
}

function close() {
  emit('update:modelValue', false);
  resetForm();
}

watch(
  () => props.modelValue,
  (val) => {
    if (!val) resetForm();
  },
);

defineExpose({ close });
</script>

<style scoped lang="scss">
:global(.whitelist-submit-dialog) {
  overflow: hidden;
  border: 1px solid #dce6ef;
  border-radius: 22px;
  background: #f5f8fb;
  box-shadow: 0 28px 80px rgb(8 31 58 / 22%);
}

:global(.whitelist-submit-dialog .el-dialog__header) {
  margin: 0;
  padding: 0;
}

:global(.whitelist-submit-dialog .el-dialog__body) {
  padding: 0;
}

:global(.whitelist-submit-dialog .el-dialog__footer) {
  padding: 0;
}

.submit-dialog {
  &__header {
    display: flex;
    position: relative;
    align-items: center;
    gap: 15px;
    padding: 22px 26px;
    border-bottom: 1px solid #e2e9f0;
    background: radial-gradient(circle at 78% 0%, rgb(25 184 168 / 12%), transparent 32%), #fff;

    &-icon {
      display: inline-flex;
      width: 48px;
      height: 48px;
      flex: 0 0 48px;
      align-items: center;
      justify-content: center;
      border-radius: 14px;
      color: #fff;
      background: linear-gradient(135deg, #19b8a8, #268ee6);
      box-shadow: 0 10px 24px rgb(20 166 174 / 22%);
      font-size: 24px;
    }

    div {
      min-width: 0;
      flex: 1;
    }

    h2 {
      margin: 0;
      color: #0a2342;
      font-size: 22px;
      font-weight: 750;
    }

    p {
      margin: 5px 0 0;
      color: #6a7c91;
      font-size: 13px;
      line-height: 1.5;
    }
  }

  &__close {
    flex: 0 0 auto;
    color: #718096;
    font-size: 18px;
  }

  &__body {
    max-height: calc(92vh - 174px);
    overflow-y: auto;
    padding: 20px 24px 24px;
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    padding: 16px 24px;
    border-top: 1px solid #e2e9f0;
    background: #fff;

    p {
      display: flex;
      align-items: center;
      gap: 7px;
      margin: 0;
      color: #6a7c91;
      font-size: 12px;
    }

    p .el-icon {
      color: #159b95;
    }

    > div {
      display: flex;
      gap: 10px;
    }
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

    p {
      margin: 3px 0 0;
      color: #7a8a9c;
      font-size: 12px;
    }
  }

  &--identity {
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

.identity-options {
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr;
  gap: 10px;

  :deep(.el-radio-button) {
    width: 100%;
  }

  :deep(.el-radio-button__inner) {
    width: 100%;
    height: auto;
    padding: 0;
    border: 1px solid #dce5ee !important;
    border-radius: 12px !important;
    box-shadow: none !important;
    background: #f9fbfd;
  }

  :deep(.el-radio-button.is-active .el-radio-button__inner) {
    border-color: #18aaa3 !important;
    color: #087f7b;
    background: #ecfaf8;
  }
}

.identity-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;

  > .el-icon {
    color: #4f789a;
    font-size: 20px;
  }

  > span {
    display: grid;
    min-width: 0;
    gap: 2px;
    text-align: left;
  }

  strong {
    color: #193450;
    font-size: 14px;
    font-weight: 650;
  }

  small {
    color: #8391a2;
    font-size: 11px;
  }
}

.upload-form-item {
  margin-bottom: 18px !important;
}

.remittance-option {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 10px;

  small {
    display: inline-flex;
    width: 24px;
    flex: 0 0 24px;
    justify-content: center;
    color: #078f89;
    font-weight: 700;
  }

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

      > div {
        width: 100%;
      }

      > div .el-button {
        flex: 1;
      }
    }
  }

  .form-section {
    padding: 17px 15px 1px;
  }

  .identity-grid,
  .submit-form__row,
  .submit-form__row--three {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .identity-options {
    gap: 8px;
  }
}
</style>
