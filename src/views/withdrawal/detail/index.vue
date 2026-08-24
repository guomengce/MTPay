<template>
  <main class="business-detail withdrawal-detail">
    <div class="business-detail__toolbar">
      <button class="business-detail__back" type="button" @click="goBack">
        <i class="ri-arrow-left-line" />返回出金列表
      </button>
      <el-button
        v-if="supplementVisible"
        type="primary"
        :icon="Upload"
        @click="supplementDialogVisible = true"
        >补交文件</el-button
      >
    </div>

    <div class="business-detail__content">
      <template v-if="detail">
        <WithdrawalDetailContent :detail="detail" :file-loading="fileLoading" @preview="openFilePreview" @download="downloadFile" />

        <SupplementDialog
          v-model="supplementDialogVisible"
          :row="detail"
          :requirement="supplementRequirement"
          :submitting="supplementSubmitting"
          :uploading="supplementUploading"
          :upload-file="uploadSupplementFile"
          @submit="handleSupplement"
        />
      </template>

      <el-empty v-else-if="!loading" description="未找到该出金订单">
        <el-button type="primary" @click="goBack">返回出金列表</el-button>
      </el-empty>
    </div>
  </main>
</template>

<script setup lang="ts">
/**
 * 出金详情（代理端）
 * - 页面只负责数据加载与卡片编排，各信息模块为独立组件；
 * - 补件入口严格依据详情中的 available_actions.agent_can_supplement。
 */
import { computed, onMounted, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { Upload } from '@element-plus/icons-vue';
import { useRoute, useRouter } from 'vue-router';
import { usePageLoading } from '@/composables/usePageLoading';

import WithdrawalDetailContent from '@/views/withdrawal/detail/components/WithdrawalDetailContent.vue';
import { useWithdrawalDetail } from '@/views/withdrawal/composables/useWithdrawalDetail';
import { useWithdrawalFiles } from '@/views/withdrawal/composables/useWithdrawalFiles';
import { useWithdrawalSupplement } from '@/views/withdrawal/composables/useWithdrawalSupplement';
import SupplementDialog from '@/views/withdrawal/components/SupplementDialog.vue';

const route = useRoute();
const router = useRouter();
const { loading, detail, fetchDetail } = useWithdrawalDetail();
usePageLoading(loading);
const { loading: fileLoading, openPreview, triggerDownload } = useWithdrawalFiles();
const {
  submitting: supplementSubmitting,
  uploading: supplementUploading,
  submit: submitSupplement,
  uploadFile: uploadSupplementFile,
} = useWithdrawalSupplement();

const id = computed(() => Number(route.params.id));
const supplementDialogVisible = ref(false);

const supplementVisible = computed(() =>
  Boolean(detail.value?.available_actions?.agent_can_supplement),
);
const supplementRequirement = computed(() => {
  const d = detail.value;
  if (!d) return '请按平台要求补充证明材料。';
  if (d.review?.note) return d.review.note;
  const request = (d.records ?? []).find((record) => {
    const text = record.action_name;
    return /要求|补充|补件|supplement/i.test(text);
  });
  return request?.message || '请按平台要求补充证明材料。';
});


function goBack() {
  void router.push('/withdrawal');
}

function openFilePreview(fileId: number) {
  void openPreview(fileId);
}

function downloadFile(fileId: number) {
  void triggerDownload(fileId);
}

async function handleSupplement(payload: { file_ids: number[]; message?: string }) {
  if (!detail.value) return;
  try {
    await submitSupplement({
      id: detail.value.id,
      file_ids: payload.file_ids,
      message: payload.message,
    });
    ElMessage.success('补件已提交，订单将重新进入审核');
    supplementDialogVisible.value = false;
    await reload();
  } catch {
    /* 统一请求层已提示后端错误 */
  }
}

async function reload() {
  await fetchDetail(id.value);
  if (route.query.action === 'supplement' && supplementVisible.value) {
    supplementDialogVisible.value = true;
  }
}

onMounted(reload);
watch(id, reload);
</script>

<style scoped lang="scss">
.business-detail {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 14px;
  padding: 20px;

  &__toolbar {
    display: flex;
    min-width: 0;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  &__back {
    display: inline-flex;
    width: fit-content;
    align-items: center;
    gap: 7px;
    height: 36px;
    padding: 0 14px;
    border: 1px solid #d6e1eb;
    border-radius: 10px;
    color: #38536f;
    background: #fff;
    box-shadow: 0 4px 12px rgb(31 66 102 / 5%);
    cursor: pointer;
    font: inherit;
    font-size: 13px;
    font-weight: 600;

    &:hover {
      border-color: #9fd8d3;
      color: #0b9b92;
      background: #f2fbfa;
    }
  }

  &__content {
    min-height: 300px;
  }

  &__workspace {
    display: grid;
    min-width: 0;
    align-items: start;
    grid-template-columns: minmax(0, 1.15fr) minmax(420px, 0.95fr);
    gap: 18px;
    margin-top: 18px;

    &.is-single { grid-template-columns: minmax(0, 1fr); }
  }

  &__main,
  &__aside {
    display: grid;
    min-width: 0;
    gap: 18px;
  }

  &__aside {
    position: sticky;
    top: 24px;
  }

  &__sections {
    display: grid;
    min-width: 0;
    grid-template-columns: minmax(0, 1fr);
    gap: 18px;
  }
}

@include narrow {
  .business-detail {
    padding: 18px;
  }

  .business-detail__workspace {
    grid-template-columns: minmax(0, 1fr);
  }

  .business-detail__aside {
    position: static;
  }
}

@include mobile {
  .business-detail {
    padding: 12px;
  }

  .business-detail__back {
    margin-left: 2px;
  }

  .business-detail__toolbar {
    align-items: flex-start;
    flex-direction: column;
  }

  .business-detail__workspace {
    grid-template-columns: minmax(0, 1fr);
    gap: 14px;
    margin-top: 14px;
  }

  .business-detail__aside {
    position: static;
  }

  .business-detail__sections {
    gap: 14px;
  }
}
</style>
