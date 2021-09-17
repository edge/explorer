// Copyright (C) 2021 Edge Network Technologies Limited
// Use of this source code is governed by a GNU GPL-style license
// that can be found in the LICENSE.md file. All rights reserved.

import { createRouter, createWebHistory } from 'vue-router'
import Blocks from '@/views/Blocks'
import Overview from '@/views/Overview'
import NotFound from '@/views/404'
import Transactions from '@/views/Transactions'
import Wallet from '@/views/Wallet'

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
    path: '/wallet/:address/:page(\\d+)?',
    name: 'Wallet',
    component: Wallet
  },
  { path: '/:catchAll(.*)', component: NotFound }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
