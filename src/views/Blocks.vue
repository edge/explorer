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
        <div class="checkbox-container" @click="updateHideEmptyBlocks" >
          <label>Hide Empty Blocks</label>
          <input type="checkbox" :checked="hideEmptyBlocks" />
          <span class="checkmark"></span>
        </div>
        <BlocksTable
          :hideEmptyBlocks="hideEmptyBlocks"
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
    hideEmptyBlocks() {
      return this.$route.query.noEmpty === '1' || false
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
    },
    updateHideEmptyBlocks() {
      const noEmpty = !this.hideEmptyBlocks ? 1 : undefined
      const query = { ...this.$route.query, noEmpty }
      this.$router.replace({ query })
    }
  },
  watch:{
    metadata() {
      if (this.$route.query.page < 1) {
        const p = parseInt(this.$route.query.page) || 0
        if (p < 1) this.$router.replace({ query: { ...this.$route.query, page: 1 } })
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

.checkbox-container {
  @apply flex items-center mb-10 justify-end;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.checkbox-container label {
  @apply cursor-pointer mr-5 mb-0;
}

.checkbox-container input {
  opacity: 0;
  height: 0;
  width: 0;
}

/* Create custom checkbox */
.checkmark {
  @apply cursor-pointer mr-5 mb-0;
  position: relative;
  height: 13px;
  width: 13px;
  border: solid 1px #787878;
  border-radius: 3px;
}

/* On mouse-over, add grey background color */
.checkbox-container:hover input ~ .checkmark {
  border-color: rgb(70, 70, 70);
}

/* When checkbox is checked, add green background */
.checkbox-container input:checked ~ .checkmark {
  background-color: rgb(14,204,95);
  border: none;
}

/* Create checkmark (hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show checkmark when checked */
.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}

/* Style for checkmark */
.checkbox-container .checkmark:after {
  left: 4px;
  top: 1px;
  width: 5px;
  height: 9px;
  border: solid white;
  border-width: 0 2px 2px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}
</style>
