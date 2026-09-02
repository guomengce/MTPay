<template>
  <div class="balance-card" :class="`is-${tone}`">
    <div class="balance-card__head">
      <div class="balance-card__title"><span>{{ title }}</span></div>
      <div class="balance-card__icon"><span>{{ codeIcon }}</span></div>
    </div>

    <div class="balance-card__amount">
      <el-tooltip :content="formattedAmount" placement="top" :show-after="250">
        <strong>{{ formattedAmount }}</strong>
      </el-tooltip>
    </div>

    <div class="balance-card__meta">
      <span v-if="approx" class="balance-card__approx">≈ {{ approx }}</span>
      <span class="balance-card__frozen">{{ frozen }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { formatMoney } from '@/utils/formatMoney';

const props = defineProps<{
  code: string;
  title: string;
  amount: string;
  frozen: string;
  approx?: string;
  tone: 'teal' | 'blue' | 'green';
}>();

const formattedAmount = computed(() => formatMoney(props.amount));
const codeIcon = computed(() => props.code === 'USD' || props.code === 'USDC' ? '$' : '₮');
</script>

<style scoped lang="scss">
.balance-card {
  position: relative;
  display: flex;
  min-width: 0;
  flex-direction: column;
  overflow: hidden;
  padding: 12px 22px;
  color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 14px 30px rgb(16 30 54 / 8%);
  &::before { position: absolute; top: -40px; right: -40px; width: 160px; height: 160px; border-radius: 50%; content: ''; background: rgb(255 255 255 / 12%); filter: blur(2px); }
  &::after { position: absolute; bottom: -60px; left: -30px; width: 140px; height: 140px; border-radius: 50%; content: ''; background: rgb(255 255 255 / 10%); }
  &__head { position: relative; z-index: 1; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
  &__title { display: flex; min-width: 0; align-items: center; gap: 8px; color: rgb(255 255 255 / 92%); font-size: 13px; font-weight: 600; > span { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; } }
  &__icon { display: inline-flex; width: 38px; height: 38px; flex: 0 0 38px; align-items: center; justify-content: center; border: 1px solid rgb(255 255 255 / 35%); border-radius: 50%; background: rgb(255 255 255 / 16%); color: #fff; font-size: 19px; font-weight: 800; }
  &__amount { position: relative; z-index: 1; min-width: 0; margin: 16px 0 4px; strong { display: block; min-width: 0; overflow: hidden; font-size: clamp(24px, 2.25vw, 32px); font-weight: 800; letter-spacing: 0; line-height: 1.1; text-overflow: ellipsis; white-space: nowrap; cursor: default; } }
  &__meta { position: relative; z-index: 1; display: flex; min-width: 0; align-items: center; justify-content: space-between; gap: 8px; margin-top: 10px; color: rgb(255 255 255 / 85%); font-size: 12px; font-weight: 600; }
  &__approx { color: rgb(255 255 255 / 95%); }
  &__frozen { min-width: 0; overflow: hidden; color: rgb(255 255 255 / 85%); line-height: 1.35; text-overflow: ellipsis; white-space: nowrap; }
  &.is-teal { background: linear-gradient(135deg, #2ec4b6 0%, #1a8aa8 100%); }
  &.is-blue { background: linear-gradient(135deg, #4f8df0 0%, #246cd0 100%); }
  &.is-green { background: linear-gradient(135deg, #1ab394 0%, #0e7a78 100%); }
  @include mobile { padding: 18px 20px 16px; &__amount strong { font-size: 28px; } }
}
</style>