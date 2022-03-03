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
              :page="txsCurrentPage"
            />
            <Pagination
              v-if="txsMetadata.totalCount > txsLimit"
              baseRoute="Wallet"
              :currentPage="txsCurrentPage"
              :limit="txsLimit"
              :totalCount="txsMetadata.totalCount"
              query="txsPage"
            />
          </div>
          <div class="mt-20">
            <h3>Wallet Stakes</h3>
            <StakesTable 
              :limit="stakesLimit"
              :receiveMetadata="onStakesUpdate"
              :page="stakesCurrentPage"
            />
            <Pagination
              v-if="stakesMetadata.totalCount > stakesLimit"
              baseRoute="Wallet"
              :currentPage="stakesCurrentPage"
              :limit="stakesLimit"
              :totalCount="stakesMetadata.totalCount"
              query="stakesPage"
            />
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
        <div v-if="!loading" class="flex flex-col items-center justify-center h-full">
          <h1 class="m-0 mt-20 text-2xl font-bold">This wallet doesn't exist</h1>
          <p class="mt-5 mb-0 text-center monospace">
            Try searching for a different wallet, or <router-link to="/wallets" class="underline hover:text-green">view all wallets</router-link>.
          </p>
          <router-link to="/wallets">
            <a class="mt-20 button button--solid">View all wallets</a>
          </router-link>
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
import { checksumAddressIsValid } from '@edge/wallet-utils'
import { fetchWallet } from '../utils/api'

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
      loading: true,
      pollInterval: 10000,
      polling: null,
      rawData: null,
      limit: 20,
      stakesLimit: 10,
      txsLimit: 10,
      metadata: { totalCount: 0 },
      stakesMetadata: { totalCount: 0 },
      txsMetadata: { totalCount: 0 },
      wallet: null,
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
      return Math.max(1, parseInt(this.$route.query.page) || 1)
    },
    lastPage() {
      return Math.max(1, Math.ceil(this.metadata.totalCount / this.limit))
    },
    stakesCurrentPage() {
      return Math.max(1, parseInt(this.$route.query.stakesPage) || 1)
    },
    stakesLastPage() {
      return Math.max(1, Math.ceil(this.stakesMetadata.totalCount / this.stakesLimit))
    },
    txsCurrentPage() {
      return Math.max(1, parseInt(this.$route.query.txsPage) || 1)
    },
    txsLastPage() {
      return Math.max(1, Math.ceil(this.txsMetadata.totalCount / this.txsLimit))
    },
  },
  mounted() {
    if (this.address) {
      this.fetchData()
      this.pollData()
      // clamp tx and stakes tables to page 1
      const txP = parseInt(this.$route.query.txsPage) || 0
      const stakesP = parseInt(this.$route.query.stakesPage) || 0
      if (txP < 1) this.$router.push({ name: 'Wallet', query: { ...this.$route.query, txsPage: 1 } })
      if (stakesP < 1) this.$router.push({ name: 'Wallet', query: { ...this.$route.query, stakesPage: 1 } })
    } else {
      const p = parseInt(this.$route.query.page) || 0
      if (p < 1) this.$router.push({ name: 'Wallets', query: { page: 1 } })
    }
  },
  methods: {
    beforeDestroy() {
      // Stops the data polling.
      clearInterval(this.polling)
    },
    async fetchData() {
      if (this.address) {
        this.loading = true
        const wallet = await fetchWallet(this.address)
        if (wallet.address) this.wallet = wallet
        else if (checksumAddressIsValid(this.address)) {
          this.wallet = {
            address: this.address,
            balance: 0,
            nonce: 0,
            txCount: 0
          }
        }
        this.loading = false
      }
    },
    onStakesUpdate(metadata) {
      this.stakesMetadata = metadata
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
      // clamp wallets pagination to available page numbers with automatic redirection
      if (this.currentPage > this.lastPage) this.$router.push({ name: 'Wallets', query: { page: this.lastPage } })
    },
    stakesMetadata() {
      // clamp stakes pagination to available page numbers with automatic redirection
      if (this.stakesCurrentPage > this.stakesLastPage) this.$router.push({ name: 'Wallet', query: { stakesPage: this.stakesLastPage } })
    },
    txsMetadata() {
      // clamp tx pagination to available page numbers with automatic redirection
      if (this.txsCurrentPage > this.txsLastPage) this.$router.push({ name: 'Wallet', query: { txsPage: this.txsLastPage } })
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
