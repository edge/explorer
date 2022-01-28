<template>
  <div class="flex flex-col h-full">
    <Header />
    <HeroPanel v-if="wallet" :title="'Wallet'" :address="address" />
    <HeroPanel v-else :title="'Wallets'" />

    <div class="flex-1 bg-gray-200 py-35">
      <div v-if="wallet || wallets.length" class="container">
        <div v-if="wallet">
          <div class="row mb-25">
            <WalletOverview :wallet="wallet" />
            <WalletSummary :wallet="wallet" />
          </div>

          <div>
            <h3>Wallet Transactions</h3>
            <TransactionsTable :transactions="transactions" />
            <Pagination v-if="transactions" baseRoute="Wallet" :address="address" :currentPage="txsPage" :totalPages="Math.ceil(txsMetadata.totalCount/txsMetadata.limit)" query="txsPage" />
          </div>
          
          <div v-if="stakes.length" class="mt-20">
            <h3>Wallet Stakes</h3>
            <StakesTable :stakes="stakes" :hideWallet="true" />
            <Pagination v-if="stakes" baseRoute="Wallet" :address="address" :currentPage="stakesPage" :totalPages="Math.ceil(stakesMetadata.totalCount/stakesMetadata.limit)" query="stakesPage" />
          </div>

        </div>
        <div v-else>
          <WalletsTable :wallets="wallets" />
          <Pagination v-if="wallets" baseRoute="Wallets" :currentPage="page" :totalPages="Math.ceil(metadata.totalCount/metadata.limit)" />
        </div>
      </div>
      <div v-else class="container h-full">
        <div v-if="loading" class="flex flex-col items-center justify-center h-full">
          <h1 class="m-0 mt-0 text-2xl font-bold">Loading</h1>
          <p class="mt-5 mb-0 text-center monospace">
            This should only take a moment.
          </p>
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
import StakesTable from "@/components/StakesTable"
import TransactionsTable from "@/components/TransactionsTable"
import WalletOverview from "@/components/WalletOverview"
import WalletSummary from "@/components/WalletSummary"
import WalletsTable from "@/components/WalletsTable"

import { fetchStakesByWallet, fetchTransactions, fetchWallets, fetchWallet } from '../utils/api'
const { checksumAddressIsValid } = require('@edge/wallet-utils')

export default {
  name: 'Wallets',
  title() {
    const parts = window.location.href.split('/')
    const last = parts[parts.length - 1]
    const secondToLast = parts[parts.length - 2]
    let walletAddress = ''
    if (checksumAddressIsValid(last)) walletAddress = last
    else if (checksumAddressIsValid(secondToLast)) walletAddress = secondToLast
    else return 'Wallets'

    return `Wallet ${walletAddress}`
  },
  data: function () {
    return {
      hash: null,
      loading: true,
      metadata: {},
      page: 1,
      pollInterval: 10000,
      polling: null,
      rawData: null,
      stakesPage: 1,
      txsPage: 1,
      wallet: null,
      wallets: []
    }
  },
  components: {
    Header,
    HeroPanel,
    Pagination,
    RawData,
    StakesTable,
    TransactionsTable,
    WalletOverview,
    WalletSummary,
    WalletsTable
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
      this.page = parseInt(this.$route.query.page || 1)
      this.txsPage = parseInt(this.$route.query.txsPage || 1)

      if (this.address && checksumAddressIsValid(this.address)) {
        if (!this.wallet) {
          this.wallet = { address: this.address, balance: 0, nonce: 0 }
        }

        this.loading = true
        
        const wallet = await fetchWallet(this.address)

        await this.fetchTransactions({ address: this.address, options: { page: this.page, limit: 10 } })
        await this.fetchStakes({page: this.page, limit: 10})

        this.wallet = {
          ...wallet,
          stakes: this.stakesMetadata.totalCount,
          transactions: this.txsMetadata.totalCount
        }

        this.loading = false
      } else {
        this.fetchWallets({ page: this.page })
      }
    },    
    async fetchStakes(options) {
      const { results, metadata } = await fetchStakesByWallet(this.address, options)

      this.stakes = results
      this.stakesMetadata = metadata
      this.loading = false
    },
    async fetchTransactions(options) {
      const { transactions, metadata } = await fetchTransactions(options)

      this.transactions = transactions
      this.txsMetadata = metadata
      this.loading = false
    },
    async fetchWallets(options) {
      const { results, metadata } = await fetchWallets(options)
      this.wallets = results
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
  watch: {
    $route(to, from) {
      this.beforeDestroy()
      this.fetchData()
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
