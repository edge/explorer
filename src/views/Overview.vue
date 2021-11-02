<template>
  <Header />
  <SummaryHero />
  <div class="bg-gray-200 py-35">
    <div class="container">
      <div class="row mb-25">
        <Statistics :blockMetadata="blockMetadata" :transactionMetadata="transactionMetadata" />
        <Faucet v-if="isTestnet" />
        <NewsPromo v-else />
      </div>

      <div class="row mt-15">
        <RecentBlocks :loading="loading" :blocks="blocks" />
        <RecentTransactions :loading="loading" :transactions="transactions" />
      </div>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header"
import Faucet from "@/components/Faucet"
import NewsPromo from "@/components/NewsPromo"
import RecentBlocks from "@/components/RecentBlocks"
import RecentTransactions from "@/components/RecentTransactions"
import Statistics from "@/components/Statistics"
import SummaryHero from "@/components/SummaryHero"

import { fetchBlocks, fetchTransactions } from '../utils/api'

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
      pollInterval: 10000,
      polling: null,
      isTestnet: process.env.VUE_APP_IS_TESTNET === 'true'
    }
  },
  components: {
    Header,
    Faucet,
    NewsPromo,
    RecentBlocks,
    RecentTransactions,
    Statistics,
    SummaryHero
  },
  mounted() {
    this.loading = true
    this.fetchBlocks()
    this.fetchTransactions()
    this.pollData()
  },
  watch: {
    $route(to, from) {
      clearInterval(this.polling)
      this.polling = null
    }
  },
  methods: {
    async fetchBlocks() {
      const recentBlocks = await fetchBlocks({ options: { limit: 5 } })
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
    async fetchTransactions() {
      const recentTransactions = await fetchTransactions({ options: { limit: 5 } })
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
      }, this.pollInterval)
    }
  }
}
</script>
<style scoped>
  .row {
    @apply grid items-start grid-cols-1 gap-24;
    @apply lg:grid-cols-2;
  }
</style>
