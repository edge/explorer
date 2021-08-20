<template>
  <div class="flex flex-col h-full">
    <Header />
    <HeroPanel v-if="block" :title="'Block'" :blockId="blockId" />
    <HeroPanel v-else :title="'Blocks'" />

    <div class="flex-1 bg-gray-200 py-35">
      <div v-if="block || blocks.length" class="container">
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
      <div v-else class="container h-full">
        <div v-if="!loading" class="flex flex-col items-center justify-center h-full">
          <h1 class="m-0 mt-20 text-2xl font-bold">This block doesn't exist</h1>
          <p class="mt-5 mb-0 text-center monospace">
            Try searching for a different block, or <router-link to="/blocks" class="underline hover:text-green">view all blocks</router-link>.
          </p>
          <router-link to="/blocks">
            <a class="mt-20 button button--solid">View all blocks</a>
          </router-link>
        </div>
      </div>
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
  name: 'Blocks',
  title() {
    return this.block ? `XE Explorer » Block ${this.block.height}` : 'XE Explorer » Blocks'
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
      blockId: null,
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
      this.blockId = this.$route.params.blockId
      this.page = parseInt(this.$route.params.page || 1)
      
      if (this.blockId) {
        this.loading = true
        const { blocks } = await fetchBlocks({ blockId: this.blockId })
        this.block = blocks[0]
        
        if (this.block) {
          this.processBlock()
        }
        
        this.loading = false
      } else {
        this.fetchBlocks({ page: this.page })
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