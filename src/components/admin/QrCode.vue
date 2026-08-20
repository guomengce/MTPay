<template>
  <section class="qr-code" :style="{ '--qr-size': `${size}px` }">
    <header v-if="title || description" class="qr-code__header">
      <div>
        <h3 v-if="title">{{ title }}</h3>
        <p v-if="description">{{ description }}</p>
      </div>
      <span class="qr-code__status">
        <i aria-hidden="true" />
        {{ value ? '可扫码' : '待生成' }}
      </span>
    </header>

    <div class="qr-code__body">
      <div v-if="value" class="qr-code__canvas">
        <QrcodeVue
          :value="value"
          :size="size"
          :level="level"
          :margin="margin"
          :foreground="foreground"
          :background="background"
          render-as="svg"
        />
        <span class="qr-code__corner qr-code__corner--tl" />
        <span class="qr-code__corner qr-code__corner--tr" />
        <span class="qr-code__corner qr-code__corner--bl" />
        <span class="qr-code__corner qr-code__corner--br" />
      </div>

      <el-empty v-else :image-size="72" :description="emptyText" />
    </div>

    <footer v-if="value && (showValue || copyable)" class="qr-code__footer">
      <div v-if="showValue" class="qr-code__value" :title="value">
        <span>{{ value }}</span>
      </div>
      <el-button v-if="copyable" type="primary" plain :icon="CopyDocument" @click="copyValue">
        复制
      </el-button>
    </footer>
  </section>
</template>

<script setup lang="ts">
/**
 * 通用二维码展示组件。
 * 只负责将传入内容渲染为二维码，不在组件内请求接口或拼接业务数据。
 */
import { CopyDocument } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import QrcodeVue from 'qrcode.vue';

const props = withDefaults(defineProps<{
  /** 二维码原始内容，例如链上收款地址或完整支付 URI。 */
  value?: string;
  title?: string;
  description?: string;
  size?: number;
  level?: 'L' | 'M' | 'Q' | 'H';
  margin?: number;
  foreground?: string;
  background?: string;
  emptyText?: string;
  showValue?: boolean;
  copyable?: boolean;
}>(), {
  value: '',
  title: '',
  description: '',
  size: 188,
  level: 'H',
  margin: 1,
  foreground: '#0b1d34',
  background: '#ffffff',
  emptyText: '暂无二维码内容',
  showValue: true,
  copyable: true,
});

const emit = defineEmits<{ (e: 'copied', value: string): void }>();

async function copyValue() {
  if (!props.value) return;
  try {
    await navigator.clipboard.writeText(props.value);
    ElMessage.success('已复制');
    emit('copied', props.value);
  } catch {
    ElMessage.error('复制失败，请手动复制');
  }
}
</script>

<style scoped lang="scss">
.qr-code {
  display: grid;
  min-width: 0;
  gap: 20px;
  padding: 22px;
  border: 1px solid rgb(197 215 229 / 75%);
  border-radius: 18px;
  background:
    radial-gradient(circle at 100% 0, rgb(39 185 170 / 10%), transparent 34%),
    #ffffff;
  box-shadow: 0 14px 36px rgb(25 67 105 / 7%);

  &__header {
    display: flex;
    min-width: 0;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;

    h3 {
      margin: 0 0 5px;
      color: #071833;
      font-size: 17px;
      font-weight: 850;
    }

    p {
      margin: 0;
      color: #71849a;
      font-size: 12px;
      line-height: 1.55;
    }
  }

  &__status {
    display: inline-flex;
    flex: 0 0 auto;
    align-items: center;
    gap: 6px;
    padding: 5px 9px;
    border-radius: 999px;
    color: #168f87;
    background: #eaf8f6;
    font-size: 11px;
    font-weight: 750;

    i {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #20b7a8;
      box-shadow: 0 0 0 3px rgb(32 183 168 / 14%);
    }
  }

  &__body {
    display: grid;
    min-height: calc(var(--qr-size) + 28px);
    place-items: center;
  }

  &__canvas {
    position: relative;
    display: grid;
    padding: 14px;
    border: 1px solid #e4edf3;
    border-radius: 16px;
    background: #ffffff;
    box-shadow: 0 10px 28px rgb(24 69 104 / 9%);

    svg,
    canvas {
      display: block;
      max-width: 100%;
      height: auto;
    }
  }

  &__corner {
    position: absolute;
    width: 18px;
    height: 18px;
    border-color: #21aa9f;
    border-style: solid;

    &--tl { top: -3px; left: -3px; border-width: 2px 0 0 2px; border-radius: 7px 0 0; }
    &--tr { top: -3px; right: -3px; border-width: 2px 2px 0 0; border-radius: 0 7px 0 0; }
    &--bl { bottom: -3px; left: -3px; border-width: 0 0 2px 2px; border-radius: 0 0 0 7px; }
    &--br { right: -3px; bottom: -3px; border-width: 0 2px 2px 0; border-radius: 0 0 7px; }
  }

  &__footer {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: 10px;
  }

  &__value {
    min-width: 0;
    flex: 1;
    padding: 11px 13px;
    overflow: hidden;
    border: 1px solid #e2ebf2;
    border-radius: 10px;
    color: #50647b;
    background: #f7fafc;
    font-family: monospace;
    font-size: 12px;

    span {
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  @include mobile {
    padding: 18px;

    &__header,
    &__footer {
      align-items: stretch;
      flex-direction: column;
    }

    &__status {
      align-self: flex-start;
    }

    &__footer .el-button {
      width: 100%;
    }
  }
}
</style>
