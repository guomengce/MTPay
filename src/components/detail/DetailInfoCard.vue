<template>
  <section class="detail-info">
    <header class="detail-info__header">
      <span class="detail-info__icon">
        <el-icon><Document /></el-icon>
      </span>
      <strong>{{ title }}</strong>
    </header>

    <dl class="detail-info__grid">
      <div v-for="item in items" :key="item.label" class="detail-info__row">
        <dt>{{ item.label }}</dt>
        <dd>{{ item.value }}</dd>
      </div>
    </dl>
  </section>
</template>

<script setup lang="ts">
import { Document } from '@element-plus/icons-vue';

defineProps<{
  title: string;
  items: { label: string; value: string }[];
}>();
</script>

<style scoped lang="scss">
.detail-info {
  padding: 20px 24px;
  background: #ffffff;
  border: 1px solid #dfe7ef;
  border-radius: 14px;
  box-shadow: 0 8px 22px rgb(16 30 54 / 5%);

  &__header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 18px;
    color: #0c2a5a;
    font-size: 16px;
    font-weight: 800;
  }

  &__icon {
    display: inline-flex;
    width: 32px;
    height: 32px;
    flex: 0 0 32px;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    background: linear-gradient(135deg, #e8f6ff 0%, #d5ecff 100%);
    color: #2878ff;
    font-size: 16px;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px 32px;
    margin: 0;
  }

  &__row {
    display: grid;
    grid-template-columns: 90px 1fr;
    align-items: center;
    gap: 12px;
    padding: 6px 0;
    border-bottom: 1px dashed #e6ecf2;

    &:last-child {
      border-bottom: 0;
    }

    dt {
      color: #7387a2;
      font-size: 13px;
      font-weight: 600;
    }

    dd {
      margin: 0;
      color: #0c2a5a;
      font-size: 14px;
      font-weight: 700;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  @include mobile {
    padding: 18px 20px;

    &__grid {
      grid-template-columns: 1fr;
      gap: 8px;
    }

    &__row {
      grid-template-columns: 80px 1fr;
    }
  }
}
</style>
