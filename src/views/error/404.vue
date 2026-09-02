<template>
  <section class="page page-card">
    <h1 class="page-title">404</h1>
    <p class="page-description">{{ t('errorPage.notFound') }}</p>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
</script>
