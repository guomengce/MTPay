<template>
  <main class="whitelist-detail">
    <header class="whitelist-detail__topbar">
      <button class="whitelist-detail__back" type="button" @click="goBack">
        <i class="ri-arrow-left-line" />返回白名单列表
      </button>
      <StatusBadge
        v-if="detail"
        :label="detail.status_name"
        :type="statusMeta.type"
        :effect="statusMeta.effect"
      />
    </header>

    <div v-loading="loading" class="whitelist-detail__content">
      <template v-if="detail">
        <div class="whitelist-detail__grid">
          <div class="whitelist-detail__main">
            <SubjectInfo
              :role="detail.role"
              :entity-type="detail.entity_type"
              :role-name="detail.role_name"
              :entity-type-name="detail.entity_type_name"
              :company-identity-fields="companyIdentityFields"
              :registration-fields="registrationFields"
              :payer-individual-identity-fields="payerIndividualIdentityFields"
              :payer-individual-residence-fields="payerIndividualResidenceFields"
              :payee-company-fields="payeeCompanyFields"
              :payee-company-location-fields="payeeCompanyLocationFields"
              :payee-individual-identity-fields="payeeIndividualIdentityFields"
              :payee-individual-residence-fields="payeeIndividualResidenceFields"
              :payee-bank-fields="payeeBankFields"
            />
          </div>

          <aside class="whitelist-detail__aside">
            <DetailCard
              v-if="reviewItems.length || detail.status === 1"
              :title="detail.status === 3 ? '驳回信息' : '审核信息'"
              description="管理员对本次申请的处理结果"
              :icon="detail.status === 3 ? 'ri-close-circle-line' : 'ri-shield-check-line'"
            >
              <template v-if="detail.status === 1" #extra>
                <el-button size="small" type="warning" plain @click="supplementDialogVisible = true">
                  补充文件
                </el-button>
              </template>
              <DetailFieldGrid :items="reviewItems" />
            </DetailCard>

            <Timeline
              v-if="detail.records.length"
              :records="detail.records"
              :loading="fileLoading"
              @preview="openFilePreview"
              @download="downloadFile"
            />
          </aside>
        </div>
      </template>

      <el-empty v-else-if="!loading" description="未找到该白名单记录">
        <el-button type="primary" @click="goBack">返回白名单列表</el-button>
      </el-empty>
    </div>

    <SupplementDialog
      v-model="supplementDialogVisible"
      :item="detail"
      :supplement-requirement="detail?.review.note || undefined"
      :submitting="supplementSubmitting"
      :uploading="supplementUploading"
      :upload-file="uploadSupplementFile"
      @submit="handleSupplement"
    />
  </main>
</template>

<script setup lang="ts">
/** 代理端白名单详情：展示真实 business_data、审核信息、处理记录与补件入口。 */
import { computed, onMounted, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';

import StatusBadge from '@/components/admin/StatusBadge.vue';
import DetailCard from '@/components/detail/DetailCard.vue';
import DetailFieldGrid from '@/components/detail/DetailFieldGrid.vue';
import type { DetailFieldItem } from '@/components/detail/DetailFieldGrid.vue';
import SupplementDialog from '@/views/whitelist/components/SupplementDialog.vue';
import SubjectInfo from '@/views/whitelist/detail/components/SubjectInfo.vue';
import Timeline from '@/views/whitelist/detail/components/Timeline.vue';
import { useWhitelistDetail } from '@/views/whitelist/composables/useWhitelistDetail';
import { useWhitelistDetailView } from '@/views/whitelist/composables/useWhitelistDetailView';
import { useWhitelistPreview } from '@/views/whitelist/composables/useWhitelistPreview';
import { useWhitelistSupplement } from '@/views/whitelist/composables/useWhitelistSupplement';
import {
  WHITELIST_STATUS_MAP,
  type WhitelistStatus,
} from '@/views/whitelist/composables/useWhitelistList';

const route = useRoute();
const router = useRouter();
const id = computed(() => Number(route.params.id));
const { loading, detail, fetchDetail } = useWhitelistDetail();
const {
  companyIdentityFields,
  registrationFields,
  payerIndividualIdentityFields,
  payerIndividualResidenceFields,
  payeeCompanyFields,
  payeeCompanyLocationFields,
  payeeIndividualIdentityFields,
  payeeIndividualResidenceFields,
  payeeBankFields,
} = useWhitelistDetailView(detail);
const {
  submitting: supplementSubmitting,
  uploading: supplementUploading,
  submit: submitSupplement,
  uploadFile: uploadSupplementFile,
} = useWhitelistSupplement();
const {
  loading: fileLoading,
  openPreview: openFilePreview,
  triggerDownload: downloadFile,
} = useWhitelistPreview();

const supplementDialogVisible = ref(false);
const statusMeta = computed(
  () => WHITELIST_STATUS_MAP[(detail.value?.status ?? 0) as WhitelistStatus],
);

const reviewItems = computed<DetailFieldItem[]>(() => {
  if (!detail.value || detail.value.status === 0) return [];
  const review = detail.value.review;
  const items: DetailFieldItem[] = [];
  if (review.admin_name) items.push({ label: '处理人', value: review.admin_name });
  if (review.reviewed_at) items.push({ label: '处理时间', value: review.reviewed_at });
  if (review.note) {
    items.push({
      label:
        detail.value.status === 3
          ? '驳回原因'
          : detail.value.status === 1
            ? '补件要求'
            : '审核备注',
      value: review.note,
      wide: true,
    });
  }
  if (detail.value.status === 1 && !review.note) {
    items.push({ label: '补件要求', value: '平台要求补充证明文件', wide: true });
  }
  return items;
});

async function reload() {
  if (!Number.isInteger(id.value) || id.value <= 0) return;
  await fetchDetail(id.value);
}

function goBack() {
  void router.push({ name: 'Whitelist' });
}

async function handleSupplement(payload: { file_ids: number[]; message?: string }) {
  if (!detail.value) return;
  try {
    detail.value = await submitSupplement(detail.value.id, payload.file_ids, payload.message);
    supplementDialogVisible.value = false;
    ElMessage.success('补件已提交，白名单已重新进入审核');
  } catch {
    /* 请求层已显示后端错误 */
  }
}

onMounted(reload);
watch(id, reload);
</script>

<style scoped lang="scss">
.whitelist-detail {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 14px;
  padding: 20px;

  &__topbar {
    display: flex;
    min-height: 28px;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  &__back {
    display: inline-flex;
    width: fit-content;
    height: 36px;
    align-items: center;
    gap: 7px;
    padding: 0 14px;
    border: 1px solid #d6e1eb;
    border-radius: 10px;
    color: #38536f;
    background: #fff;
    box-shadow: 0 4px 12px rgb(31 66 102 / 5%);
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    transition:
      border-color 0.2s ease,
      color 0.2s ease,
      background-color 0.2s ease;

    &:hover {
      border-color: #9fd8d3;
      color: #078f89;
      background: #f2fbfa;
    }

    i { font-size: 16px; }
  }

  &__content,
  &__main,
  &__aside {
    display: grid;
    min-width: 0;
    gap: 18px;
  }

  &__content {
    min-height: 300px;
  }

  &__grid {
    display: grid;
    min-width: 0;
    align-items: start;
    grid-template-columns: minmax(0, 1.2fr) minmax(420px, 0.95fr);
    gap: 18px;
  }
}

.whitelist-detail__aside :deep(.detail-field-grid) {
  grid-template-columns: minmax(0, 1fr);
}

.whitelist-detail__aside :deep(.detail-field-grid__item),
.whitelist-detail__aside :deep(.detail-field-grid__item.is-wide) {
  grid-column: auto;
  grid-template-columns: minmax(84px, 0.42fr) minmax(0, 1fr);
}

@include narrow {
  .whitelist-detail {
    padding: 18px;

    &__grid {
      grid-template-columns: 1fr;
    }
  }
}

@include mobile {
  .whitelist-detail {
    gap: 12px;
    padding: 12px;
  }

  .whitelist-detail__topbar {
    align-items: flex-start;
    flex-direction: column;
  }

  .whitelist-detail__back { width: fit-content; }

  .whitelist-detail__grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 14px;
  }

  .whitelist-detail__aside {
    gap: 14px;
  }

}
</style>
