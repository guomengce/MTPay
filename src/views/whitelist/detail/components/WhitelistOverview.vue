<template>
  <section class="wl-overview">
    <header class="wl-heading">
      <div class="wl-heading__title">
        <div class="wl-title-line">
          <h1>{{ t('menu.whitelistDetail') }}</h1>
        </div>
        <p class="wl-number">{{ detail.whitelist_no }}</p>
      </div>
      <div class="wl-reference">
        <StatusBadge :label="statusLabel" :type="statusMeta.type" :effect="statusMeta.effect" />
        <span class="wl-label"
          >{{ t('whitelist.submittedAt') }} · {{ detail.submitted_at || '—' }}</span
        >
      </div>
    </header>

    <WhitelistReview :detail="detail" @supplement="emit('supplement')" />
  </section>
</template>
<script setup lang="ts">
import WhitelistReview from './WhitelistReview.vue';
import StatusBadge from '@/components/admin/StatusBadge.vue';
import { WHITELIST_STATUS_MAP } from '../../composables/useWhitelistList';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { WhitelistItemDetail } from '@/api/modules/whitelist';
const props = defineProps<{ detail: WhitelistItemDetail }>();
const { t } = useI18n();
const emit = defineEmits<{ supplement: [] }>();
const statusMeta = computed(() => WHITELIST_STATUS_MAP[props.detail.status] ?? WHITELIST_STATUS_MAP[0]);
const statusLabel = computed(() =>
  t(
    [
      'whitelistStatus.pending',
      'whitelistStatus.filesRequired',
      'whitelistStatus.approved',
      'whitelistStatus.rejected',
      'whitelistStatus.disabled',
    ][props.detail?.status ?? 0] || 'whitelistStatus.pending',
  ),
);
</script>


