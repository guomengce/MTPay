<template>
  <header class="admin-hero">
    <div class="admin-hero__main">
      <span class="admin-hero__icon">
        <i :class="icon" aria-hidden="true" />
      </span>
      <div>
        <h1>{{ title }}</h1>
        <p>{{ description }}</p>
      </div>
    </div>
    <div class="admin-hero__art" aria-hidden="true"></div>
    <slot name="extra" />
  </header>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
  icon: string;
}>();
</script>

<style scoped lang="scss">
.admin-hero {
  position: relative;
  display: flex;
  min-width: 0;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  overflow: hidden;

  &__main {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: 16px;
  }

  &__icon {
    display: inline-flex;
    width: 56px;
    height: 56px;
    flex: 0 0 56px;
    align-items: center;
    justify-content: center;
    border-radius: 14px;
    color: #126df0;
    background: linear-gradient(135deg, #dff3ff, #eef0ff);
    // box-shadow: 0 20px 38px rgb(27 98 198 / 12%);
    font-size: 27px;

    i {
      font-weight: 400;
      line-height: 1;
    }
  }

  h1 {
    margin: 0 0 5px;
    color: #071833;
    font-size: clamp(28px, 2.25vw, 34px);
    font-weight: 850;
    line-height: 1.15;
  }

  p {
    margin: 0;
    color: #64748b;
    font-size: 14px;
    font-weight: 600;
  }

  &__art {
    width: 190px;
    height: 82px;
    flex: 0 0 190px;
    opacity: 0.8;
    background:
      radial-gradient(circle at 70% 40%, rgb(67 130 255 / 24%), transparent 30%),
      linear-gradient(135deg, rgb(54 144 255 / 18%), rgb(34 211 190 / 8%));
    clip-path: polygon(15% 20%, 82% 0, 100% 65%, 43% 100%, 0 80%);
  }

  @include narrow {
    &__main {
      gap: 14px;
    }

    &__icon {
      width: 50px;
      height: 50px;
      flex-basis: 50px;
      font-size: 24px;
    }

    h1 {
      font-size: 28px;
    }

    &__art {
      width: 150px;
      flex-basis: 150px;
    }
  }

  @include mobile {
    align-items: flex-start;
    flex-direction: column;

    &__main {
      align-items: flex-start;
    }

    &__icon {
      width: 44px;
      height: 44px;
      flex-basis: 44px;
      font-size: 22px;
    }

    h1 {
      font-size: 24px;
    }

    p {
      font-size: 14px;
    }

    &__art {
      position: absolute;
      right: -80px;
      bottom: -40px;
      width: 190px;
      height: 90px;
    }
  }
}
</style>
