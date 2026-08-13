<template>
  <el-card class="company-card" shadow="never">
    <template #header>
      <div class="company-card__header">
        <div class="company-card__title">
          <span>
            <el-icon><OfficeBuilding /></el-icon>
          </span>
          <h2>企业资料</h2>
        </div>
        <StatusBadge label="正常使用" type="success" />
      </div>
    </template>

    <div class="company-card__body">
      <section class="company-card__field is-wide">
        <label>企业名称</label>
        <div>
          <span
            ><el-icon><OfficeBuilding /></el-icon
          ></span>
          <strong>代理A · Apex Trading</strong>
        </div>
      </section>

      <section class="company-card__field">
        <label>Email</label>
        <div>
          <span
            ><el-icon><Message /></el-icon
          ></span>
          <strong>finance@apex.test</strong>
        </div>
      </section>

      <section class="company-card__field">
        <label>电话</label>
        <div>
          <span
            ><el-icon><Phone /></el-icon
          ></span>
          <strong>+65 6123 8801</strong>
        </div>
      </section>

      <section class="company-card__field is-wide">
        <label>代理编号</label>
        <div>
          <span
            ><el-icon><Postcard /></el-icon
          ></span>
          <strong>AG-A</strong>
        </div>
      </section>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { Message, OfficeBuilding, Phone, Postcard } from '@element-plus/icons-vue';

import StatusBadge from '@/components/admin/StatusBadge.vue';
</script>

<style scoped lang="scss">
.company-card {
  min-width: 0;
  overflow: hidden;
  border-color: #dfe7ef;
  border-radius: 14px;
  box-shadow: 0 18px 48px rgb(16 30 54 / 8%);

  :deep(.el-card__header) {
    padding: 20px 24px;
  }

  :deep(.el-card__body) {
    padding: 22px 24px 26px;
  }

  &__header,
  &__title {
    display: flex;
    align-items: center;
  }

  &__header {
    justify-content: space-between;
    gap: 18px;
  }

  &__title {
    min-width: 0;
    gap: 14px;

    > span {
      display: inline-flex;
      width: 46px;
      height: 46px;
      flex: 0 0 46px;
      align-items: center;
      justify-content: center;
      color: #0b4fb4;
      background: #eef5ff;
      border-radius: 50%;
      font-size: 24px;
    }

    h2 {
      margin: 0;
      color: #071833;
      font-size: 22px;
      font-weight: 850;
      letter-spacing: 0;
    }
  }

  &__dot {
    display: none;
  }

  &__body {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;
  }

  &__field {
    display: grid;
    min-width: 0;
    gap: 9px;

    &.is-wide {
      grid-column: 1 / -1;
    }

    label {
      color: #2f4260;
      font-size: 14px;
      font-weight: 850;
    }

    div {
      display: grid;
      min-width: 0;
      min-height: 54px;
      grid-template-columns: 52px minmax(0, 1fr);
      overflow: hidden;
      border: 1px solid #cbd8e8;
      border-radius: 10px;
    }

    span {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #183150;
      background: #f8fafc;
      border-right: 1px solid #cbd8e8;
      font-size: 22px;
    }

    strong {
      display: flex;
      min-width: 0;
      align-items: center;
      padding: 0 16px;
      overflow: hidden;
      color: #071833;
      font-size: 15px;
      font-weight: 650;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  @include mobile {
    :deep(.el-card__header),
    :deep(.el-card__body) {
      padding: 20px 18px;
    }

    &__header {
      align-items: flex-start;
      flex-direction: column;
    }

    &__title {
      gap: 14px;

      > span {
        width: 52px;
        height: 52px;
        flex-basis: 52px;
      }

      h2 {
        font-size: 24px;
      }
    }

    &__body {
      grid-template-columns: 1fr;
      gap: 18px;
    }

    &__field {
      div {
        min-height: 64px;
        grid-template-columns: 56px minmax(0, 1fr);
      }

      label,
      strong {
        font-size: 16px;
      }
    }
  }
}
</style>
