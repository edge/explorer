// Copyright (C) 2021 Edge Network Technologies Limited
// Use of this source code is governed by a GNU GPL-style license
// that can be found in the LICENSE.md file. All rights reserved.

import { createRouter, createWebHistory } from 'vue-router'
import Blocks from '@/views/Blocks.vue'
import Burns from '@/views/Burns.vue'
import Nodes from '@/views/Nodes.vue'
import NotFound from '@/views/404.vue'
import Overview from '@/views/Overview.vue'
import Stakes from '@/views/Stakes.vue'
import Transactions from '@/views/Transactions.vue'
import Wallets from '@/views/Wallets.vue'

const routes = [
  {
    path: '/',
    name: 'Overview',
    component: Overview
  },
  {
    path: '/block/:blockId',
    name: 'Block',
    component: Blocks
  },
  {
    path: '/blocks/:page(\\d+)?',
    name: 'Blocks',
    component: Blocks
  },
  {
    path: '/burn/:burnHash',
    name: 'Burn',
    component: Burns
  },
  {
    path: '/burns/:page(\\d+)?',
    name: 'Burns',
    component: Burns
  },
  {
    path: '/nodes',
    name: 'Nodes',
    component: Nodes
  },
  {
    path: '/node/:nodeAddress',
    name: 'Node',
    component: Nodes
  },
  {
    path: '/stake/:stakeId',
    name: 'Stake',
    component: Stakes
  },
  {
    path: '/stakes/:page(\\d+)?',
    name: 'Stakes',
    component: Stakes
  },
  {
    path: '/transaction/:txHash',
    name: 'Transaction',
    component: Transactions
  },
  {
    path: '/transactions/:page(\\d+)?',
    name: 'Transactions',
    component: Transactions
  },
  {
    path: '/wallet/:address/:page(\\d+)?',
    name: 'Wallet',
    component: Wallets
  },
  {
    path: '/wallets/:page(\\d+)?',
    name: 'Wallets',
    component: Wallets
  },
  { path: '/:catchAll(.*)', component: NotFound }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
