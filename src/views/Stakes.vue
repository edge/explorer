<template>
  <div class="flex flex-col h-full">
    <Header />
    <HeroPanel v-if="stakeId" :title="'Stake'" :stakeId="stakeId" />
    <HeroPanel v-else :title="'Stakes'" />

    <div class="flex-1 bg-gray-200 py-35">
      <div v-if="stake" class="container">
        <div v-if="stake && lastTx">
          <div class="row mb-25">
            <StakeOverview :stake="stake" :tx="lastTx" />
            <StakeSummary :stake="stake" :tx="lastTx" />
          </div>
          <div class="txs-row mb-25">
            <div>
              <h3>Transactions</h3>
              <TransactionsTable v-if="txs && txs.length" :transactions="txs"/>
            </div>
          </div>
        </div>

        <div v-if="rawData" class="mb-25">
          <RawData :rawData="rawData" />
        </div>
      </div>
      <div v-else-if="!$route.params.stakeId" class="container">
        <StakesTable
          :limit="limit"
          :receiveMetadata="onStakesUpdate"
          :page="currentPage"
          :sortable="true"
        />
        <Pagination
          v-if="metadata.totalCount > limit"
          baseRoute="Stakes"
          :currentPage="currentPage"
          :limit="limit"
          :totalCount="metadata.totalCount"
        />
      </div>
      <div v-else class="container h-full">
        <div v-if="!loading" class="flex flex-col items-center justify-center h-full">
          <h1 class="m-0 mt-20 text-2xl font-bold">This stake doesn't exist</h1>
          <p class="mt-5 mb-0 text-center monospace">
            Try searching for a different stake, or <router-link to="/stakes" class="underline hover:text-green">view all stakes</router-link>.
          </p>
          <router-link to="/stakes">
            <a class="mt-20 button button--solid">View all stakes</a>
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
import StakeOverview from "@/components/StakeOverview"
import StakeSummary from "@/components/StakeSummary"
import StakesTable from "@/components/StakesTable"
import TransactionsTable from "@/components/TransactionsTable"

import { fetchStake, fetchStakeHistory } from '../utils/api'
import { xeStringFromMicroXe } from '@edge/wallet-utils'

export default {
  name: 'Stakes',
  title() {
    if (window.location.href.indexOf('/stake/') > 0) {
      const parts = window.location.href.split('/')
      return 'Stake ' + this.sliceString(parts[parts.length - 1], 7)
    }

    return 'Stakes'
  },
  data: function () {
    return {
      loading: false,
      metadata: { totalCount: 0 },
      limit: 20,
      page: 1,
      pollInterval: 30000,
      polling: null,
      rawData: null,
      stake: null,
      stakeId: null,
      lastTx: null,
      txs: []
    }
  },
  components: {
    Header,
    HeroPanel,
    Pagination,
    RawData,
    StakeOverview,
    StakeSummary,
    StakesTable,
    TransactionsTable
  },
  mounted() {
    if (this.$route.params.stakeId) { 
      this.fetchData()
    }
    const p = parseInt(this.$route.query.page) || 0
    if (p < 1) this.$router.push({ name: this.baseRoute, query: { page: 1 } })
  },
  computed: {
    baseRoute() {
      return this.$route.params.stakeId ? 'Stake' : 'Stakes'
    },
    currentPage() {
      return Math.max(1, parseInt(this.$route.query.page) || 1)
    },
    lastPage() {
      return Math.max(1, Math.ceil(this.metadata.totalCount / this.limit))
    }
  },
  methods: {
    async fetchData() {
      this.loading = true

      this.stakeId = this.$route.params.stakeId
      this.page = parseInt(this.$route.query.page || 1)

      const stake = await fetchStake(this.stakeId)
      this.stake = stake
      await this.fetchStakeTxs(this.stakeId)
      this.loading = false
    },
    sliceString(string, symbols) {
      return string.length > symbols ? `${string.slice(0, symbols)}…` : string;
    },
    async fetchStakeTxs() {
      const { results: transactions } = await fetchStakeHistory(this.stake.id)
      if (transactions.length < 0) return
      const lastTx = transactions.find(tx => tx.hash === this.stake.transaction)
      if (lastTx !== undefined) this.lastTx = lastTx
      this.txs = transactions.map(tx => ({
        address: tx.sender === lastTx.recipient ? tx.recipient : tx.sender,
        amount: xeStringFromMicroXe(tx.amount),
        date: new Date(tx.timestamp).toLocaleString(), // '16/04/2021 13:06',
        memo: tx.data.memo,
        hash: tx.hash,
        recipient: tx.recipient,
        sender: tx.sender,
        timestamp: tx.timestamp,
        type: tx.sender === lastTx.recipient ? 'Sent' : 'Received',
        confirmations: tx.confirmations,
        block: tx.block,
        pending: false
      })).sort((a, b) => b.timestamp - a.timestamp)
    },
    onStakesUpdate(metadata) {
      this.metadata = metadata
    },
  },
  watch: {
    $route (to, from) {
      this.fetchData()
    },
    metadata() {
      // clamp pagination to available page numbers with automatic redirection
      if (this.currentPage > this.lastPage) this.$router.push({ name: this.baseRoute, query: { page: this.lastPage } })
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
