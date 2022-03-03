<template>
  <div class="flex flex-col h-full">
    <Header />
    <HeroPanel v-if="wallet" :title="'Wallet'" :address="address" />
    <HeroPanel v-else :title="'Wallets'" />

    <div class="flex-1 bg-gray-200 py-35">
      <div v-if="address && wallet" class="container">
        <div>
          <div class="row mb-25">
            <WalletOverview :wallet="wallet" />
            <WalletSummary :wallet="wallet" />
          </div>

          <div>
            <h3>Wallet Transactions</h3>
            <TransactionsTable
              :limit="txsLimit"
              :receiveMetadata="onTransactionsUpdate"
              :page="txCurrentPage"
              query="txsPage"
            />
            <Pagination
              v-if="metadata.totalCount > txsLimit"
              baseRoute="Wallet"
              :currentPage="txCurrentPage"
              :limit="txsLimit"
              :totalCount="txMetadata.totalCount"
            />
          </div>
          <div v-if="stakes.length" class="mt-20">
            <h3>Wallet Stakes</h3>
            <StakesTable :stakes="stakes" :hideWallet="true" />
            <Pagination v-if="stakes" baseRoute="Wallet" :address="address" :currentPage="stakesPage" :totalPages="Math.ceil(stakesMetadata.totalCount/stakesMetadata.limit)" query="stakesPage" />
          </div>

        </div>
      </div>
      <div v-else-if="!address" class="container">
        <WalletsTable
          :limit="limit"
          :receiveMetadata="onWalletsUpdate"
          :page="currentPage"
        />
        <Pagination
          v-if="metadata.totalCount > limit"
          baseRoute="Wallets"
          :currentPage="currentPage"
          :limit="limit"
          :totalCount="metadata.totalCount"
        />
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
import Pagination from "@/components/PaginationNew";
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
      limit: 20,
      loading: true,
      metadata: { totalCount: 0 },
      pollInterval: 10000,
      polling: null,
      rawData: null,
      stakesPage: 1,
      txsLimit: 10,
      txsMetadata: { totalCount: 0 },
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
  computed: {
    address() {
      return this.$route.params.address
    },
    currentPage() {
      return Math.max(1, parseInt(this.$route.query.txsPage) || 1)
    },
    lastPage() {
      return Math.max(1, Math.ceil(this.txsMetadata.totalCount / this.txLimit))
    },
    txsCurrentPage() {
      return Math.max(1, parseInt(this.$route.query.txsPage) || 1)
    },
    txsLastPage() {
      return Math.max(1, Math.ceil(this.txsMetadata.totalCount / this.txLimit))
    },
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
      this.stakesPage = parseInt(this.$route.query.stakesPage || 1)

      if (this.address && checksumAddressIsValid(this.address)) {
        if (!this.wallet) {
          this.wallet = { address: this.address, balance: 0, nonce: 0 }
        }

        this.loading = true
        
        const wallet = await fetchWallet(this.address)

        // await this.fetchTransactions({ address: this.address, options: { page: this.txsPage, limit: 10 } })
        await this.fetchStakes({page: this.stakesPage, limit: 10})

        this.wallet = {
          ...wallet,
          stakes: this.stakesMetadata.totalCount,
          transactions: this.txsMetadata.totalCount
        }

        this.loading = false
      }
    },
    async fetchStakes(options) {
      const { results, metadata } = await fetchStakesByWallet(this.address, options)
      this.stakes = results
      this.stakesMetadata = metadata
      this.loading = false
    },
    async fetchWallets(options) {
      const { results, metadata } = await fetchWallets(options)
      this.wallets = results
      this.metadata = metadata
      this.loading = false
    },
    onTransactionsUpdate(metadata) {
      this.txsMetadata = metadata
    },
    onWalletsUpdate(metadata) {
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
    $route(to, from) {
      this.beforeDestroy()
      this.fetchData()
    },
    metadata() {
      // clamp pagination to available page numbers with automatic redirection
      if (this.currentPage > this.lastPage) this.$router.push({ name: 'Wallets', query: { page: this.lastPage } })
    },
    txsMetadata() {
      // clamp pagination to available page numbers with automatic redirection
      if (this.txsCurrentPage > this.txsLastPage) this.$router.push({ name: 'Transaction', query: { txsPage: this.txsLastPage } })
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
