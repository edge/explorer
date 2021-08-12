<template>
  <Header />
  <SummaryHero />
  <div class="bg-gray-200 py-35">
    <div class="container">
      <div class="row mb-25">
        <Statistics />
        <NewsPromo />
      </div>

      <div class="row mt-15">
        <RecentBlocks />
        <RecentTransactions />
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

export default {
  name: 'Summary',
  title() {
    return 'XE Wallet » Summary'
  },
  data: function () {
    return {
      wallet: {},
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
    // this.loading = true
    // this.loadWallet()
    // this.pollData()
  },
  methods: {
    async loadWallet() {
      const walletAddress = await getWalletAddress()

      if (!walletAddress) {
        window.location = '/'
        return
      }

      this.wallet = await this.fetchWallet(walletAddress)
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