// Copyright (C) 2021 Edge Network Technologies Limited
// Use of this source code is governed by a GNU GPL-style license
// that can be found in the LICENSE.md file. All rights reserved.

import { createRouter, createWebHistory } from 'vue-router'
import Blocks from '@/views/Blocks'
import Overview from '@/views/Overview'
import NotFound from '@/views/404'
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
    path: '/wallet/:address',
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
