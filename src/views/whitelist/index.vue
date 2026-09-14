<template>
  <section class="whitelist-page">
    <AdminHero
      :title="t('whitelist.title')"
      icon="ri-user-follow-line"
    >
      <template #extra>
        <div class="whitelist-page__hero-actions">
          <WhitelistFilters
            v-model:role="role"
            v-model:entity-type="entityType"
            v-model:status="status"
            :loading="listLoading"
            @change="applyFilters"
          />
          <el-button :icon="Plus" type="primary" @click="submitDialogVisible = true">
            {{ t('whitelist.add') }}
          </el-button>
        </div>
      </template>
    </AdminHero>

    <ResultPanel
      :list="list"
      :total="total"
      :page="page"
      :limit="limit"
      :loading="listLoading || actionSubmitting"
      @view="openDetail"
      @supplement="openSupplement"
      @edit="openEdit"
      @toggle-status="toggleWhitelistStatus"
      @delete="deleteWhitelistItem"
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

    <SubmitDialog
      v-model="editDialogVisible"
      mode="edit"
      :initial-detail="editDetail"
      :submitting="actionSubmitting"
      :uploading="submitUploading"
      :upload-file="uploadFile"
      @submit="handleEdit"
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
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

import type { EditWhitelistPayload, SubmitWhitelistPayload, WhitelistItem, WhitelistItemDetail } from '@/api/modules/whitelist';
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
  status,
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
  actionSubmitting,
  editWhitelist,
  deleteWhitelist,
  updateWhitelistStatus,
} = useWhitelistManagement();

const router = useRouter();
const route = useRoute();
const submitDialogVisible = ref(false);
const editDialogVisible = ref(false);
const editItem = ref<WhitelistItem | null>(null);
const editDetail = ref<WhitelistItemDetail | null>(null);
const supplementDialogVisible = ref(false);
const supplementItem = ref<WhitelistItem | null>(null);
const { t } = useI18n();

async function handleSubmit(payload: { business: SubmitWhitelistPayload }) {
  try {
    const detail = await submitWhitelist(payload.business);
    ElMessage.success(t('whitelist.submitted', { number: detail.whitelist_no }));
    submitDialogVisible.value = false;
    await refreshList();
  } catch {
    /* 统一请求层已提示后端错误 */
  }
}

async function handleEdit(payload: { business: SubmitWhitelistPayload | Omit<EditWhitelistPayload, 'id'> }) {
  if (!editItem.value) return;
  try {
    await editWhitelist(editItem.value.id, payload.business as Omit<EditWhitelistPayload, 'id'>);
    ElMessage.success(t('whitelist.editSuccess'));
    editDialogVisible.value = false;
    editItem.value = null;
    editDetail.value = null;
    await refreshList();
  } catch {
    /* 统一请求层已提示后端错误 */
  }
}

function openDetail(item: WhitelistItem) {
  void router.push({ name: 'WhitelistDetail', params: { id: item.id } });
}

async function openEdit(item: WhitelistItem) {
  try {
    editItem.value = item;
    editDetail.value = await fetchDetail(item.id);
    editDialogVisible.value = true;
  } catch {
    editItem.value = null;
    editDetail.value = null;
  }
}

async function toggleWhitelistStatus(item: WhitelistItem) {
  if (actionSubmitting.value || (item.status !== 2 && item.status !== 4)) return;
  const nextStatus = item.status === 4 ? 2 : 4;
  try {
    await ElMessageBox.confirm(
      t(nextStatus === 4 ? 'whitelist.disableConfirm' : 'whitelist.enableConfirm'),
      t(nextStatus === 4 ? 'whitelist.disable' : 'whitelist.enable'),
      { type: nextStatus === 4 ? 'warning' : 'info' },
    );
    await updateWhitelistStatus(item.id, nextStatus);
    ElMessage.success(t(nextStatus === 4 ? 'whitelist.disableSuccess' : 'whitelist.enableSuccess'));
    await refreshList();
  } catch {
    /* 用户取消或统一请求层已提示后端错误 */
  }
}

async function deleteWhitelistItem(item: WhitelistItem) {
  try {
    await ElMessageBox.confirm(t('whitelist.deleteConfirm'), t('whitelist.delete'), { type: 'warning' });
    await deleteWhitelist(item.id);
    ElMessage.success(t('whitelist.deleteSuccess'));
    await refreshList();
  } catch {
    /* 用户取消或统一请求层已提示后端错误 */
  }
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
    ElMessage.success(t('whitelist.supplemented'));
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
  if (route.query.action === 'create') {
    submitDialogVisible.value = true;
    void router.replace({ name: 'Whitelist' });
  }
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
