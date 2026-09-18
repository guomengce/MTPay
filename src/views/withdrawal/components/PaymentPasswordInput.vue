<template>
  <div class="payment-digits" role="group" :aria-label="label" :class="{ 'is-disabled': disabled }">
    <input v-for="(_, index) in digits" :key="index" :ref="element => inputs[index] = element as HTMLInputElement"
      :value="digits[index]" :aria-label="`${label} ${index + 1}/6`" :name="`withdrawal-payment-digit-${index}`"
      type="password" inputmode="numeric" pattern="[0-9]*" maxlength="1" autocomplete="new-password"
      data-lpignore="true" data-1p-ignore :disabled="disabled"
      @input="inputDigit(index, $event)" @keydown="keydown(index, $event)" @paste="paste(index, $event)"
      @focus="($event.target as HTMLInputElement).select()" />
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
const props = defineProps<{ modelValue: string; disabled?: boolean; label: string }>();
const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>();
const digits = ref<string[]>(Array(6).fill(''));
const inputs: HTMLInputElement[] = [];
let emitted = '';
watch(() => props.modelValue, value => {
  if (value === emitted) return;
  digits.value = Array.from({ length: 6 }, (_, index) => value[index] || '');
  emitted = value;
}, { immediate: true });
function publish() { emitted = digits.value.join(''); emit('update:modelValue', emitted); }
function focus(index: number) { inputs[Math.max(0, Math.min(5, index))]?.focus(); }
function inputDigit(index: number, event: Event) {
  const target = event.target as HTMLInputElement;
  digits.value[index] = target.value.replace(/[^0-9]/g, '').slice(-1);
  target.value = digits.value[index];
  publish();
  if (digits.value[index]) focus(index + 1);
}
function keydown(index: number, event: KeyboardEvent) {
  if (event.key === 'Backspace') {
    event.preventDefault();
    if (digits.value[index]) digits.value[index] = '';
    else if (index > 0) { digits.value[index - 1] = ''; focus(index - 1); }
    publish();
  } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault(); focus(index + (event.key === 'ArrowLeft' ? -1 : 1));
  }
}
function paste(index: number, event: ClipboardEvent) {
  event.preventDefault();
  const value = event.clipboardData?.getData('text').trim() || '';
  if (!/^[0-9]{1,6}$/.test(value)) return;
  const start = value.length === 6 ? 0 : index;
  for (let offset = 0; offset < value.length && start + offset < 6; offset++) digits.value[start + offset] = value[offset];
  publish(); focus(Math.min(5, start + value.length));
}
</script>
<style scoped>
.payment-digits { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); width: 100%; border: 1px solid #cbd9e6; border-radius: 12px; overflow: hidden; background: #fff; }
.payment-digits input { width: 100%; min-width: 0; height: 58px; padding: 0; border: 0; border-right: 1px solid #d8e2eb; border-radius: 0; outline: none; background: transparent; color: #12324b; text-align: center; font-size: 25px; caret-color: #119d98; transition: background .15s, box-shadow .15s; }
.payment-digits input:last-child { border-right: 0; }
.payment-digits input:focus { background: #f2fbfa; box-shadow: inset 0 0 0 2px #1bafa8; }
.payment-digits.is-disabled { background: #f5f7fa; opacity: .65; }
@media (max-width: 480px) { .payment-digits input { height: 50px; } }
</style>
