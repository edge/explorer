// Copyright (C) 2021 Edge Network Technologies Limited
// Use of this source code is governed by a GNU GPL-style license
// that can be found in the LICENSE.md file. All rights reserved.

import { createRouter, createWebHistory } from 'vue-router'
import NotFound from '@/views/404.vue'
import Overview from '@/views/Overview.vue'

const routes = [
  {
    path: '/',
    name: 'Overview',
    component: Overview
  },
  {
    path: '/block/:blockId',
    name: 'Block',
    component: () => import('@/views/Blocks.vue')
  },
  {
    path: '/blocks/:page(\\d+)?',
    name: 'Blocks',
    component: () => import('@/views/Blocks.vue')
  },
  {
    path: '/burn/:burnHash',
    name: 'Burn',
    component: () => import('@/views/Burns.vue')
  },
  {
    path: '/burns/:page(\\d+)?',
    name: 'Burns',
    component: () => import('@/views/Burns.vue')
  },
  {
    path: '/nodes',
    name: 'Nodes',
    component: () => import('@/views/Nodes.vue')
  },
  {
    path: '/node/:nodeAddress',
    name: 'Node',
    component: () => import('@/views/Nodes.vue')
  },
  {
    path: '/stake/:stakeId',
    name: 'Stake',
    component: () => import('@/views/Stakes.vue')
  },
  {
    path: '/stakes/:page(\\d+)?',
    name: 'Stakes',
    component: () => import('@/views/Stakes.vue')
  },
  {
    path: '/transaction/:txHash',
    name: 'Transaction',
    component: () => import('@/views/Transactions.vue')
  },
  {
    path: '/transactions/:page(\\d+)?',
    name: 'Transactions',
    component: () => import('@/views/Transactions.vue')
  },
  {
    path: '/wallet/:address/:page(\\d+)?',
    name: 'Wallet',
    component: () => import('@/views/Wallets.vue')
  },
  {
    path: '/wallets/:page(\\d+)?',
    name: 'Wallets',
    component: () => import('@/views/Wallets.vue')
  },
  { path: '/:catchAll(.*)', component: NotFound }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(() => {
  const menu = document.querySelector('#menu')
  if (menu) bodyScrollLock.enableBodyScroll(menu)
})

export default router
