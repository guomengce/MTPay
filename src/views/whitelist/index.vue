<template>
  <section class="whitelist-page">
    <AdminHero
      title="白名单管理"
      description="提交付款人/收款人资料，审核通过后可用于出金；支持待补件时补充材料"
      icon="ri-user-follow-line"
    >
      <template #extra>
        <div class="whitelist-page__hero-actions">
          <WhitelistFilters
            v-model:role="role"
            v-model:entity-type="entityType"
            :loading="listLoading"
            @change="applyFilters"
          />
          <el-button :icon="Plus" type="primary" @click="submitDialogVisible = true">
            新增
          </el-button>
        </div>
      </template>
    </AdminHero>

    <ResultPanel
      :list="list"
      :total="total"
      :page="page"
      :limit="limit"
      :loading="listLoading"
      @view="openDetail"
      @supplement="openSupplement"
      @page="onPage"
      @limit="onLimit"
    />

    <SubmitDialog
      v-model="submitDialogVisible"
      :submitting="submitSubmitting"
      :uploading="submitUploading"
      :upload-file="uploadFile"
      @submit="handleSubmit"
    />

    <SupplementDialog
      v-model="supplementDialogVisible"
      :item="supplementItem"
      :supplement-requirement="detail?.review.note || undefined"
      :submitting="supplementSubmitting"
      :uploading="supplementUploading"
      :upload-file="uploadFile"
      @submit="handleSupplement"
    />
  </section>
</template>

<script setup lang="ts">
/**
 * 白名单页面
 * - 通过 useWhitelistManagement 串联列表 / 详情 / 提交 / 补件 / 附件；
 * - 提交/补件成功后由组合入口暴露的 refreshList / fetchDetail 刷新；
 * - 不在组件内直接调用 request 或拼接 Authorization。
 */
import { onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';

import type { SubmitWhitelistPayload, WhitelistItem } from '@/api/modules/whitelist';
import AdminHero from '@/components/admin/AdminHero.vue';

import ResultPanel from './components/ResultPanel.vue';
import SubmitDialog from './components/SubmitDialog.vue';
import SupplementDialog from './components/SupplementDialog.vue';
import WhitelistFilters from './components/WhitelistFilters.vue';
import { useWhitelistManagement } from './composables/useWhitelistManagement';

const {
  list,
  total,
  page,
  limit,
  role,
  entityType,
  listLoading,
  fetchList,
  setPage,
  setLimit,
  applyFilters,
  refreshList,
  submitSubmitting,
  submitUploading,
  submitWhitelist,
  detail,
  fetchDetail,
  supplementSubmitting,
  supplementUploading,
  submitSupplement,
  uploadFile,
} = useWhitelistManagement();

const router = useRouter();
const submitDialogVisible = ref(false);
const supplementDialogVisible = ref(false);
const supplementItem = ref<WhitelistItem | null>(null);

async function handleSubmit(payload: { business: SubmitWhitelistPayload }) {
  try {
    const detail = await submitWhitelist(payload.business);
    ElMessage.success(`白名单 ${detail.whitelist_no} 已提交，等待审核`);
    submitDialogVisible.value = false;
    await refreshList();
  } catch {
    /* 统一请求层已提示后端错误 */
  }
}

function openDetail(item: WhitelistItem) {
  void router.push({ name: 'WhitelistDetail', params: { id: item.id } });
}

async function openSupplement(item: WhitelistItem) {
  if (item.status !== 1) return;
  supplementItem.value = item;
  supplementDialogVisible.value = true;
  try {
    await fetchDetail(item.id);
  } catch {
    /* 获取补件要求失败时仍允许用户上传文件，接口错误由请求层提示。 */
  }
}

async function handleSupplement(payload: { file_ids: number[]; message?: string }) {
  if (!supplementItem.value) return;
  try {
    await submitSupplement(supplementItem.value.id, payload.file_ids, payload.message);
    ElMessage.success('补件已提交，白名单已重新进入审核');
    supplementDialogVisible.value = false;
    supplementItem.value = null;
    await refreshList();
  } catch {
    /* 统一请求层已提示后端错误 */
  }
}

function onPage(value: number) {
  setPage(value);
  void fetchList();
}

function onLimit(value: number) {
  setLimit(value);
  void fetchList();
}

onMounted(() => {
  void fetchList();
});
</script>

<style scoped lang="scss">
.whitelist-page {
  display: grid;
  min-width: 0;
  gap: 22px;

  &__hero-actions {
    position: relative;
    z-index: 1;
    display: flex;
    flex: 0 1 auto;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;

    > .el-button {
      flex: none;
      margin-left: 0;
    }
  }

  @include mobile {
    gap: 16px;

    &__hero-actions {
      width: 100%;
      flex-wrap: wrap;

      > .el-button {
        margin-left: auto;
      }
    }
  }
}
</style>
