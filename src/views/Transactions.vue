<template>
  <Header />
  <HeroPanel v-if="hash" :title="'Transaction'" :hash="hash" />
  <HeroPanel v-else :title="'Transactions'" />

  <div class="bg-gray-200 py-35">
    <div class="container">
      <div v-if="transaction" class="row mb-25">
        <TransactionOverview :transaction="transaction" />
        <TransactionSummary :transaction="transaction" />
      </div>
      <TransactionsTable :transactions="transactions" v-if="!transaction"/>
      <Pagination v-if="!transaction" :baseRoute="Transactions" :currentPage="page" :totalPages="Math.ceil(metadata.totalCount/metadata.limit)" />
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header"
import HeroPanel from "@/components/HeroPanel"
import Pagination from "@/components/Pagination";
import TransactionOverview from "@/components/TransactionOverview"
import TransactionSummary from "@/components/TransactionSummary"
import TransactionsTable from "@/components/TransactionsTable"

import { fetchTransactions, fetchWallet } from '../utils/api'

export default {
  name: 'Transactions',
  title() {
    return 'XE Wallet » Transactions'
  },
  data: function () {
    return {
      hash: null,
      loading: false,
      metadata: {},
      page: 1,
      polling: null,
      transaction: null,
      transactions: []
    }
  },
  components: {
    Header,
    HeroPanel,
    Pagination,
    TransactionOverview,
    TransactionSummary,
    TransactionsTable
  },
  mounted() {
    // this.loadWallet()
    this.fetchData()
    this.pollData()
  },
  methods: {
    beforeDestroy() {
      clearInterval(this.polling)
    },
    async fetchData() {
      this.loading = true
      
      this.hash = this.$route.params.hash
      this.page = parseInt(this.$route.params.page || 1)

      if (this.hash) {
        this.transaction = await fetchTransactions({ hash: this.hash })
      } else {
        this.fetchTransactions({ page: this.page })
      }
    },
    async fetchTransactions(options) {
      const { transactions, metadata } = await fetchTransactions({ options })

      this.transactions = transactions
      this.metadata = metadata
      this.loading = false
    },
    // fetchWallet (address) {
    //   return fetchWallet(address)
    // },
    // async loadWallet() {
    //   const walletAddress = await getWalletAddress()

    //   if (!walletAddress) {
    //     window.location = '/'
    //     return
    //   }

    //   this.wallet = await this.fetchWallet(walletAddress)
    // },
    pollData() {
      this.polling = this.hash && setInterval(() => {
        // this.fetchTransactions()
      }, 10000)
    }
  },
  watch: {
    // call again the method if the route changes
    '$route': 'fetchData'
  }
}
</script>
<style scoped>
  .row {
    @apply grid items-start grid-cols-1 gap-24;
    @apply lg:grid-cols-2;
  }
</style>