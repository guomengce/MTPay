<template>
  <section class="detail-chain">
    <header class="detail-chain__header">
      <span class="detail-chain__icon">
        <el-icon><Link /></el-icon>
      </span>
      <strong>{{ title }}</strong>
    </header>

    <ul class="detail-chain__list">
      <li v-for="item in items" :key="item.label">
        <span class="detail-chain__label">{{ item.label }}</span>
        <div class="detail-chain__value">
          <span class="detail-chain__hash">{{ item.value }}</span>
          <div class="detail-chain__actions">
            <el-button
              type="primary"
              plain
              size="small"
              :icon="Position"
              @click="handleExplore(item)"
            >
              区块浏览器
            </el-button>
            <el-button
              type="primary"
              plain
              size="small"
              :icon="DocumentCopy"
              :aria-label="`复制 ${item.label}`"
              circle
              @click="handleCopy(item)"
            />
          </div>
        </div>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { DocumentCopy, Link, Position } from '@element-plus/icons-vue';

defineProps<{
  title: string;
  items: { label: string; value: string; href?: string }[];
}>();

const emit = defineEmits<{
  (e: 'copy', item: { label: string; value: string; href?: string }): void;
  (e: 'explore', item: { label: string; value: string; href?: string }): void;
}>();

function handleCopy(item: { label: string; value: string; href?: string }) {
  emit('copy', item);
}

function handleExplore(item: { label: string; value: string; href?: string }) {
  emit('explore', item);
}
</script>

<style scoped lang="scss">
.detail-chain {
  padding: 20px 24px;
  background: #ffffff;
  border: 1px solid #dfe7ef;
  border-radius: 14px;
  box-shadow: 0 8px 22px rgb(16 30 54 / 5%);

  &__header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
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

  &__list {
    margin: 0;
    padding: 0;
    list-style: none;

    li {
      display: grid;
      grid-template-columns: 90px 1fr;
      gap: 12px;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px dashed #e6ecf2;

      &:last-child {
        border-bottom: 0;
      }
    }
  }

  &__label {
    color: #7387a2;
    font-size: 13px;
    font-weight: 600;
  }

  &__value {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
  }

  &__hash {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    color: #0c2a5a;
    font-family: 'Courier New', monospace;
    font-size: 13px;
    font-weight: 700;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 0 0 auto;
  }

  @include mobile {
    padding: 18px 20px;

    &__list li {
      grid-template-columns: 1fr;
      gap: 6px;
    }
  }
}
</style>
