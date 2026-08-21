<template>
  <span class="flow-arrow" aria-hidden="true">
    <el-icon><Right /></el-icon>
  </span>
</template>

<script setup lang="ts">
import { Right } from '@element-plus/icons-vue';
</script>

<style scoped lang="scss">
.flow-arrow {
  display: inline-flex;
  width: 32px;
  height: 32px;
  flex: 0 0 32px;
  align-items: center;
  justify-content: center;
  border: 1px solid #bfe0dd;
  border-radius: 50%;
  color: #58aaa4;
  background: #f7fcfb;
  font-size: 14px;
}
</style>
