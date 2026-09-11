<template>
  <article class="entry-card">
    <header class="entry-card__header">
      <span class="entry-card__avatar">{{ avatarText }}</span>
      <div class="entry-card__heading">
        <h3>{{ item.subject_name }}</h3>
        <div class="entry-card__meta">
          <span class="entry-card__country">{{ countryName }}</span>
          <IdentityBadge :role="item.role" :entity-type="item.entity_type" />
        </div>
      </div>
    </header>

    <div class="entry-card__divider" aria-hidden="true" />

    <dl class="entry-card__info">
      <div v-for="row in infoRows" :key="row.label">
        <span class="entry-card__info-icon">
          <el-icon><component :is="row.icon" /></el-icon>
        </span>
        <dt>{{ row.label }}</dt>
        <dd :class="{ 'is-code': row.code }" :title="row.value">{{ row.value }}</dd>
      </div>
    </dl>

    <footer class="entry-card__footer">
      <StatusBadge :label="statusLabel" :type="statusMeta.type" :effect="statusMeta.effect" />
      <div class="entry-card__actions">
        <el-button
          v-if="item.status === 1"
          size="small"
          type="warning"
          plain
          :icon="Upload"
          @click="emit('supplement', item)"
        >
          {{ t('whitelist.supplement') }}
        </el-button>
        <el-button size="small" type="primary" plain :icon="ArrowRight" @click="emit('view', item)">
          {{ t('common.actions.details') }}
        </el-button>
      </div>
    </footer>
  </article>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue';
import { useI18n } from 'vue-i18n';
import { ArrowRight, Calendar, Document, Files, Upload } from '@element-plus/icons-vue';

import StatusBadge from '@/components/admin/StatusBadge.vue';
import IdentityBadge from '@/components/admin/IdentityBadge.vue';
import { getCountryLabel } from '@/constants/countries';

import type { WhitelistItem } from '@/api/modules/whitelist';
import { WHITELIST_STATUS_MAP, type WhitelistStatus } from '../composables/useWhitelistList';

const props = defineProps<{ item: WhitelistItem }>();
const { t, locale } = useI18n();
const emit = defineEmits<{
  (event: 'view', item: WhitelistItem): void;
  (event: 'supplement', item: WhitelistItem): void;
}>();

const statusMeta = computed(() => WHITELIST_STATUS_MAP[props.item.status as WhitelistStatus]);
const statusLabel = computed(() => [t('whitelistStatus.pending'), t('whitelistStatus.filesRequired'), t('whitelistStatus.approved'), t('whitelistStatus.rejected')][props.item.status] || props.item.status_name);
const countryName = computed(() => getCountryLabel(props.item.country, locale.value));

interface InfoRow {
  label: string;
  value: string;
  icon: Component;
  code?: boolean;
}

/** 卡片只展示识别与追踪所需信息，完整业务资料统一进入详情页查看。 */
const infoRows = computed<InfoRow[]>(() => [
  { label: t('whitelist.number'), value: props.item.whitelist_no, icon: Document, code: true },
  { label: t('whitelist.fileCount'), value: `${props.item.file_count} ${t('whitelist.filesUnit')}`, icon: Files },
  { label: t('whitelist.submittedAt'), value: props.item.submitted_at || '—', icon: Calendar },
]);

const avatarText = computed(() => {
  const name = props.item.subject_name?.trim() ?? '';
  return name ? name.charAt(0).toUpperCase() : '·';
});
</script>

<style scoped lang="scss">
.entry-card {
  display: flex;
  min-width: 0;
  flex-direction: column;
  padding: 22px 24px;
  border: 1px solid #dfe8ef;
  border-radius: 15px;
  background: #fff;
  box-shadow: 0 12px 32px rgb(16 39 68 / 6%);
  transition:
    transform 0.18s ease,
    border-color 0.18s ease,
    box-shadow 0.18s ease;

  &:hover {
    border-color: #bcdedc;
    box-shadow: 0 18px 42px rgb(16 39 68 / 10%);
    transform: translateY(-2px);
  }

  &__header {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: 14px;
  }

  &__avatar {
    display: inline-flex;
    width: 48px;
    height: 48px;
    align-items: center;
    justify-content: center;
    border-radius: 13px;
    color: #176fcb;
    background: linear-gradient(135deg, #e7f4ff, #e8f8f5);
    font-size: 18px;
    font-weight: 750;
  }

  &__heading {
    min-width: 0;
    flex: 1;

    h3 {
      margin: 0;
      overflow: hidden;
      color: #102a49;
      font-size: 17px;
      font-weight: 700;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .entry-card__meta {
      display: flex;
      min-width: 0;
      align-items: center;
      flex-wrap: wrap;
      gap: 6px;
      margin: 5px 0 0;

      :deep(.status-badge) {
        height: 24px;
        padding: 0 9px;
        font-size: 11px;
        font-weight: 700 !important;
      }

      .entry-card__country {
        color: #718298;
        font-size: 12px;
      }
    }
  }

  &__divider {
    height: 1px;
    margin: 18px 0 12px;
    background: linear-gradient(90deg, transparent, #dce6ee 8%, #dce6ee 92%, transparent);
  }

  &__info {
    display: grid;
    margin: 0;
    gap: 9px;
  }

  &__info > div {
    display: grid;
    min-width: 0;
    align-items: center;
    grid-template-columns: 30px 86px minmax(0, 1fr);
    gap: 10px;
  }

  &__info-icon {
    display: inline-flex;
    width: 30px;
    height: 30px;
    align-items: center;
    justify-content: center;
    border-radius: 9px;
    color: #2878d7;
    background: #edf5ff;
    font-size: 14px;
  }

  dt {
    color: #6f8095;
    font-size: 12px;
  }

  dd {
    min-width: 0;
    margin: 0;
    padding: 7px 10px;
    overflow: hidden;
    border-radius: 8px;
    color: #163150;
    background: #eef3f8;
    font-size: 12px;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;

    &.is-code {
      color: #087f7b;
      font-family: 'JetBrains Mono', Consolas, monospace;
    }
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: nowrap;
    gap: 8px;
    margin-top: 16px;
    padding-top: 14px;
    border-top: 1px solid #e8edf2;
  }

  &__actions {
    display: flex;
    flex: none;
    align-items: center;
    gap: 6px;

    :deep(.el-button) {
      padding-right: 9px;
      padding-left: 9px;
      font-size: 12px;
      font-weight: 700 !important;
    }

    :deep(.el-button + .el-button) {
      margin-left: 0;
    }
  }

  &__footer :deep(.status-badge) {
    min-height: 26px;
    padding: 0 9px;
    gap: 6px;
    font-size: 12px;
    font-weight: 700 !important;
  }

  @include mobile {
    padding: 18px;

    &__avatar {
      width: 44px;
      height: 44px;
    }

    &__info > div {
      grid-template-columns: 28px 76px minmax(0, 1fr);
      gap: 8px;
    }

    &__info-icon {
      width: 28px;
      height: 28px;
    }

    &__actions {
      justify-content: flex-end;
    }

    &__footer {
      align-items: flex-start;
      flex-wrap: wrap;
    }
  }
}
</style>
