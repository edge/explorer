<template>
  <div class="flex flex-col h-full">
    <Header />
    <HeroPanel v-if="block" :title="'Block'" :blockId="blockId" />
    <HeroPanel v-else :title="'Blocks'" />

    <div class="flex-1 bg-gray-200 py-35">
      <div v-if="block" class="container">
        <div v-if="block" class="row mb-25">
          <BlockOverview :block="block" :rawData="rawData" />
          <BlockSummary :block="block" />
        </div>

        <div v-if="rawData" class="mb-25">
          <RawData :rawData="rawData" />
        </div>

        <h3 v-if="metadata.totalCount > 0">Block Transactions</h3>
        <TransactionsTable 
          :limit="limit"
          :receiveMetadata="receiveMetaData"
          :page="currentPage"
        />
        <Pagination
          v-if="metadata.totalCount > limit"
          :baseRoute="baseRoute"
          :currentPage="currentPage"
          :limit="limit"
          :totalCount="metadata.totalCount"
        />
      </div>
      <div v-else-if="!blockId" class="container">
        <div class="flex items-center mb-10">
          <input type="checkbox" class="mr-5" />
          <label class="mb-0">Hide Empty Blocks</label>
        </div>
        <BlocksTable
          :limit="limit"
          :receiveMetadata="receiveMetaData"
          :page="currentPage"
          :sortable="true"
        />
        <Pagination
          v-if="metadata.totalCount > limit"
          :baseRoute="baseRoute"
          :currentPage="currentPage"
          :limit="limit"
          :totalCount="metadata.totalCount"
        />
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
import BlocksTable from "@/components/BlocksTable"
import BlockOverview from "@/components/BlockOverview"
import BlockSummary from "@/components/BlockSummary"
import Header from "@/components/Header"
import HeroPanel from "@/components/HeroPanel"
import Pagination from "@/components/Pagination"
import RawData from "@/components/RawData"
import TransactionsTable from "@/components/TransactionsTable"
import { fetchBlocks } from '../utils/api'

export default {
  name: 'Blocks',
  title() {
    if (window.location.href.indexOf('/block/') > 0) {
      const parts = window.location.href.split('/')
      return 'Block ' + this.sliceString(parts[parts.length - 1], 7)
    }

    return 'Blocks'
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
      loading: false,
      metadata: { totalCount: 0 },
      rawData: null,
      transactions: null
    }
  },
  computed: {
    baseRoute() {
      return this.blockId ? 'Block' : 'Blocks'
    },
    blockId() {
      return this.$route.params.blockId
    },
    currentPage() {
      return Math.max(1, parseInt(this.$route.query.page) || 1)
    },
    lastPage() {
      return Math.max(1, Math.ceil(this.metadata.totalCount / this.limit))
    },
    limit() {
      // 10 txs when viewing a block, or 20 blocks if view block table
      return this.blockId ? 10 : 20
    }
  },
  mounted() {
    if (this.blockId) {
      this.fetchData()
    }
    const p = parseInt(this.$route.query.page) || 0
    if (p < 1) this.$router.replace({ query: { ...this.$route.query, page: 1 } })
  },
  methods: {
    async fetchBlocks(options) {
      const { blocks, metadata } = await fetchBlocks({ options })
      if (blocks[0].height) {
        this.blocks = blocks
        this.metadata = metadata
      }
    },
    async fetchData() {
      if (this.blockId) {
        this.loading = true
        const { blocks } = await fetchBlocks({ blockId: this.blockId })
        this.block = blocks[0]

        if (blocks[0]) {
          if (this.block.transactions && Object.keys(this.block.transactions).length) {
            const latestBlocks = await fetchBlocks({ options: { limit: 1 } })
            if (latestBlocks && latestBlocks.blocks && latestBlocks.blocks[0]) {
              this.latestBlockHeight = latestBlocks.blocks[0].height
            }
          }

          if (this.block) {
            this.processBlock()
          }
        }
        this.loading = false
      }
    },
    receiveMetaData(metadata) {
      this.metadata = metadata
    },
    processBlock() {
      this.rawData = { ...this.block }
      this.transactions = this.block.transactions
      this.transactions.forEach(tx => {
        if (!tx.confirmations) tx.confirmations = this.latestBlockHeight - this.block.height + 1
      })
    },
    sliceString(string, symbols) {
      return string.length > symbols ? `${string.slice(0, symbols)}…` : string;
    }
  },
  watch:{
    metadata() {
      // clamp pagination to available page numbers with automatic redirection
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
