/**
 * 新增白名单表单状态与参数组装
 *
 * 功能边界：
 * - 管理表单状态、动态文案与校验规则；
 * - 按 role + entity_type 只组装当前业务分支允许的接口参数；
 * - 校验并提取 Element Plus 上传组件中的原始 File；
 * - 不调用接口，真实上传与提交仍由 useWhitelistForm 负责。
 */
import { computed, reactive, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules, UploadRawFile, UploadUserFile } from 'element-plus';

import type { SubmitWhitelistPayload } from '@/api/modules/whitelist';

export interface WhitelistSubmitData {
  business: SubmitWhitelistPayload;
  files: File[];
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
  const formRef = ref<FormInstance>();
  const fileList = ref<UploadUserFile[]>([]);
  const formState = reactive<WhitelistSubmitFormState>(createInitialState());

  /** -------------------- 页面展示状态 -------------------- */
  const hasSubjectSelection = computed(
    () => formState.role !== null && formState.entity_type !== null,
  );

  const formSectionTitle = computed(() => {
    const roleName = formState.role === 1 ? '付款人' : '收款人';
    const entityName = formState.entity_type === 1 ? '公司' : '个人';
    return `${roleName} · ${entityName}资料`;
  });

  const formSectionDescription = computed(() =>
    formState.entity_type === 1
      ? '填写企业登记、所在地及身份识别信息'
      : '填写个人身份、国籍及居住地址信息',
  );

  /** -------------------- 动态校验规则 -------------------- */
  const rules = computed<FormRules>(() => {
    const role = formState.role;
    const entityType = formState.entity_type;
    const result: FormRules = {
      role: [{ required: true, message: '请选择主体角色', trigger: 'change' }],
      entity_type: [{ required: true, message: '请选择主体类型', trigger: 'change' }],
    };

    // 付款人 · 公司
    if (role === 1 && entityType === 1) {
      Object.assign(result, {
        company_name: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
        company_type: [{ required: true, message: '请选择公司类型', trigger: 'change' }],
        registration_country: [{ required: true, message: '请选择注册国家', trigger: 'change' }],
        operating_country: [{ required: true, message: '请选择经营国家', trigger: 'change' }],
        registration_date: [{ required: true, message: '请选择注册日期', trigger: 'change' }],
        document_no: [{ required: true, message: '请输入证件编号', trigger: 'blur' }],
        city: [{ required: true, message: '请输入城市', trigger: 'blur' }],
        address: [{ required: true, message: '请输入地址', trigger: 'blur' }],
      });
    }

    // 付款人 · 个人
    if (role === 1 && entityType === 2) {
      Object.assign(result, {
        given_name: [{ required: true, message: '请输入名', trigger: 'blur' }],
        surname: [{ required: true, message: '请输入姓', trigger: 'blur' }],
        nationality: [{ required: true, message: '请选择国籍', trigger: 'change' }],
        residence_country: [{ required: true, message: '请选择居住国家', trigger: 'change' }],
        birth_date: [{ required: true, message: '请选择出生日期', trigger: 'change' }],
        document_type: [{ required: true, message: '请选择证件类型', trigger: 'change' }],
        document_no: [{ required: true, message: '请输入证件编号', trigger: 'blur' }],
        city: [{ required: true, message: '请输入城市', trigger: 'blur' }],
        address: [{ required: true, message: '请输入地址', trigger: 'blur' }],
      });
    }

    // 收款人 · 公司
    if (role === 2 && entityType === 1) {
      Object.assign(result, {
        company_name: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
        operating_country: [{ required: true, message: '请选择经营国家', trigger: 'change' }],
        city: [{ required: true, message: '请输入城市', trigger: 'blur' }],
        address: [{ required: true, message: '请输入地址', trigger: 'blur' }],
        bank_name: [{ required: true, message: '请输入银行名称', trigger: 'blur' }],
        bank_account: [{ required: true, message: '请输入银行账号', trigger: 'blur' }],
        swift: [{ required: true, message: '请输入 SWIFT', trigger: 'blur' }],
        remittance_purpose: [{ required: true, message: '请选择汇款目的', trigger: 'change' }],
      });
    }

    // 收款人 · 个人
    if (role === 2 && entityType === 2) {
      Object.assign(result, {
        given_name: [{ required: true, message: '请输入名', trigger: 'blur' }],
        surname: [{ required: true, message: '请输入姓', trigger: 'blur' }],
        nationality: [{ required: true, message: '请选择国籍', trigger: 'change' }],
        residence_country: [{ required: true, message: '请选择居住国家', trigger: 'change' }],
        city: [{ required: true, message: '请输入城市', trigger: 'blur' }],
        address: [{ required: true, message: '请输入地址', trigger: 'blur' }],
        bank_name: [{ required: true, message: '请输入银行名称', trigger: 'blur' }],
        bank_account: [{ required: true, message: '请输入银行账号', trigger: 'blur' }],
        swift: [{ required: true, message: '请输入 SWIFT', trigger: 'blur' }],
        remittance_purpose: [{ required: true, message: '请选择汇款目的', trigger: 'change' }],
      });
    }
    return result;
  });

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
  function extractFiles(): File[] | null {
    const files = fileList.value
      .map((item) => item.raw)
      .filter((raw): raw is UploadRawFile => Boolean(raw)) as File[];
    if (files.some((file) => file.size > MAX_FILE_SIZE)) {
      ElMessage.warning('单个文件不能超过 10 MB');
      return null;
    }
    if (
      files.some(
        (file) => !ALLOWED_FILE_EXTENSIONS.has(file.name.split('.').pop()?.toLowerCase() || ''),
      )
    ) {
      ElMessage.warning('仅支持 PDF、PNG、JPG、JPEG 文件');
      return null;
    }
    return files;
  }

  function handleExceed() {
    ElMessage.warning('最多上传 5 个文件');
  }

  /** -------------------- 表单提交与重置 -------------------- */
  async function validateAndBuild(): Promise<WhitelistSubmitData | null> {
    if (!formRef.value) return null;
    if (!(await formRef.value.validate().catch(() => false))) return null;
    const business = buildPayload();
    const files = extractFiles();
    if (!business || !files) return null;
    return { business, files };
  }

  function resetForm() {
    Object.assign(formState, createInitialState());
    fileList.value = [];
    formRef.value?.clearValidate();
  }

  watch(
    () => [formState.role, formState.entity_type],
    () => formRef.value?.clearValidate(),
  );

  return {
    formRef,
    formState,
    fileList,
    rules,
    hasSubjectSelection,
    formSectionTitle,
    formSectionDescription,
    handleExceed,
    validateAndBuild,
    resetForm,
  };
}
