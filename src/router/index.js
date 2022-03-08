// Copyright (C) 2021 Edge Network Technologies Limited
// Use of this source code is governed by a GNU GPL-style license
// that can be found in the LICENSE.md file. All rights reserved.

import { createRouter, createWebHistory } from 'vue-router'
import Blocks from '@/views/Blocks'
import Nodes from '@/views/Nodes'
import NotFound from '@/views/404'
import Overview from '@/views/Overview'
import Stakes from '@/views/Stakes'
import Transactions from '@/views/Transactions'
import Wallets from '@/views/Wallets'

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
    path: '/nodes/',
    name: 'Node',
    component: Nodes
  },
  {
    path: '/node/:address',
    name: 'Nodes',
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
    path: '/transaction/:hash',
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
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
