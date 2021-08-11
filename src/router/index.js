//                  $$\
//                  $$ |
//   $$$$$$\   $$$$$$$ | $$$$$$\   $$$$$$\
//  $$  __$$\ $$  __$$ |$$  __$$\ $$  __$$\
//  $$$$$$$$ |$$ /  $$ |$$ /  $$ |$$$$$$$$ |
//  $$   ____|$$ |  $$ |$$ |  $$ |$$   ____|
//  \$$$$$$$\ \$$$$$$$ |\$$$$$$$ |\$$$$$$$\
//   \_______| \_______| \____$$ | \_______|
//                      $$\   $$ |
// © 2021 Edge Network  \$$$$$$  |
//   Technologies Ltd.   \______/

import { createRouter, createWebHistory } from 'vue-router'
import Index from '../views/Index.vue'
import Blocks from '@/views/Blocks'
import Summary from '@/views/Summary'
import Transactions from '@/views/Transactions'
import Overview from '@/views/Overview'

const routes = [
  {
    path: '/',
    name: 'Index',
    component: Index
  },
  {
    path: '/block/:hash',
    name: 'Block',
    component: Blocks
  },
  {
    path: '/blocks',
    name: 'Blocks',
    component: Blocks
  },
  {
    path: '/overview',
    name: 'Overview',
    component: Overview
  },
  {
    path: '/transactions',
    name: 'Transactions',
    component: Transactions
  },
  {
    path: '/summary',
    name: 'Summary',
    component: Summary
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
