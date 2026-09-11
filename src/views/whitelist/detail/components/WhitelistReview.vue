<template>
  <div
    v-if="hasReview"
    class="wl-review"
    :class="{
      'wl-review--action': canSupplement,
      'wl-review--rejected': detail.status === 3,
    }"
  >
    <div class="wl-review__content">
      <div class="wl-review__heading">
        <span class="wl-section-icon"
          ><i
            :class="
              canSupplement
                ? 'ri-file-warning-line'
                : detail.status === 3
                  ? 'ri-close-circle-line'
                  : 'ri-shield-check-line'
            "
        /></span>
        <h2>
          {{
            canSupplement
              ? t('whitelistReview.adminSupplementRequirement')
              : detail.status === 3
                ? t('whitelistReview.rejectionInfo')
                : t('whitelistReview.reviewInfo')
          }}
        </h2>
      </div>
      <p v-if="detail.supplement_request || canSupplement" class="wl-review__message">
        {{ detail.supplement_request || t('whitelistReview.defaultSupplementRequirement') }}
      </p>
      <p v-if="detail.review.note" class="wl-review__message">
        <span>{{
          detail.status === 3
            ? t('whitelistReview.rejectionReason')
            : t('whitelistReview.reviewNote')
        }}</span
        >{{ detail.review.note }}
      </p>
      <div v-if="detail.review.admin_name || detail.review.reviewed_at" class="wl-review__meta">
        <span v-if="detail.review.admin_name"
          >{{ t('whitelistReview.handler') }}<strong>{{ detail.review.admin_name }}</strong></span
        >
        <span v-if="detail.review.reviewed_at"
          >{{ t('whitelistReview.handledAt')
          }}<strong>{{ detail.review.reviewed_at }}</strong></span
        >
      </div>
    </div>
    <el-button
      v-if="canSupplement"
      type="warning"
      class="wl-supplement-button"
      :icon="Upload"
      @click="emit('supplement')"
      >{{ t('whitelist.supplement') }}</el-button
    >
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { Upload } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';
import type { WhitelistItemDetail } from '@/api/modules/whitelist';
const props = defineProps<{ detail: WhitelistItemDetail }>();
const { t } = useI18n();
const emit = defineEmits<{ supplement: [] }>();
const canSupplement = computed(
  () => props.detail?.available_actions?.can_supplement_whitelist === true,
);
const hasReview = computed(() =>
  Boolean(
    canSupplement.value ||
    props.detail?.supplement_request ||
    props.detail?.review.note ||
    props.detail?.review.admin_name ||
    props.detail?.review.reviewed_at,
  ),
);
</script>
