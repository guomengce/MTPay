<template>
  <main v-loading="loading" class="wl-redesign">
    <button
      class="app-back-button wl-back"
      type="button"
      @click="router.push({ name: 'Whitelist' })"
    >
      <i class="ri-arrow-left-line" />{{ t('whitelist.back') }}</button
    ><template v-if="detail"
      ><WhitelistOverview :detail="detail" @supplement="dialogVisible = true" /><SubjectInfo
        :detail="detail" /></template
    ><el-empty
      v-else-if="!loading"
      :description="t('whitelist.notFound')"
    /><WhitelistSupplementDialog
      :key="String(route.params.id)"
      v-model="dialogVisible"
      :detail="detail"
      @submitted="onSubmitted"
    />
  </main>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import type { WhitelistItemDetail } from '@/api/modules/whitelist';
import { useWhitelistDetail } from '../composables/useWhitelistDetail';
import WhitelistOverview from './components/WhitelistOverview.vue';
import SubjectInfo from './components/SubjectInfo.vue';
import WhitelistSupplementDialog from './components/WhitelistSupplementDialog.vue';
const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const { detail, loading, fetchDetail, clear } = useWhitelistDetail();
const dialogVisible = ref(false);
function onSubmitted(result: WhitelistItemDetail) {
  if (result.id === Number(route.params.id)) detail.value = result;
}
watch(
  () => route.params.id,
  async (value) => {
    dialogVisible.value = false;
    clear();
    const id = Number(value);
    if (!Number.isInteger(id) || id <= 0) return;
    try {
      await fetchDetail(id);
    } catch {
      /* 请求层显示错误，页面保留空态。 */
    }
  },
  { immediate: true },
);
</script>
<style lang="scss" src="./whitelist-detail.scss"></style>
