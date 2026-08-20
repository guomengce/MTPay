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

    <div v-loading="loading" class="business-detail__content">
      <template v-if="detail">
        <DetailOrderHero
          eyebrow="出金订单"
          :order-no="detail.order_no"
          :status="detail.status_name"
          :status-type="statusType"
          :status-effect="detail.status === 0 ? 'pending' : undefined"
        >
          <WithdrawalDetailAmount :detail="detail" />

          <template #meta>
            <div class="detail-meta-item">
              <i class="ri-calendar-event-line" />
              <span><small>提交时间</small><strong>{{ detail.submitted_at || '—' }}</strong></span>
            </div>
            <div class="detail-meta-item">
              <i class="ri-refresh-line" />
              <span><small>最后更新</small><strong>{{ detail.updated_at || '—' }}</strong></span>
            </div>
          </template>
        </DetailOrderHero>

        <div class="business-detail__workspace">
          <main class="business-detail__main">
            <div class="business-detail__sections">
              <WithdrawalFundStatusCard :detail="detail" />
              <WithdrawalPartyCard :detail="detail" />

              <WithdrawalFilesCard
                title="申请文件"
                description="首次提交或补交时上传的证明文件"
                icon="ri-file-list-3-line"
                :files="detail.application_files"
                empty-text="未上传申请文件"
                @preview="openFilePreview"
                @download="downloadFile"
              />

              <WithdrawalFilesCard
                v-if="detail.payment_files.length"
                title="付款凭证"
                description="平台在付款完成时上传的凭证"
                icon="ri-receipt-line"
                :files="detail.payment_files"
                empty-text="暂无付款凭证"
                @preview="openFilePreview"
                @download="downloadFile"
              />

            </div>
          </main>

          <aside v-if="timelineItems.length" class="business-detail__aside">
            <WithdrawalTimelineCard :items="timelineItems" />
          </aside>
        </div>

        <WithdrawalSupplementDialog
          v-model="supplementDialogVisible"
          :row="detail"
          :requirement="supplementRequirement"
          :submitting="supplementSubmitting"
          :uploading="supplementUploading"
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

import type { StatusBadgeType } from '@/components/admin/StatusBadge.vue';
import DetailOrderHero from '@/components/detail/DetailOrderHero.vue';
import { useWithdrawalDetail } from '@/views/withdrawal/composables/useWithdrawalDetail';
import { useWithdrawalFiles } from '@/views/withdrawal/composables/useWithdrawalFiles';
import { useWithdrawalSupplement } from '@/views/withdrawal/composables/useWithdrawalSupplement';
import { WITHDRAWAL_STATUS_MAP } from '@/views/withdrawal/composables/useWithdrawalList';
import WithdrawalDetailAmount from '@/views/withdrawal/components/WithdrawalDetailAmount.vue';
import WithdrawalFilesCard from '@/views/withdrawal/components/WithdrawalFilesCard.vue';
import WithdrawalFundStatusCard from '@/views/withdrawal/components/WithdrawalFundStatusCard.vue';
import WithdrawalPartyCard from '@/views/withdrawal/components/WithdrawalPartyCard.vue';
import WithdrawalSupplementDialog from '@/views/withdrawal/components/WithdrawalSupplementDialog.vue';
import WithdrawalTimelineCard from '@/views/withdrawal/components/WithdrawalTimelineCard.vue';

const route = useRoute();
const router = useRouter();
const { loading, detail, fetchDetail } = useWithdrawalDetail();
const { openPreview, triggerDownload } = useWithdrawalFiles();
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
    const item = record as Record<string, unknown>;
    const text = String(item.action_name ?? item.name ?? item.event ?? '');
    return /要求|补充|补件|supplement/i.test(text);
  });
  return String(request?.message ?? '') || '请按平台要求补充证明材料。';
});

const statusType = computed<StatusBadgeType>(() => {
  const status = detail.value?.status;
  if (status === undefined) return 'warning';
  return WITHDRAWAL_STATUS_MAP[status as keyof typeof WITHDRAWAL_STATUS_MAP]?.type ?? 'gray';
});

const timelineItems = computed<{ event: string; name: string; time: string; description?: string }[]>(() =>
  (detail.value?.records ?? [])
    .map(
      (
        record,
      ): { event: string; name: string; time: string; description?: string } | null => {
      const item = record as Record<string, unknown>;
      const time = (item.time as string | undefined) || (item.created_at as string | undefined);
      if (!time) return null;
      return {
        event: String(item.event ?? item.action_type ?? ''),
        name: String(item.action_name ?? item.name ?? item.event ?? '订单处理'),
        time,
        description: (item.message as string | undefined) || undefined,
      };
      },
    )
    .filter(
      (
        item,
      ): item is {
        event: string;
        name: string;
        time: string;
        description?: string;
      } => item !== null,
    ),
);

function goBack() {
  void router.push('/withdrawal');
}

function openFilePreview(fileId: number) {
  void openPreview(fileId);
}

function downloadFile(fileId: number) {
  void triggerDownload(fileId);
}

async function handleSupplement(payload: { files: File[]; message?: string }) {
  if (!detail.value) return;
  try {
    const fileIds: number[] = [];
    for (const file of payload.files) {
      const uploaded = await uploadSupplementFile(file);
      fileIds.push(uploaded.file_id);
    }
    await submitSupplement({
      id: detail.value.id,
      file_ids: fileIds,
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
  gap: 16px;
  padding: 24px 32px 40px;

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
    padding: 0;
    border: 0;
    color: #5d7087;
    background: transparent;
    cursor: pointer;
    font: inherit;
    font-size: 13px;

    &:hover {
      color: #0b9b92;
    }
  }

  &__content {
    min-height: 300px;
  }

  &__workspace {
    display: grid;
    min-width: 0;
    align-items: start;
    grid-template-columns: minmax(0, 1.5fr) minmax(320px, 0.7fr);
    gap: 18px;
    margin-top: 18px;
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

.detail-meta-item {
  display: flex;
  align-items: center;
  gap: 9px;
}

.detail-meta-item > i {
  color: #138f9f;
  font-size: 18px;
}

.detail-meta-item > span {
  display: grid;
  gap: 3px;
}

.detail-meta-item small {
  color: #74869b;
  font-size: 12px;
}

.detail-meta-item strong {
  color: #2e425a;
  font-size: 13px;
  font-weight: 600;
}

@include narrow {
  .business-detail {
    padding: 18px 20px 32px;
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
    padding: 16px 0 28px;
  }

  .business-detail__back {
    margin-left: 2px;
  }

  .business-detail__toolbar {
    align-items: stretch;
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
