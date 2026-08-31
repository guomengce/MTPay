/**
 * 新增白名单表单状态与参数组装
 *
 * 功能边界：
 * - 管理表单状态、动态文案与校验规则；
 * - 按 role + entity_type 只组装当前业务分支允许的接口参数；
 * - 校验并提取 Element Plus 上传组件中的原始 File；
 * - 不调用接口，真实上传与提交仍由 useWhitelistForm 负责。
 */
import { computed, nextTick, reactive, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import type { FormInstance, FormRules, UploadFile, UploadFiles, UploadUserFile } from 'element-plus';

import type { SubmitWhitelistPayload, WhitelistFile } from '@/api/modules/whitelist';

export interface WhitelistSubmitData {
  business: SubmitWhitelistPayload;
}

interface WhitelistSubmitFormState {
  role: 1 | 2 | null;
  entity_type: 1 | 2 | null;
  company_name: string;
  registration_country: string;
  operating_country: string;
  registration_date: string;
  company_type: 1 | 2 | null;
  document_no: string;
  given_name: string;
  surname: string;
  nationality: string;
  residence_country: string;
  birth_date: string;
  document_type: 1 | 2 | null;
  city: string;
  address: string;
  bank_name: string;
  bank_account: string;
  swift: string;
  intermediary_swift: string;
  remittance_purpose: number | null;
  remark: string;
}

const ALLOWED_FILE_EXTENSIONS = new Set(['pdf', 'png', 'jpg', 'jpeg']);
const MAX_FILE_SIZE = 10 * 1024 * 1024;

/** -------------------- 表单初始状态 -------------------- */
function createInitialState(): WhitelistSubmitFormState {
  return {
    role: null,
    entity_type: null,
    company_name: '',
    registration_country: '',
    operating_country: '',
    registration_date: '',
    company_type: null,
    document_no: '',
    given_name: '',
    surname: '',
    nationality: '',
    residence_country: '',
    birth_date: '',
    document_type: null,
    city: '',
    address: '',
    bank_name: '',
    bank_account: '',
    swift: '',
    intermediary_swift: '',
    remittance_purpose: null,
    remark: '',
  };
}

export function useWhitelistSubmitForm() {
  const { t } = useI18n();
  const formRef = ref<FormInstance>();
  const fileList = ref<UploadUserFile[]>([]);
  const formState = reactive<WhitelistSubmitFormState>(createInitialState());
  const validationEnabled = ref(false);

  /** -------------------- 页面展示状态 -------------------- */
  const hasSubjectSelection = computed(
    () => formState.role !== null && formState.entity_type !== null,
  );

  const formSectionTitle = computed(() => {
    const roleName = t(formState.role === 1 ? 'whitelist.payer' : 'whitelist.payee');
    const entityName = t(formState.entity_type === 1 ? 'whitelist.company' : 'whitelist.individual');
    return `${roleName} · ${entityName}`;
  });

  /** -------------------- 动态校验规则 -------------------- */
  const rules = computed<FormRules>(() => {
    if (!validationEnabled.value) return {};
    const role = formState.role;
    const entityType = formState.entity_type;
    const result: FormRules = {
      role: [{ required: true, message: t('common.messages.selectField', { field: t('whitelist.role') }), trigger: 'change' }],
      entity_type: [{ required: true, message: t('common.messages.selectField', { field: t('whitelist.entityType') }), trigger: 'change' }],
    };

    // 付款人 · 公司
    if (role === 1 && entityType === 1) {
      Object.assign(result, {
        company_name: [inputRule('whitelist.companyName')], company_type: [selectRule('whitelist.companyType')], registration_country: [selectRule('whitelist.registrationCountry')], operating_country: [selectRule('whitelist.operatingCountry')], registration_date: [selectRule('whitelist.registrationDate')], document_no: [inputRule('whitelist.companyNo')], city: [inputRule('whitelist.city')], address: [inputRule('whitelist.address')],
      });
    }

    // 付款人 · 个人
    if (role === 1 && entityType === 2) {
      Object.assign(result, {
        given_name: [inputRule('whitelist.givenName')], surname: [inputRule('whitelist.surname')], nationality: [selectRule('whitelist.nationality')], residence_country: [selectRule('whitelist.residenceCountry')], birth_date: [selectRule('whitelist.birthDate')], document_type: [selectRule('whitelist.documentType')], document_no: [inputRule('whitelist.documentNo')], city: [inputRule('whitelist.city')], address: [inputRule('whitelist.address')],
      });
    }

    // 收款人 · 公司
    if (role === 2 && entityType === 1) {
      Object.assign(result, {
        company_name: [inputRule('whitelist.companyName')], operating_country: [selectRule('whitelist.operatingCountry')], city: [inputRule('whitelist.city')], address: [inputRule('whitelist.address')], bank_name: [inputRule('whitelist.bankName')], bank_account: [inputRule('whitelist.bankAccount')], swift: [inputRule('SWIFT')], remittance_purpose: [selectRule('whitelist.remittancePurpose')],
      });
    }

    // 收款人 · 个人
    if (role === 2 && entityType === 2) {
      Object.assign(result, {
        given_name: [inputRule('whitelist.givenName')], surname: [inputRule('whitelist.surname')], nationality: [selectRule('whitelist.nationality')], residence_country: [selectRule('whitelist.residenceCountry')], city: [inputRule('whitelist.city')], address: [inputRule('whitelist.address')], bank_name: [inputRule('whitelist.bankName')], bank_account: [inputRule('whitelist.bankAccount')], swift: [inputRule('SWIFT')], remittance_purpose: [selectRule('whitelist.remittancePurpose')],
      });
    }
    return result;
  });
  function fieldLabel(key: string) { return key === 'SWIFT' ? key : t(key); }
  function inputRule(key: string) { return { required: true, message: t('common.messages.enterField', { field: fieldLabel(key) }), trigger: 'blur' }; }
  function selectRule(key: string) { return { required: true, message: t('common.messages.selectField', { field: fieldLabel(key) }), trigger: 'change' }; }

  /** -------------------- 接口参数组装 -------------------- */
  function buildPayload(): SubmitWhitelistPayload | null {
    if (formState.role == null || formState.entity_type == null) return null;
    const role = formState.role;
    const entity_type = formState.entity_type;
    const payload: SubmitWhitelistPayload = { role, entity_type };

    // 付款人 · 公司：只提交企业身份与登记资料。
    if (role === 1 && entity_type === 1) {
      return Object.assign(payload, {
        company_name: formState.company_name.trim(),
        registration_country: formState.registration_country.trim(),
        operating_country: formState.operating_country.trim(),
        city: formState.city.trim(),
        address: formState.address.trim(),
        registration_date: formState.registration_date,
        company_type: formState.company_type ?? undefined,
        document_no: formState.document_no.trim(),
      });
    }

    // 付款人 · 个人：只提交个人身份与居住资料。
    if (role === 1 && entity_type === 2) {
      return Object.assign(payload, {
        given_name: formState.given_name.trim(),
        surname: formState.surname.trim(),
        nationality: formState.nationality.trim(),
        residence_country: formState.residence_country.trim(),
        city: formState.city.trim(),
        address: formState.address.trim(),
        birth_date: formState.birth_date,
        document_type: formState.document_type ?? undefined,
        document_no: formState.document_no.trim(),
      });
    }

    // 收款人 · 公司：提交公司基础资料与收款银行资料。
    if (role === 2 && entity_type === 1) {
      return Object.assign(payload, {
        company_name: formState.company_name.trim(),
        operating_country: formState.operating_country.trim(),
        city: formState.city.trim(),
        address: formState.address.trim(),
        bank_name: formState.bank_name.trim(),
        bank_account: formState.bank_account.trim(),
        swift: formState.swift.trim(),
        intermediary_swift: formState.intermediary_swift.trim() || undefined,
        remittance_purpose: formState.remittance_purpose ?? undefined,
        remark: formState.remark.trim() || undefined,
      });
    }

    // 收款人 · 个人：提交个人基础资料与收款银行资料。
    return Object.assign(payload, {
      given_name: formState.given_name.trim(),
      surname: formState.surname.trim(),
      nationality: formState.nationality.trim(),
      residence_country: formState.residence_country.trim(),
      city: formState.city.trim(),
      address: formState.address.trim(),
      bank_name: formState.bank_name.trim(),
      bank_account: formState.bank_account.trim(),
      swift: formState.swift.trim(),
      intermediary_swift: formState.intermediary_swift.trim() || undefined,
      remittance_purpose: formState.remittance_purpose ?? undefined,
      remark: formState.remark.trim() || undefined,
    });
  }

  /** -------------------- 附件提取与校验 -------------------- */
  async function handleFileChange(file: UploadFile, currentFiles: UploadFiles, uploadFile: (file: File) => Promise<WhitelistFile>) {
    fileList.value=currentFiles;
    if(!file.raw||file.status==='success')return;
    if(file.raw.size>MAX_FILE_SIZE||!ALLOWED_FILE_EXTENSIONS.has(file.raw.name.split('.').pop()?.toLowerCase()||'')){ElMessage.warning(t('whitelist.uploadHint'));fileList.value=fileList.value.filter(item=>item.uid!==file.uid);return;}
    try{file.status='uploading';file.response=await uploadFile(file.raw);file.status='success';}catch{file.status='fail';fileList.value=fileList.value.filter(item=>item.uid!==file.uid);}
  }

  function handleExceed() {
    ElMessage.warning(t('whitelist.maxFiles'));
  }

  /** -------------------- 表单提交与重置 -------------------- */
  async function validateAndBuild(): Promise<WhitelistSubmitData | null> {
    if (!formRef.value) return null;
    validationEnabled.value = true;
    await nextTick();
    if (!(await formRef.value.validate().catch(() => false))) return null;
    const business = buildPayload();
    if (!business) return null;
    if(fileList.value.some(item=>item.status==='uploading'||item.status==='ready'))return null;
    const fileIds=fileList.value.map(item=>(item.response as WhitelistFile|undefined)?.file_id).filter((id):id is number=>typeof id==='number');
    business.file_ids=fileIds.length?fileIds:undefined;
    return { business };
  }

  function resetForm() {
    Object.assign(formState, createInitialState());
    fileList.value = [];
    validationEnabled.value = false;
    formRef.value?.clearValidate();
  }

  watch(
    () => [formState.role, formState.entity_type],
    () => {
      if (!validationEnabled.value) formRef.value?.clearValidate();
    },
    { flush: 'post' },
  );

  return {
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
  };
}
