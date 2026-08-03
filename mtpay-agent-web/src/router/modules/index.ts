import type { RouteRecordRaw } from 'vue-router';

export const featureRoutes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/dashboard/index.vue'),
    meta: {
      title: '业务总览',
      icon: 'DataBoard',
      requiresAuth: true,
      hidden: false,
      keepAlive: true,
    },
  },
  {
    path: '/deposit',
    name: 'Deposit',
    component: () => import('@/views/deposit/index.vue'),
    meta: {
      title: '数字货币入金',
      icon: 'Download',
      requiresAuth: true,
      hidden: false,
      keepAlive: false,
    },
  },
  {
    path: '/exchange',
    name: 'Exchange',
    component: () => import('@/views/exchange/index.vue'),
    meta: {
      title: '兑换 USD',
      icon: 'Switch',
      requiresAuth: true,
      hidden: false,
      keepAlive: false,
    },
  },
  {
    path: '/whitelist',
    name: 'Whitelist',
    component: () => import('@/views/whitelist/index.vue'),
    meta: {
      title: '白名单管理',
      icon: 'List',
      requiresAuth: true,
      hidden: false,
      keepAlive: false,
    },
  },
  {
    path: '/withdrawal',
    name: 'Withdrawal',
    component: () => import('@/views/withdrawal/index.vue'),
    meta: {
      title: 'USD 出金',
      icon: 'Upload',
      requiresAuth: true,
      hidden: false,
      keepAlive: false,
    },
  },
  {
    path: '/records',
    name: 'Records',
    component: () => import('@/views/records/index.vue'),
    meta: {
      title: '交易记录',
      icon: 'Tickets',
      requiresAuth: true,
      hidden: false,
      keepAlive: false,
    },
  },
  {
    path: '/account',
    name: 'Account',
    component: () => import('@/views/account/index.vue'),
    meta: {
      title: '账户与安全',
      icon: 'User',
      requiresAuth: true,
      hidden: false,
      keepAlive: false,
    },
  },
];
