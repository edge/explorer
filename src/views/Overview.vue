<template>
  <Header />
  <SummaryHero />
  <div class="bg-gray-200 py-35">
    <div class="container">
      <div class="row mb-25">
        <Statistics :blockMetadata="blockMetadata" :transactionMetadata="transactionMetadata" />
        <NewsPromo />
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
import NewsPromo from "@/components/NewsPromo"
import RecentBlocks from "@/components/RecentBlocks"
import RecentTransactions from "@/components/RecentTransactions"
import Statistics from "@/components/Statistics"
import SummaryHero from "@/components/SummaryHero"

import { fetchBlocks, fetchTransactions } from '../utils/api'

export default {
  name: 'Summary',
  title() {
    return 'XE Explorer » Overview'
  },
  data: function () {
    return {
      blockMetadata: null,
      blocks: [],
      transactionMetadata: null,
      transactions: [],
      loading: false,
      polling: null
    }
  },
  components: {
    Header,
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
    $route (to, from) {
      clearInterval(this.polling)
      this.polling = null
    }
  },
  methods: {
    async fetchBlocks() {
      // Query for all blocks
      const { blocks, metadata } = await fetchBlocks({ options: { limit: 5 } })
      this.blockMetadata = metadata
      this.blocks = blocks
      
      // Query for all blocks in last 24 hours
      const { metadata: recentBlocksMetadata } = await fetchBlocks({
        options: {
          limit: 0,
          since: new Date().getTime()-(86400000)
        }
      })
      
      this.blockMetadata.recentBlocksCount = recentBlocksMetadata.totalCount
      
      this.loading = false
    },
    async fetchTransactions() {
      const { transactions, metadata } = await fetchTransactions({ options: { limit: 5 } })
      this.transactionMetadata = metadata
      this.transactions = transactions.filter(tx => !tx.pending)
      this.loading = false

      // Query for all txs in last 24 hours
      const { metadata: recentTransactionsMetadata } = await fetchTransactions({
        options: {
          limit: 0,
          since: new Date().getTime()-(86400000)
        }
      })
      
      this.transactionMetadata.recentTransactionssCount = recentTransactionsMetadata.totalCount      
    },
    pollData() {
      this.polling = setInterval(() => {
        this.fetchBlocks()
        this.fetchTransactions()
      }, 10000)
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