<template>
  <Header />
  <SummaryHero />
  <div class="bg-gray-200">
    <div class="container">
      <div class="row cols" v-if="isTestnet">
        <Statistics :blockMetadata="blockMetadata" :stats="stats" :transactionMetadata="transactionMetadata" />
        <div class="grid gap-2">
          <Faucet />
          <StatisticsAdditional :stats="stats" class="hidden lg:block" />
        </div>
      </div>
      <div class="row cols" v-else>
        <Statistics :blockMetadata="blockMetadata" :stats="stats" :transactionMetadata="transactionMetadata" />
        <div class="hidden lg:grid gap-2">
          <NewsPromo />
          <StatisticsAdditional :stats="stats" class="hidden lg:block" />
        </div>
      </div>
      <div class="row cols">
        <OverviewRevenue />
        <OverviewCoinValue />
      </div>
      <div class="row">
        <NetworkMap :points="mapPoints" />
      </div>
      <div class="row cols">
        <RecentBlocks :loading="loading" :blocks="blocks" />
        <RecentTransactions :loading="loading" :transactions="transactions" />
      </div>
    </div>
  </div>
</template>

<script>
/*global process*/
import * as index from '@edge/index-utils'
import Faucet from "@/components/Faucet.vue"
import Header from "@/components/Header.vue"
import NetworkMap from "@/components/NetworkMap.vue"
import NewsPromo from "@/components/NewsPromo.vue"
import OverviewCoinValue from "@/components/OverviewCoinValue.vue"
import OverviewRevenue from "@/components/OverviewRevenue.vue"
import RecentBlocks from "@/components/RecentBlocks.vue"
import RecentTransactions from "@/components/RecentTransactions.vue"
import Statistics from "@/components/Statistics.vue"
import StatisticsAdditional from "@/components/StatisticsAdditional.vue"
import SummaryHero from "@/components/SummaryHero.vue"
import superagent from 'superagent'
import { fetchBlocks, fetchStakeStats, fetchTransactions } from '../utils/api'

const mapRefreshInterval = 60 * 1000
const pollInterval = 10 * 1000

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
      polling: null,
      stats: {},
      isTestnet: import.meta.env.VITE_IS_TESTNET === 'true'
    }
  },
  components: {
    Faucet,
    Header,
    NetworkMap,
    NewsPromo,
    OverviewCoinValue,
    OverviewRevenue,
    RecentBlocks,
    RecentTransactions,
    Statistics,
    StatisticsAdditional,
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
      const burnStats = await index.burn.stats(
        import.meta.env.VITE_INDEX_API_URL,
      )
      const earningsStats = await this.updateEarningStats()

      this.stats = {
        burns: burnStats,
        earnings: earningsStats,
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
      this.transactions = recentTransactions.transactions
      this.loading = false
    },
    pollData() {
      this.polling = setInterval(() => {
        this.fetchBlocks()
        this.fetchTransactions()
        this.fetchStats()
      }, pollInterval)
    },
    async updateEarningStats() {
      const statsResponse = await superagent.get(`${import.meta.env.VITE_INDEX_API_URL}/v2/stats/earnings`)
      return statsResponse.body
    },
    async updateMapPoints() {
      this.loading = true
      const result = await superagent.get(`${import.meta.env.VITE_INDEX_API_URL}/mapsessions`)
      if (result.body.results.length) this.mapPoints = result.body.results
      this.loaded = true
      this.loading = false
    }
  }
}
</script>
<style scoped>
  .cols {
    @apply grid items-start grid-cols-1 gap-38;
    @apply lg:grid-cols-2 lg:gap-12;
  }

  .row {
    @apply my-38;
  }
  .row:last-child {
    @apply pb-38;
  }
</style>
