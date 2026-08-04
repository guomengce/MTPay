<template>
  <el-alert
    class="whitelist-notice"
    title="白名单非入账必要条件；出金只能选择已核准且真实可执行付款或收款的主体。"
    type="info"
    :closable="true"
    show-icon
  />
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.whitelist-notice {
  min-height: 52px;
  border-color: #cfe2ff;
  border-radius: 8px;

  :deep(.el-alert__title) {
    color: #2264bd;
    font-size: 14px;
    font-weight: 750;
  }

  :deep(.el-alert__icon) {
    font-size: 18px;
  }
}
</style>
