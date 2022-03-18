<template>
  <Header />
  <SummaryHero />
  <div class="bg-gray-200 py-35">
    <div class="container">
      <div class="row mb-25" v-if="isTestnet">
        <Statistics :blockMetadata="blockMetadata" :stats="stats" :transactionMetadata="transactionMetadata" />
        <Faucet />
      </div>
      <div class="row mb-25" v-else>
        <Statistics :blockMetadata="blockMetadata" :stats="stats" :transactionMetadata="transactionMetadata" />
        <NetworkMap :points="mapPoints" />
      </div>

      <div class="row mt-15">
        <RecentBlocks :loading="loading" :blocks="blocks" />
        <RecentTransactions :loading="loading" :transactions="transactions" />
      </div>
    </div>
  </div>
</template>

<script>
import Faucet from "@/components/Faucet"
import Header from "@/components/Header"
import NetworkMap from "@/components/NetworkMap"
import RecentBlocks from "@/components/RecentBlocks"
import RecentTransactions from "@/components/RecentTransactions"
import Statistics from "@/components/Statistics"
import SummaryHero from "@/components/SummaryHero"

import superagent from 'superagent'
import { fetchBlocks, fetchStakeStats, fetchTransactions } from '../utils/api'

const mapRefreshInterval = 60 * 1000

export default {
  name: 'Overview',
  title: 'Overview',
  data: function () {
    return {
      blockMetadata: null,
      blocks: [],
      transactionMetadata: null,
      transactions: [],
      loading: false,
      mapPoints: [],
      iMapPoints: null,
      pollInterval: 10000,
      polling: null,
      stats: {},
      isTestnet: process.env.VUE_APP_IS_TESTNET === 'true'
    }
  },
  components: {
    Faucet,
    Header,
    NetworkMap,
    RecentBlocks,
    RecentTransactions,
    Statistics,
    SummaryHero
  },
  mounted() {
    this.loading = true
    this.fetchBlocks()
    this.fetchTransactions()
    this.fetchStats()
    this.pollData()

    this.updateMapPoints()
    this.iMapPoints = setInterval(() => {
      this.updateMapPoints()
    }, mapRefreshInterval)
  },
  unmounted() {
    clearInterval(this.iMapPoints)
    clearInterval(this.polling)
  },
  watch: {
    $route(to, from) {
      clearInterval(this.iMapPoints)
      clearInterval(this.polling)
      this.polling = null
    }
  },
  methods: {
    async fetchBlocks() {
      const recentBlocks = await fetchBlocks({ options: { limit: 10 } })
      const blockMetadata = recentBlocks.metadata

      // Query for all blocks in last 24 hours
      const { metadata: recentBlocksMetadata } = await fetchBlocks({
        options: {
          limit: 0,
          since: new Date().getTime()-(86400000)
        }
      })

      blockMetadata.recentBlocksCount = recentBlocksMetadata.totalCount
      this.blockMetadata = blockMetadata
      this.blocks = recentBlocks.blocks
      this.loading = false
    },
    async fetchStats() {
      const stakeStats = await fetchStakeStats()
      this.stats = {
        stakes: stakeStats
      }
    },
    async fetchTransactions() {
      const recentTransactions = await fetchTransactions({ options: { limit: 10 } })
      const transactionMetadata = recentTransactions.metadata

      // Query for all txs in last 24 hours
      const { metadata: recentTransactionsMetadata } = await fetchTransactions({
        options: {
          limit: 0,
          since: new Date().getTime()-(86400000)
        }
      })

      transactionMetadata.recentTransactionsCount = recentTransactionsMetadata.totalCount
      this.transactionMetadata = transactionMetadata
      this.transactions = recentTransactions.transactions.filter(tx => !tx.pending)
      this.loading = false
    },
    pollData() {
      this.polling = setInterval(() => {
        this.fetchBlocks()
        this.fetchTransactions()
        this.fetchStats()
      }, this.pollInterval)
    },
    async updateMapPoints() {
      this.loading = true
      const result = await superagent.get(`${process.env.VUE_APP_INDEX_API_URL}/sessions/map?limit=500`)
      this.mapPoints = result.body.results
      this.loaded = true
      this.loading = false
    },
  }
}
</script>
<style scoped>
  .row {
    @apply grid items-start grid-cols-1 gap-24;
    @apply lg:grid-cols-2;
  }
</style>
