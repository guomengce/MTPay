<template>
  <section class="detail-timeline">
    <header class="detail-timeline__header">
      <span class="detail-timeline__icon">
        <el-icon><DataLine /></el-icon>
      </span>
      <strong>{{ title }}</strong>
    </header>

    <el-timeline class="detail-timeline__list">
      <el-timeline-item
        v-for="(step, index) in steps"
        :key="index"
        :type="timelineType(step.status)"
        :hollow="step.status === 'active'"
        :timestamp="step.at"
        placement="top"
        size="large"
        class="detail-timeline__item"
        :class="`is-${step.status}`"
      >
        <div class="detail-timeline__content">
          <strong>{{ step.title }}</strong>
          <p v-if="step.description">{{ step.description }}</p>
        </div>
      </el-timeline-item>
    </el-timeline>
  </section>
</template>

<script setup lang="ts">
import { DataLine } from '@element-plus/icons-vue';

export interface TimelineStep {
  title: string;
  description?: string;
  at?: string;
  status: 'done' | 'active' | 'pending';
}

defineProps<{
  title: string;
  steps: TimelineStep[];
}>();

function timelineType(status: TimelineStep['status']) {
  if (status === 'done') return 'success';
  if (status === 'active') return 'primary';
  return undefined;
}
</script>

<style scoped lang="scss">
.detail-timeline {
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

  &__list {
    padding: 6px 0 0;
  }

  &__item {
    :deep(.el-timeline-item__node) {
      background-color: #e6ecf2;
    }

    :deep(.el-timeline-item__node--primary) {
      background: linear-gradient(135deg, #2878ff, #10aaa4);
      box-shadow: 0 0 0 4px rgb(40 120 255 / 15%);
    }

    :deep(.el-timeline-item__node--success) {
      background: linear-gradient(135deg, #10aaa4, #2dd4bf);
    }

    :deep(.el-timeline-item__wrapper) {
      padding-bottom: 16px;
    }

    :deep(.el-timeline-item__timestamp) {
      color: #7387a2;
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 4px;
    }

    :deep(.el-timeline-item__content) {
      color: #0c2a5a;
    }
  }

  &__content {
    display: grid;
    gap: 4px;

    strong {
      color: #0c2a5a;
      font-size: 14px;
      font-weight: 700;
    }

    p {
      margin: 0;
      color: #7387a2;
      font-size: 12px;
      font-weight: 600;
      line-height: 1.6;
    }
  }

  &__item.is-active :deep(.el-timeline-item__content) strong {
    color: #2878ff;
  }
}

.detail-timeline :deep(.el-timeline-item__line) {
  background: linear-gradient(180deg, #cfdcec, #e6ecf2);
}
</style>
