<template>
  <Header />
  <HeroPanel v-if="block" :title="'Block'" :height="height" />
  <HeroPanel v-else :title="'Blocks'" />

  <div class="bg-gray-200 py-35">
    <div class="container">
      <div v-if="block" class="row mb-25">
        <BlockOverview :block="block" :rawData="rawData" />
        <BlockSummary :block="block" />
      </div>

      <div v-if="rawData" class="mb-25">
        <RawData :rawData="rawData" />
      </div>

      <h3 v-if="block">Block Transactions</h3>
      <BlocksTable v-if="blocks.length" :blocks="blocks" />
      <Pagination v-if="!block" baseRoute="Blocks" :currentPage="page" :totalPages="metadata.totalCount ? Math.ceil(metadata.totalCount/metadata.limit) : 0" />

      <TransactionsTable :transactions="transactions" v-if="transactions"/>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header"
import BlocksTable from "@/components/BlocksTable"
import BlockOverview from "@/components/BlockOverview"
import BlockSummary from "@/components/BlockSummary"
import HeroPanel from "@/components/HeroPanel"
import Pagination from "@/components/Pagination"
import RawData from "@/components/RawData"
import TransactionsTable from "@/components/TransactionsTable"
import { fetchBlocks } from '../utils/api'

export default {
  name: 'Overview',
  title() {
    return 'XE Explorer » Blocks'
  },
  components: {
    BlocksTable,
    BlockOverview,
    BlockSummary,
    Header,
    HeroPanel,
    Pagination,
    RawData,
    TransactionsTable
  },
  data: function () {
    return {
      block: null,
      blocks: [],
      error: '',
      height: null,
      loading: false,
      metadata: {},
      page: 1,
      polling: null,
      rawData: null,
      transactions: null
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchBlocks(options) {
      this.loading = true
      
      const { blocks, metadata } = await fetchBlocks({ options })
      this.blocks = blocks
      this.metadata = metadata
      this.loading = false
    },
    async fetchData() {
      this.height = this.$route.params.height
      this.page = parseInt(this.$route.params.page || 1)
      
      if (this.height) {
        this.loading = true
        const { blocks } = await fetchBlocks({ height: this.height })
        this.block = blocks[0]
        this.processBlock()
        this.loading = false
      } else {
        this.fetchBlocks({ page: this.page })
        // this.pollData()
      }
    },
    pollData() {
      this.polling = this.block && setInterval(() => {
        this.fetchBlocks()
      }, 10000)
    },
    processBlock() {
      this.rawData = { ...this.block }
      this.transactions = this.block.transactions

      this.block.total = this.transactions.reduce((accumulator, currentItem) => {
        accumulator += Number(currentItem.amount)
        return accumulator
      }, 0)
      
      this.block.average = this.transactions.length ? this.block.total/this.transactions.length : 0
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