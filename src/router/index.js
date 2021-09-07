// Copyright (C) 2021 Edge Network Technologies Ltd
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file or at https://opensource.org/licenses/MIT.

import { createRouter, createWebHistory } from 'vue-router'
import Blocks from '@/views/Blocks'
import Transactions from '@/views/Transactions'
import Overview from '@/views/Overview'
import NotFound from '@/views/404'

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
  { path: '/:catchAll(.*)', component: NotFound }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
