<template>
  <main class="app-main">
    <router-view v-slot="{ Component, route }">
      <keep-alive>
        <component :is="Component" v-if="route.meta.keepAlive" :key="route.fullPath" />
      </keep-alive>
      <component :is="Component" v-if="!route.meta.keepAlive" :key="route.fullPath" />
    </router-view>
  </main>
</template>

<style scoped lang="scss">
.app-main {
  flex: 1;
  min-width: 0;
  overflow: auto;
  padding: 30px;
  background: var(--portal-bg);

  @include mobile {
    padding: 12px;
  }
}
</style>
