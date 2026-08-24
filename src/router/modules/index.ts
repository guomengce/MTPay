import type { RouteRecordRaw } from 'vue-router';

export const featureRoutes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/dashboard/index.vue'),
    meta: {
      title: '業務總覽',
      icon: 'Grid',
      requiresAuth: true,
      hidden: false,
    },
  },
  {
    path: '/deposit',
    name: 'Deposit',
    component: () => import('@/views/deposit/index.vue'),
    meta: {
      title: '數字貨幣入金',
      icon: 'Wallet',
      requiresAuth: true,
      hidden: false,
    },
  },
  {
    path: '/exchange',
    name: 'Exchange',
    component: () => import('@/views/exchange/index.vue'),
    meta: {
      title: '兌換USD',
      icon: 'Switch',
      requiresAuth: true,
      hidden: false,
    },
  },
  {
    path: '/deposit/detail/:id',
    name: 'DepositDetail',
    component: () => import('@/views/deposit/detail/index.vue'),
    meta: { title: '入金详情', icon: '', requiresAuth: true, hidden: true },
  },
  {
    path: '/exchange/detail/:id',
    name: 'ExchangeDetail',
    component: () => import('@/views/exchange/detail/index.vue'),
    meta: { title: '兑换详情', icon: '', requiresAuth: true, hidden: true },
  },
  {
    path: '/whitelist',
    name: 'Whitelist',
    component: () => import('@/views/whitelist/index.vue'),
    meta: {
      title: '白名單管理',
      icon: 'List',
      requiresAuth: true,
      hidden: false,
    },
  },
  {
    path: '/whitelist/detail/:id',
    name: 'WhitelistDetail',
    component: () => import('@/views/whitelist/detail/index.vue'),
    meta: {
      title: '白名单详情',
      icon: '',
      requiresAuth: true,
      hidden: true,
    },
  },
  {
    path: '/withdrawal',
    name: 'Withdrawal',
    component: () => import('@/views/withdrawal/index.vue'),
    meta: {
      title: 'USD出金',
      icon: 'Upload',
      requiresAuth: true,
      hidden: false,
    },
  },
  {
    path: '/withdrawal/detail/:id',
    name: 'WithdrawalDetail',
    component: () => import('@/views/withdrawal/detail/index.vue'),
    meta: {
      title: '出金详情',
      icon: '',
      requiresAuth: true,
      hidden: true,
    },
  },
  {
    path: '/records',
    name: 'Records',
    component: () => import('@/views/records/index.vue'),
    meta: {
      title: '交易記錄',
      icon: 'Tickets',
      requiresAuth: true,
      hidden: false,
    },
  },
  {
    path: '/records/detail/:businessType/:businessId',
    name: 'TransactionDetail',
    component: () => import('@/views/records/detail/index.vue'),
    meta: {
      title: '交易详情',
      icon: '',
      requiresAuth: true,
      hidden: true,
    },
  },
  {
    path: '/account',
    name: 'Account',
    component: () => import('@/views/account/index.vue'),
    meta: {
      title: '帳戶與安全',
      icon: 'User',
      requiresAuth: true,
      hidden: false,
    },
  },
];
