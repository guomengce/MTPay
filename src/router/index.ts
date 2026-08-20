import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

import Layout from '@/layout/index.vue';
import { featureRoutes } from './modules';

export const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/login/index.vue'),
    meta: {
      title: '登录',
      icon: '',
      requiresAuth: false,
      hidden: true,
      keepAlive: false,
    },
  },
  {
    path: '/activate',
    name: 'Activate',
    component: () => import('@/views/auth/activate/index.vue'),
    meta: {
      title: '激活账户',
      icon: '',
      requiresAuth: false,
      hidden: true,
      keepAlive: false,
    },
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('@/views/auth/forgot-password/index.vue'),
    meta: {
      title: '找回密码',
      icon: '',
      requiresAuth: false,
      hidden: true,
      keepAlive: false,
    },
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: () => import('@/views/auth/reset-password/index.vue'),
    meta: {
      title: '重置密码',
      icon: '',
      requiresAuth: false,
      hidden: true,
      keepAlive: false,
    },
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    meta: {
      title: 'MTPay-web',
      icon: '',
      requiresAuth: true,
      hidden: true,
      keepAlive: false,
    },
    children: featureRoutes,
  },
  {
    path: '/403',
    name: 'Forbidden',
    component: () => import('@/views/error/403.vue'),
    meta: {
      title: '无权限',
      icon: '',
      requiresAuth: false,
      hidden: true,
      keepAlive: false,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/404.vue'),
    meta: {
      title: '页面不存在',
      icon: '',
      requiresAuth: false,
      hidden: true,
      keepAlive: false,
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0 }),
});

export default router;
