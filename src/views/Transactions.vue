<template>
  <div class="flex flex-col h-full">
    <Header />
    <HeroPanel v-if="hash" :title="'Transaction'" :hash="hash" />
    <HeroPanel v-else :title="'Transactions'" />

    <div class="flex-1 bg-gray-200 py-35">
      <div v-if="transaction" class="container">
        <div v-if="transaction" class="row mb-25">
          <TransactionOverview :transaction="transaction" />
          <TransactionSummary :transaction="transaction" />
        </div>

        <div v-if="rawData" class="mb-25">
          <RawData :rawData="rawData" />
        </div>
      </div>
      <div v-else-if="!hash" class="container">
        <TransactionsTable
          :limit="limit"
          :receiveMetadata="onTransactionsUpdate"
          :page="currentPage"
          :sortable="true"
        />
        <Pagination
          v-if="metadata.totalCount > limit"
          baseRoute="Transactions"
          :currentPage="currentPage"
          :limit="limit"
          :totalCount="metadata.totalCount"
        />
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
import Header from "@/components/Header.vue"
import HeroPanel from "@/components/HeroPanel.vue"
import Pagination from "@/components/Pagination.vue";
import RawData from "@/components/RawData.vue"
import TransactionOverview from "@/components/TransactionOverview.vue"
import TransactionSummary from "@/components/TransactionSummary.vue"
import TransactionsTable from "@/components/TransactionsTable.vue"
import { fetchTransactions, fetchExchangeTransaction } from '../utils/api'

const numRegEx = /^[-+]?\d*$/

export default {
  name: 'Transactions',
  title() {
    if (window.location.href.indexOf('/transaction/') > 0) {
      const parts = window.location.href.split('/')
      return 'Transaction ' + this.sliceString(parts[parts.length - 1], 7)
    }

    return 'Transactions'
  },
  data: function () {
    return {
      limit: 20,
      loading: false,
      metadata: { totalCount: 0 },
      pollInterval: 10000,
      polling: null,
      rawData: null,
      transaction: null,
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
  computed: {
    currentPage() {
      return Math.max(1, parseInt(this.$route.query.page) || 1)
    },
    lastPage() {
      return Math.max(1, Math.ceil(this.metadata.totalCount / this.limit))
    },
    hash() {
      return this.$route.params.txHash
    },
    isTransactionPending() {
      return this.transaction.pending
    }
  },
  mounted() {
    if (this.hash) {
      this.fetchData().then(() => {
        this.pollData()
      })
    }
  },
  methods: {
    beforeDestroy() {
      clearInterval(this.polling)
    },
    async fetchData() {
      this.loading = true

      if (this.hash) {
        const { raw, transactions } = await fetchTransactions({ hash: this.hash })
        const exchangeResult = await fetchExchangeTransaction(this.hash)

        this.transaction = transactions[0]

        if (raw) this.rawData = { ...raw }
        if (exchangeResult && !exchangeResult.metadata) this.transaction.exchangeResult = exchangeResult

        this.loading = false
      }
    },
    onTransactionsUpdate(metadata) {
      this.metadata = metadata
    },
    pollData() {
      this.polling = setInterval(() => {
        this.fetchData()
      }, this.pollInterval)
    },
    sliceString(string, symbols) {
      return string.length > symbols ? `${string.slice(0, symbols)}…` : string;
    }
  },
  watch: {
    $route (to, from) {
      // When the route changes, stops polling for new data.
      this.beforeDestroy()
      this.fetchData()
    },
    metadata() {
      if (this.$route.query.page) {
        if (this.$route.query.page < 1 || !numRegEx.test(this.$route.query.page)) this.$router.replace({ query: { ...this.$route.query, page: 1 } })
      }
      if (this.currentPage > this.lastPage) this.$router.replace({ query: { ...this.$route.query, page: this.lastPage } })
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
