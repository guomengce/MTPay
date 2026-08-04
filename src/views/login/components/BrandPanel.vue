<template>
  <section class="brand-panel">
    <div class="brand-panel__brand">
      <span class="brand-panel__logo">M</span>
      <strong>MTPay Admin</strong>
    </div>

    <div class="brand-panel__content">
      <p class="brand-panel__eyebrow">OPERATIONS & REVIEW CONSOLE</p>
      <h1>集中管理代理與每一筆資金流程。</h1>
      <p class="brand-panel__desc">
        建立代理帳戶、設定專屬兌換比例，並一次審核白名單、兌換及USD出金。
      </p>
      <div class="brand-panel__tags">
        <el-tag effect="plain" round>代理帳戶</el-tag>
        <el-tag effect="plain" round>比例與費用</el-tag>
        <el-tag effect="plain" round>單次審核</el-tag>
        <el-tag effect="plain" round>完整時間線</el-tag>
      </div>
    </div>

    <p class="brand-panel__footer">MTPay 管理後台 · 互動原型</p>
  </section>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.brand-panel {
  position: relative;
  display: flex;
  min-width: 0;
  flex-direction: column;
  justify-content: space-between;
  padding: 56px 64px;
  overflow: hidden;
  color: #ffffff;
  background:
    radial-gradient(circle at 68% 9%, rgb(28 91 128 / 38%), transparent 28%),
    linear-gradient(118deg, #141d42 0%, #101737 55%, #12243a 100%);

  &::after {
    position: absolute;
    inset: 0;
    pointer-events: none;
    content: '';
    background-image:
      linear-gradient(rgb(255 255 255 / 4%) 1px, transparent 1px),
      linear-gradient(90deg, rgb(255 255 255 / 3%) 1px, transparent 1px);
    background-size: 42px 42px;
    mask-image: linear-gradient(110deg, rgb(0 0 0 / 60%), transparent 72%);
  }

  &__brand,
  &__content,
  &__footer {
    position: relative;
    z-index: 1;
  }

  &__brand {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 24px;
  }

  &__logo {
    display: inline-flex;
    width: 42px;
    height: 42px;
    align-items: center;
    justify-content: center;
    border-radius: 11px;
    color: #00152d;
    background: linear-gradient(135deg, #24d6c1, #13aab7);
    font-weight: 800;
  }

  &__content {
    max-width: 620px;
  }

  &__eyebrow {
    margin: 0 0 20px;
    color: #22ead7;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 4px;
  }

  h1 {
    margin: 0;
    font-size: clamp(42px, 5vw, 64px);
    font-weight: 850;
    line-height: 1.18;
    letter-spacing: 0;
  }

  &__desc {
    margin: 22px 0 24px;
    color: #d7e5ff;
    font-size: 16px;
    line-height: 1.8;
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;

    :deep(.el-tag) {
      height: 34px;
      padding: 0 14px;
      color: #e7f3ff;
      background: rgb(255 255 255 / 4%);
      border-color: rgb(132 166 224 / 45%);
      font-weight: 600;
    }
  }

  &__footer {
    margin: 0;
    color: #8da5d7;
    font-size: 13px;
  }

  @include narrow {
    padding: 48px 44px;
  }

  @include mobile {
    min-height: 430px;
    padding: 32px 24px;

    h1 {
      font-size: 38px;
    }
  }
}
</style>
