<template>
  <article class="party-card" :class="[tone, { 'is-english': locale === 'en-US' }]">
    <header v-if="showHeader">
      <div class="party-card__title">
        <i />
        <h3>{{ title }}</h3>
      </div>
      <div class="party-card__actions">
        <IdentityBadge v-if="role && entityType" :role="role" :entity-type="entityType" /><el-button
          v-if="showCopy"
          circle
          plain
          size="small"
          :icon="DocumentCopy"
          :aria-label="t('withdrawal.copyParty')"
          @click="copyAll"
        />
      </div>
    </header>
    <dl class="party-card__fields">
      <div v-for="field in fields" :key="field.key">
        <dt>{{ field.label }}</dt>
        <dd :class="{ 'is-mono': field.mono }">{{ field.value }}</dd>
      </div>
    </dl>
  </article>
</template>
<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { DocumentCopy } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';
import IdentityBadge from '@/components/admin/IdentityBadge.vue';
import type { PartyField } from '@/components/party-info/fields';
const props = withDefaults(defineProps<{
  title: string;
  fields: PartyField[];
  copyFields?: PartyField[];
  role?: 1 | 2;
  entityType?: 1 | 2;
  tone: 'is-payer' | 'is-payee' | 'is-bank';
  showCopy?: boolean;
  showHeader?: boolean;
}>(), { showCopy: true, showHeader: true });
const { t, locale } = useI18n();
async function copyAll() {
  const fields = props.copyFields ?? props.fields;
  const content = fields.map((item) => `${item.label}：${item.value}`).join('\n');
  try {
    await navigator.clipboard.writeText(content);
    ElMessage.success(t('withdrawal.partyCopied'));
  } catch {
    ElMessage.error(t('withdrawal.copyFailed'));
  }
}
</script>
<style scoped lang="scss">
.party-card {
  min-width: 0;
  overflow: hidden;
  border: 1px solid #dce7ef;
  border-radius: 14px;
  background: #fbfcfe;

  &.is-payee,
  &.is-bank {
    border-color: #dce6f3;
    background: #f8faff;

    > header {
      background: linear-gradient(90deg, #eef4fc, #fafcff);
    }

    .party-card__title i {
      background: #4b83d1;
      box-shadow: 0 0 0 4px rgb(75 131 209 / 10%);
    }
  }

  > header {
    display: flex;
    min-height: 46px;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 10px 14px;
    background: linear-gradient(90deg, #edf9f7, #f8fcfc);
  }

  &__title,
  &__actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__title i {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #0aa49a;
    box-shadow: 0 0 0 4px rgb(10 164 154 / 10%);
  }

  h3 {
    margin: 0;
    color: #17324f;
    font-size: 14px;
  }

  &__actions .el-button {
    margin-left: 0;
    color: #168f89;
  }

  &__fields {
    display: grid;
    margin: 0;
    padding: 10px 15px 14px;

    > div {
      display: grid;
      min-width: 0;
      padding: 6px 0;
      grid-template-columns: 120px minmax(0, 1fr);
      gap: 8px;
    }

    dt {
      color: #718399;
      font-size: 11px;
      line-height: 1.35;
      overflow-wrap: anywhere;
    }

    dd {
      margin: 0;
      color: #20364e;
      font-size: 13px;
      font-weight: 600;
      overflow-wrap: anywhere;
    }

    .is-mono {
      font-family: ui-monospace, Consolas, monospace;
    }
  }

  &.is-english &__fields > div {
    grid-template-columns: minmax(132px, 0.82fr) minmax(0, 1.18fr);
  }
}

@include mobile {
  .party-card__fields > div {
    grid-template-columns: 190px minmax(0, 1fr);
  }
}
</style>
