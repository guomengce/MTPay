<template>
  <el-card class="btn-showcase" shadow="never">
    <template #header>
      <div class="btn-showcase__header">
        <h2>Button 按钮系统</h2>
        <span>5 种语义类型 × 3 种变体（solid / plain / text） × 3 种尺寸</span>
      </div>
    </template>

    <!-- Solid 实色 -->
    <section class="btn-showcase__group">
      <h3>Solid · 实色渐变</h3>
      <p class="btn-showcase__hint">主操作按钮，承载页面关键行为</p>
      <div class="btn-showcase__row">
        <el-button type="primary" size="large">Primary</el-button>
        <el-button type="success" size="large">Success</el-button>
        <el-button type="danger" size="large">Danger</el-button>
        <el-button type="warning" size="large">Warning</el-button>
        <el-button type="info" size="large">Info</el-button>
      </div>
      <div class="btn-showcase__row">
        <el-button type="primary">Primary</el-button>
        <el-button type="success">Success</el-button>
        <el-button type="danger">Danger</el-button>
        <el-button type="warning">Warning</el-button>
        <el-button type="info">Info</el-button>
      </div>
      <div class="btn-showcase__row">
        <el-button type="primary" size="small">Primary</el-button>
        <el-button type="success" size="small">Success</el-button>
        <el-button type="danger" size="small">Danger</el-button>
        <el-button type="warning" size="small">Warning</el-button>
        <el-button type="info" size="small">Info</el-button>
      </div>
    </section>

    <!-- Plain 浅色 -->
    <section class="btn-showcase__group">
      <h3>Plain · 浅色描边</h3>
      <p class="btn-showcase__hint">次要操作，弱化视觉重量，不抢主按钮</p>
      <div class="btn-showcase__row">
        <el-button type="primary" plain size="large">Primary</el-button>
        <el-button type="success" plain size="large">Success</el-button>
        <el-button type="danger" plain size="large">Danger</el-button>
        <el-button type="warning" plain size="large">Warning</el-button>
        <el-button type="info" plain size="large">Info</el-button>
      </div>
      <div class="btn-showcase__row">
        <el-button type="primary" plain>Primary</el-button>
        <el-button type="success" plain>Success</el-button>
        <el-button type="danger" plain>Danger</el-button>
        <el-button type="warning" plain>Warning</el-button>
        <el-button type="info" plain>Info</el-button>
      </div>
      <div class="btn-showcase__row">
        <el-button type="primary" plain size="small">Primary</el-button>
        <el-button type="success" plain size="small">Success</el-button>
        <el-button type="danger" plain size="small">Danger</el-button>
        <el-button type="warning" plain size="small">Warning</el-button>
        <el-button type="info" plain size="small">Info</el-button>
      </div>
    </section>

    <!-- Default 无 type -->
    <section class="btn-showcase__group">
      <h3>Default · 默认按钮</h3>
      <p class="btn-showcase__hint">白底浅边，hover 时切换为 primary 彩色边</p>
      <div class="btn-showcase__row">
        <el-button size="large">Default</el-button>
        <el-button>Default</el-button>
        <el-button size="small">Default</el-button>
        <el-button disabled>Disabled</el-button>
      </div>
    </section>

    <!-- Text / Link 文字按钮 -->
    <section class="btn-showcase__group">
      <h3>Text / Link · 文字按钮</h3>
      <p class="btn-showcase__hint">最小重量，用于行内操作或次要链接</p>
      <div class="btn-showcase__row">
        <el-button type="primary" text>Text Primary</el-button>
        <el-button type="success" text>Text Success</el-button>
        <el-button type="danger" text>Text Danger</el-button>
        <el-button type="warning" text>Text Warning</el-button>
        <el-button type="info" text>Text Info</el-button>
      </div>
      <div class="btn-showcase__row">
        <el-button type="primary" link>Link Primary</el-button>
        <el-button type="success" link>Link Success</el-button>
        <el-button type="danger" link>Link Danger</el-button>
        <el-button type="warning" link>Link Warning</el-button>
        <el-button type="info" link>Link Info</el-button>
      </div>
    </section>

    <!-- Icon + 文字 -->
    <section class="btn-showcase__group">
      <h3>Icon · 图标按钮</h3>
      <p class="btn-showcase__hint">带前置图标的操作按钮</p>
      <div class="btn-showcase__row">
        <el-button type="primary" :icon="Edit">编辑</el-button>
        <el-button type="success" :icon="Check">确认</el-button>
        <el-button type="danger" :icon="Delete">删除</el-button>
        <el-button type="warning" :icon="Warning">警告</el-button>
        <el-button type="info" :icon="InfoFilled">详情</el-button>
      </div>
    </section>
  </el-card>
</template>

<script setup lang="ts">
import {
  Check,
  Delete,
  Edit,
  InfoFilled,
  Warning,
} from '@element-plus/icons-vue';
</script>

<style scoped lang="scss">
.btn-showcase {
  min-width: 0;
  border-color: #dfe7ef;
  border-radius: 14px;
  box-shadow: 0 18px 48px rgb(16 30 54 / 8%);

  :deep(.el-card__header) {
    padding: 20px 24px;
  }

  :deep(.el-card__body) {
    padding: 22px 24px 26px;
  }

  &__header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 16px;

    h2 {
      margin: 0;
      color: #071833;
      font-size: 20px;
      font-weight: 850;
    }

    span {
      color: #6b7a90;
      font-size: 13px;
      font-weight: 600;
    }
  }

  &__group {
    padding: 18px 0;
    border-bottom: 1px dashed #e6ecf2;

    &:last-child {
      border-bottom: 0;
    }

    h3 {
      margin: 0 0 4px;
      color: #0c2a5a;
      font-size: 15px;
      font-weight: 800;
    }
  }

  &__hint {
    margin: 0 0 14px;
    color: #7387a2;
    font-size: 12px;
    font-weight: 600;
  }

  &__row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
    min-width: 0;
    padding: 8px 0;
  }
}
</style>
