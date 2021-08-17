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
import AccountPanel from "@/components/AccountPanel"
import NewsPromo from "@/components/NewsPromo"
import RecentBlocks from "@/components/RecentBlocks"
import RecentTransactions from "@/components/RecentTransactions"
import Statistics from "@/components/Statistics"
import SummaryHero from "@/components/SummaryHero"

import { getWalletAddress } from '../utils/wallet'
import { fetchBlocks, fetchTransactions } from '../utils/api'

export default {
  name: 'Summary',
  title() {
    return 'XE Explorer » Summary'
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
    AccountPanel,
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
    async loadWallet() {
      const walletAddress = await getWalletAddress()

      if (!walletAddress) {
        window.location = '/'
        return
      }

      this.wallet = await this.fetchWallet(walletAddress)
    },
    async fetchBlocks() {
      const { blocks, metadata } = await fetchBlocks({ options: { limit: 5 } })
      this.blockMetadata = metadata
      this.blocks = blocks
      this.loading = false
    },
    async fetchTransactions() {
      const { transactions, metadata } = await fetchTransactions({ options: { limit: 5 } })
      this.transactionMetadata = metadata
      this.transactions = transactions
      this.loading = false
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