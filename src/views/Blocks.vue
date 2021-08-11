<template>
  <Header />
  <SummaryHero />

  <div class="bg-gray-200 py-35">
    <div class="container">
      <BlocksTable />
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header"
import BlocksTable from "@/components/BlocksTable"
import SummaryHero from "@/components/SummaryHero"

// import { fetchTransactions, fetchWallet, formatTransactions } from '../utils/api'
// import { getWalletAddress } from '../utils/wallet'

// const dayjs = require('dayjs')
// const relativeTime = require('dayjs/plugin/relativeTime')
// dayjs.extend(relativeTime)

export default {
  name: 'Overview',
  title() {
    return 'XE Wallet » Blocks'
  },
  data: function () {
    return {
      loading: false,
      error: '',
      polling: null
    }
  },
  components: {
    BlocksTable,
    Header,
    SummaryHero
  },
  mounted() {
    // this.loading = true
    // this.loadWallet()
    // this.pollData()
  },
  methods: {
    // pollData() {
    //   this.polling = setInterval(() => {
    //     this.fetchTransactions()
    //   }, 10000)
    // }
  }
}
</script>
