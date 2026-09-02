import type { RouteRecordRaw } from 'vue-router';

export const featureRoutes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/dashboard/index.vue'),
    meta: {
      title: 'menu.dashboard',
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
      title: 'menu.deposit',
      icon: 'Wallet',
      requiresAuth: true,
      hidden: false,
      cryptoOnly: true,
    },
  },
  { path:'/fiat-deposit',name:'FiatDeposit',component:()=>import('@/views/fiat-deposit/index.vue'),meta:{title:'menu.fiatDeposit',icon:'Upload',requiresAuth:true,hidden:true}},
  { path:'/fiat-deposit/detail/:id',name:'FiatDepositDetail',component:()=>import('@/views/fiat-deposit/detail/index.vue'),meta:{title:'menu.fiatDepositDetail',icon:'',requiresAuth:true,hidden:true}},
  {
    path: '/exchange',
    name: 'Exchange',
    component: () => import('@/views/exchange/index.vue'),
    meta: {
      title: 'menu.exchange',
      icon: 'Switch',
      requiresAuth: true,
      hidden: false,
      cryptoOnly: true,
    },
  },
  {
    path: '/deposit/detail/:id',
    name: 'DepositDetail',
    component: () => import('@/views/deposit/detail/index.vue'),
    meta: { title: 'menu.depositDetail', icon: '', requiresAuth: true, hidden: true, cryptoOnly: true },
  },
  {
    path: '/exchange/detail/:id',
    name: 'ExchangeDetail',
    component: () => import('@/views/exchange/detail/index.vue'),
    meta: { title: 'menu.exchangeDetail', icon: '', requiresAuth: true, hidden: true, cryptoOnly: true },
  },
  {
    path: '/whitelist',
    name: 'Whitelist',
    component: () => import('@/views/whitelist/index.vue'),
    meta: {
      title: 'menu.whitelist',
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
      title: 'menu.whitelistDetail',
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
      title: 'menu.withdrawal',
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
      title: 'menu.withdrawalDetail',
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
      title: 'menu.records',
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
      title: 'menu.transactionDetail',
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
      title: 'menu.account',
      icon: 'User',
      requiresAuth: true,
      hidden: false,
    },
  },
  {
    path: '/notifications', name: 'Notifications', component: () => import('@/views/notifications/index.vue'),
    meta: { title: 'notifications.title', icon: '', requiresAuth: true, hidden: true },
  },
];
