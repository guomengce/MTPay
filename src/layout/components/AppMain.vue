<template>
  <main class="app-main">
    <router-view v-slot="{ Component, route }">
      <component :is="Component" :key="route.fullPath" />
    </router-view>
  </main>
</template>

<style scoped lang="scss">
.app-main {
  flex: 1;
  min-width: 0;
  overflow: auto;
  padding: 24px;
  background: var(--portal-bg);

  @include narrow {
    padding: 20px;
  }

  @include mobile {
    padding: 14px;
  }
}
</style>
