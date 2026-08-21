<template>
  <section class="subject-section">
    <header class="subject-section__header">
      <span class="subject-section__icon"><i class="ri-home-4-line" /></span>
      <div><h3>居住资料</h3><p>居住国家、城市与详细地址</p></div>
    </header>
    <dl class="subject-section__grid">
      <div v-for="field in fields" :key="field.key" :class="fieldClass(field)">
        <dt>{{ field.label }}</dt>
        <dd :class="{ 'is-mono': field.mono }">{{ field.value }}</dd>
      </div>
    </dl>
  </section>
</template>

<script setup lang="ts">
import type { WhitelistDetailField } from '../../../composables/useWhitelistDetailView';

defineProps<{ fields: WhitelistDetailField[] }>();
function fieldClass(field: WhitelistDetailField) {
  return { 'is-wide': field.wide, 'is-missing': field.missing };
}
</script>
