<template>
  <div class="flex flex-col h-full">
    <Header />
    <HeroPanel v-if="hash" :title="'Transaction'" :hash="hash" />
    <HeroPanel v-else :title="'Transactions'" />

    <div class="flex-1 bg-gray-200 py-35">
      <div v-if="transaction || transactions.length" class="container">
        <div v-if="transaction" class="row mb-25">
          <TransactionOverview :transaction="transaction" />
          <TransactionSummary :transaction="transaction" />
        </div>

        <div v-if="rawData" class="mb-25">
          <RawData :rawData="rawData" />
        </div>

        <TransactionsTable :transactions="transactions" v-if="!transaction"/>
        <Pagination v-if="!transaction" baseRoute="Transactions" :currentPage="page" :totalPages="Math.ceil(metadata.totalCount/metadata.limit)" />
      </div>
      <div v-else class="container h-full">
        <div v-if="!loading" class="flex flex-col items-center justify-center h-full">
          <h1 class="m-0 mt-20 text-2xl font-bold">This transaction doesn't exist</h1>
          <p class="mt-5 mb-0 text-center monospace">
            Try searching for a different transaction, or <router-link to="/transactions" class="underline hover:text-green">view all transactions</router-link>.
          </p>
          <router-link to="/transactions">
            <a class="mt-20 button button--solid">View all transactions</a>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header"
import HeroPanel from "@/components/HeroPanel"
import Pagination from "@/components/Pagination";
import RawData from "@/components/RawData"
import TransactionOverview from "@/components/TransactionOverview"
import TransactionSummary from "@/components/TransactionSummary"
import TransactionsTable from "@/components/TransactionsTable"

import { fetchTransactions } from '../utils/api'

export default {
  name: 'Transactions',
  title() {
    return 'XE Explorer » Transactions'
  },
  data: function () {
    return {
      hash: null,
      loading: false,
      metadata: {},
      page: 1,
      polling: null,
      rawData: null,
      transaction: null,
      transactions: []
    }
  },
  components: {
    Header,
    HeroPanel,
    Pagination,
    RawData,
    TransactionOverview,
    TransactionSummary,
    TransactionsTable
  },
  mounted() {
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
        const { raw, transactions } = await fetchTransactions({ hash: this.hash })

        this.transaction = transactions[0]
        
        if (raw) {
          this.rawData = { ...raw }
        }

        this.loading = false
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
    pollData() {
      this.polling = this.hash && setInterval(() => {
        this.fetchData()
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