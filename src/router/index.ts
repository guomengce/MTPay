import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

import Layout from '@/layout/index.vue';
import { featureRoutes } from './modules';

export const routes: RouteRecordRaw[] = [
  { path: '/reset-payment-password', name: 'ResetPaymentPassword', component: () => import('@/views/auth/reset-payment-password/index.vue'), meta: { title: 'paymentPassword.reset', requiresAuth: false, hidden: true } },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/login/index.vue'),
    meta: {
      title: 'routeTitles.login',
      icon: '',
      requiresAuth: false,
      hidden: true,
    },
  },
  {
    path: '/activate',
    name: 'Activate',
    component: () => import('@/views/auth/activate/index.vue'),
    meta: {
      title: 'routeTitles.activate',
      icon: '',
      requiresAuth: false,
      hidden: true,
    },
  },
  {
    path: '/two-factor', name: 'TwoFactor',
    component: () => import('@/views/auth/two-factor/index.vue'),
    meta: { title: 'twoFactor.title', icon: '', requiresAuth: false, hidden: true },
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('@/views/auth/forgot-password/index.vue'),
    meta: {
      title: 'routeTitles.forgotPassword',
      icon: '',
      requiresAuth: false,
      hidden: true,
    },
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: () => import('@/views/auth/reset-password/index.vue'),
    meta: {
      title: 'routeTitles.resetPassword',
      icon: '',
      requiresAuth: false,
      hidden: true,
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
    },
    children: featureRoutes,
  },
  {
    path: '/403',
    name: 'Forbidden',
    component: () => import('@/views/error/403.vue'),
    meta: {
      title: 'routeTitles.forbidden',
      icon: '',
      requiresAuth: false,
      hidden: true,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/404.vue'),
    meta: {
      title: 'routeTitles.notFound',
      icon: '',
      requiresAuth: false,
      hidden: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: (to) => to.hash ? { el: to.hash, top: 20 } : { top: 0 },
});

export default router;
