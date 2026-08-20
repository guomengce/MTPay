<template>
  <article class="profile-card">
    <header class="profile-card__hero">
      <div class="profile-card__identity">
        <span class="profile-card__avatar">{{ companyInitial }}</span>
        <div>
          <small>企业代理账户</small>
          <h2>{{ profile?.company_name || '—' }}</h2>
          <p>{{ profile?.agent_code || '资料加载中' }}</p>
        </div>
      </div>
      <StatusBadge
        :label="profile?.status_name || '未知状态'"
        :type="profile?.status === 1 ? 'success' : 'warning'"
      />
    </header>

    <div class="profile-card__section-title">
      <span>账户资料</span>
      <small>资料由 MTPay 管理端维护</small>
    </div>

    <div class="profile-card__details">
      <section v-for="item in details" :key="item.label" class="profile-card__detail">
        <span><el-icon><component :is="item.icon" /></el-icon></span>
        <div>
          <small>{{ item.label }}</small>
          <strong>{{ item.value }}</strong>
        </div>
      </section>
    </div>
  </article>
</template>

<script setup lang="ts">
import { Clock, Message, Phone, Postcard } from '@element-plus/icons-vue';
import { computed } from 'vue';

import type { AgentProfile } from '@/api/modules/auth';
import StatusBadge from '@/components/admin/StatusBadge.vue';

const props = defineProps<{ profile: AgentProfile | null }>();

const companyInitial = computed(() => props.profile?.company_name?.trim().charAt(0).toUpperCase() || 'M');
const details = computed(() => [
  { label: '联系 Email', value: props.profile?.email || '—', icon: Message },
  { label: '联系电话', value: props.profile?.phone || '未设置', icon: Phone },
  { label: '代理编号', value: props.profile?.agent_code || '—', icon: Postcard },
  { label: '账户激活时间', value: props.profile?.activated_at || '—', icon: Clock },
]);
</script>

<style scoped lang="scss">
.profile-card {
  min-width: 0;
  overflow: hidden;
  border: 1px solid rgb(192 211 227 / 70%);
  border-radius: 20px;
  background: rgb(255 255 255 / 96%);
  box-shadow: 0 18px 50px rgb(35 82 126 / 8%);

  &__hero {
    position: relative;
    display: flex;
    min-height: 150px;
    align-items: flex-start;
    justify-content: space-between;
    gap: 18px;
    overflow: hidden;
    padding: 28px;
    background:
      radial-gradient(circle at 94% 10%, rgb(53 199 190 / 18%), transparent 32%),
      linear-gradient(135deg, #f5fbff 0%, #f1fbf9 100%);

    &::after {
      position: absolute;
      right: -45px;
      bottom: -72px;
      width: 180px;
      height: 180px;
      border: 1px solid rgb(39 185 170 / 18%);
      border-radius: 50%;
      content: '';
    }
  }

  &__identity {
    position: relative;
    z-index: 1;
    display: flex;
    min-width: 0;
    align-items: center;
    gap: 18px;

    small { color: #668097; font-size: 12px; font-weight: 700; }
    h2 { margin: 6px 0; color: #071833; font-size: 24px; line-height: 1.25; }
    p { margin: 0; color: #168f8a; font-size: 13px; font-weight: 800; letter-spacing: 0.06em; }
  }

  &__avatar {
    display: inline-flex;
    width: 72px;
    height: 72px;
    flex: 0 0 72px;
    align-items: center;
    justify-content: center;
    border: 4px solid rgb(255 255 255 / 82%);
    border-radius: 20px;
    color: #fff;
    background: linear-gradient(135deg, #25bcae, #2787c4);
    box-shadow: 0 12px 26px rgb(30 145 170 / 25%);
    font-size: 28px;
    font-weight: 850;
  }

  &__section-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24px 28px 8px;
    span { color: #13243b; font-size: 16px; font-weight: 850; }
    small { color: #8a9aae; font-size: 12px; }
  }

  &__details {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    padding: 14px 28px 28px;
  }

  &__detail {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: 13px;
    padding: 16px;
    border: 1px solid #e3edf4;
    border-radius: 13px;
    background: #fbfdff;

    > span {
      display: inline-flex;
      width: 40px;
      height: 40px;
      flex: 0 0 40px;
      align-items: center;
      justify-content: center;
      border-radius: 11px;
      color: #168f8a;
      background: #e9f8f6;
      font-size: 18px;
    }

    div { min-width: 0; }
    small { display: block; margin-bottom: 5px; color: #8494a8; font-size: 12px; }
    strong { display: block; overflow: hidden; color: #172942; font-size: 14px; text-overflow: ellipsis; white-space: nowrap; }
  }

  @include mobile {
    &__hero { align-items: flex-start; flex-direction: column; padding: 22px; }
    &__identity { align-items: flex-start; }
    &__avatar { width: 58px; height: 58px; flex-basis: 58px; border-radius: 16px; }
    &__section-title { align-items: flex-start; flex-direction: column; gap: 5px; padding: 22px 20px 8px; }
    &__details { grid-template-columns: 1fr; padding: 12px 20px 22px; }
  }
}
</style>
