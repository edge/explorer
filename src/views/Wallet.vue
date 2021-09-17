<template>
  <div class="flex flex-col h-full">
    <Header />
    <HeroPanel v-if="address" :title="'Wallet'" :address="wallet ? address : null" />

    <div v-if="wallet" class="flex-1 bg-gray-200 py-35">
      <div v-if="address" class="container">
        <div v-if="address" class="row mb-25">
          <WalletOverview :wallet="wallet" :rawData="rawData" />
          <WalletSummary :wallet="wallet" />
        </div>

        <h3>Wallet Transactions</h3>
        <TransactionsTable :transactions="transactions" />
        <Pagination v-if="transactions" baseRoute="Wallet" :currentPage="page" :totalPages="Math.ceil(metadata.totalCount/metadata.limit)" />
      </div>
    </div>
    <div v-else class="container h-full">
      <div v-if="!loading" class="flex flex-col items-center justify-center h-full">
        <h1 class="m-0 mt-20 text-2xl font-bold">This wallet doesn't exist</h1>
        <p class="mt-5 mb-0 text-center monospace">
          Try searching for a different wallet, or <router-link to="/" class="underline hover:text-green">return to overview</router-link>.
        </p>
        <router-link to="/">
          <a class="mt-20 button button--solid">Return to overview</a>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header"
import WalletOverview from "@/components/WalletOverview"
import WalletSummary from "@/components/WalletSummary"
import HeroPanel from "@/components/HeroPanel"
import Pagination from "@/components/Pagination"
import RawData from "@/components/RawData"
import TransactionsTable from "@/components/TransactionsTable"
import { fetchTransactions, fetchWallet } from '../utils/api'
const { checksumAddressIsValid } = require('@edge/wallet-utils')

export default {
  name: 'Wallet',
  title() {
    const parts = window.location.href.split('/')
    const last = parts[parts.length - 1]
    const secondToLast = parts[parts.length - 2]
    let walletAddress = ''
    if (checksumAddressIsValid(last)) walletAddress = last
    else if (checksumAddressIsValid(secondToLast)) walletAddress = secondToLast
    return `XE Explorer » Wallet ${walletAddress}`
  },
  components: {
    WalletOverview,
    WalletSummary,
    Header,
    HeroPanel,
    Pagination,
    RawData,
    TransactionsTable
  },
  data: function () {
    return {
      address: null,
      error: '',
      loading: false,
      metadata: {},
      page: 1,
      pollInterval: 10000,
      polling: null,
      rawData: null,
      transactions: null,
      wallet: null
    }
  },
  mounted() {
    this.fetchData()
    this.pollData()
  },
  methods: {
    beforeDestroy() {
      // Stops the data polling.
      clearInterval(this.polling)
    },
    async fetchData() {
      this.address = this.$route.params.address
      this.page = parseInt(this.$route.params.page || 1)

      if (this.address && checksumAddressIsValid(this.address)) {
        if (!this.wallet) {
          this.wallet = { address: this.address, balance: 0, nonce: 0 }
        }
        
        this.loading = true
        const { transactions, metadata } = await fetchTransactions({ address: this.address, options: { page: this.page } })
        const wallet = await fetchWallet(this.address)
        
        this.transactions = transactions
        this.metadata = metadata
        this.wallet = {
          ...wallet,
          transactions: metadata.totalCount
        }
        
        this.loading = false
      }
    },
    async fetchTransactions(options) {
      const { transactions, metadata } = await fetchTransactions({ options })

      this.transactions = transactions
      this.metadata = metadata
      this.loading = false
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
  watch:{
    $route(to, from) {
      // When the route changes, stops polling for new data.
      this.beforeDestroy()
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
