<template>
  <Header />
  <!-- <AccountPanel :wallet="this.wallet" /> -->

  <div class="bg-gray-200 py-35">
    <div class="container">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
        <NewsPromo />
        <NewsPromo />
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
        <RecentBlocks />
        <RecentTransactions />
      </div>

      <!-- <div class="w-full text-right" v-if="transactions.length">
        <a href="/transactions" class="button button--success">View all</a>
      </div> -->
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header"
import AccountPanel from "@/components/AccountPanel"
import NewsPromo from "@/components/NewsPromo"
import RecentBlocks from "@/components/RecentBlocks"
import RecentTransactions from "@/components/RecentTransactions"

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
    RecentTransactions
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
