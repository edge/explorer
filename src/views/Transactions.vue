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
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header"
import TableItem from "@/components/TransactionsTableItem"
import TransactionOverview from "@/components/TransactionOverview"
import TransactionSummary from "@/components/TransactionSummary"
import TransactionsTable from "@/components/TransactionsTable"
import AccountPanel from "@/components/AccountPanel"
import HeroPanel from "@/components/HeroPanel"

import { fetchTransactions, fetchWallet } from '../utils/api'
import { getWalletAddress } from '../utils/wallet'

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
      polling: null,
      transaction: null,
      transactions: [],
      wallet: {}
    }
  },
  components: {
    AccountPanel,
    TransactionOverview,
    TransactionSummary,
    TransactionsTable,
    TableItem,
    Header,
    HeroPanel
  },
  mounted() {
    // this.loading = true
    // this.loadWallet()
    this.fetchData()
    this.pollData()
  },
  methods: {
    beforeDestroy() {
      clearInterval(this.polling)
    },
    async fetchData() {
      this.hash = this.$route.params.hash

      if (this.hash) {
        this.transaction = await fetchTransactions({ hash: this.hash })
      } else {
        this.fetchTransactions()
      }
    },
    async fetchTransactions() {
      const { transactions, metadata } = await fetchTransactions({})

      this.transactions = transactions
      // this.metadata = metadata
      this.loading = false
    },
    fetchWallet (address) {
      return fetchWallet(address)
    },
    async loadWallet() {
      const walletAddress = await getWalletAddress()

      if (!walletAddress) {
        window.location = '/'
        return
      }

      this.wallet = await this.fetchWallet(walletAddress)
    },
    pollData() {
      this.polling = this.hash && setInterval(() => {
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