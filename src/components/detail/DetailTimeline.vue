<template>
  <ol class="detail-timeline">
    <li v-for="(item, index) in items" :key="`${item.event}-${index}`">
      <span
        class="detail-timeline__node"
        :class="{ 'is-done': Boolean(item.time), 'is-active': !item.time && index === activeIndex }"
      />
      <div>
        <strong>{{ item.name }}</strong>
        <time v-if="item.time">{{ item.time }}</time>
        <small v-else-if="index === activeIndex">当前阶段</small>
        <small v-else>尚未发生</small>
        <p v-if="item.description" class="detail-timeline__desc">{{ item.description }}</p>
      </div>
    </li>
  </ol>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  items: { event: string; name: string; time: string | null; description?: string }[];
}>();

const activeIndex = computed(() => props.items.findIndex((item) => !item.time));
</script>

<style scoped lang="scss">
.detail-timeline {
  display: grid;
  gap: 0;
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    position: relative;
    display: grid;
    grid-template-columns: 18px minmax(0, 1fr);
    gap: 12px;
    padding-bottom: 22px;

    &::before {
      position: absolute;
      top: 15px;
      bottom: 0;
      left: 6px;
      width: 2px;
      background: #e0e8ef;
      content: '';
    }

    &:last-child {
      padding-bottom: 0;

      &::before {
        display: none;
      }
    }

    > div {
      display: grid;
      min-width: 0;
      gap: 5px;
    }

    strong {
      color: #203249;
      font-size: 14px;
      font-weight: 600;
    }

    time,
    small {
      color: #7b8b9f;
      font-size: 12px;
      line-height: 1.5;
    }

    &__desc {
      margin: 8px 0 0;
      padding: 8px 10px;
      border-radius: 8px;
      color: #42516a;
      background: #f2f6fa;
      font-size: 12px;
      line-height: 1.6;
    }
  }

  &__node {
    position: relative;
    z-index: 1;
    width: 14px;
    height: 14px;
    margin-top: 2px;
    border: 3px solid #dfe7ee;
    border-radius: 50%;
    background: #ffffff;

    &.is-done {
      border-color: #17b4a8;
      background: #17b4a8;
    }

    &.is-active {
      border-color: #1e8db2;
      box-shadow: 0 0 0 5px rgb(30 141 178 / 12%);
    }
  }
}
</style>
