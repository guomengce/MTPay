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
  padding: 0;
  background: radial-gradient(circle at 45% 0, rgb(31 125 211 / 7%), transparent 34%), #f7f9fc;

  @include mobile {
    padding: 0;
  }
}
</style>
