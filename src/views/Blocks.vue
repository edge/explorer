<template>
  <Header />
  <SummaryHero :block="block" />

  <div class="bg-gray-200 py-35">
    <div class="container">
      <div v-if="hash" class="bg-red-50">
        {{block}}
      </div>
      <BlocksTable />
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header"
import BlocksTable from "@/components/BlocksTable"
import SummaryHero from "@/components/SummaryHero"

import { fetchBlocks } from '../utils/api'
// import { getWalletAddress } from '../utils/wallet'

// const dayjs = require('dayjs')
// const relativeTime = require('dayjs/plugin/relativeTime')
// dayjs.extend(relativeTime)

export default {
  name: 'Overview',
  title() {
    return 'XE Wallet » Blocks'
  },
  data: function () {
    return {
      block: null,
      error: '',
      hash: null,
      loading: false,
      polling: null
    }
  },
  components: {
    BlocksTable,
    Header,
    SummaryHero
  },
  mounted() {
    this.loading = true
    this.fetchData()
    this.pollData()
  },
  methods: {
    async fetchBlocks() {
      const { blocks } = await fetchBlocks({ limit: 5 })
      this.blocks = blocks
      console.log('blocks', blocks)
      this.loading = false
    },
    async fetchData() {
      this.hash = this.$route.params.hash
      
      if (this.hash) {
        // const { blocks } = await fetchBlocks(this.hash)
        // this.block = blocks[0]
        this.block = {
          hash: this.hash,
          transactions: 102,
          confirmations: 4,
          average: 2.427990,
          completed: new Date(1628676371064).toLocaleDateString(),
    "timestamp": 1628676371064,
    "height": 72792,
    "parent": "00000333af874399c49d42a0d7cb5cc7688c9de0befa0dafd5d74ebe1c175964",
    "data": {
        "transactions": {}
    },
    "ledgerHash": "78d81c1aa7504f82551ee2725c11e172ea2072bf736ffab8b9c6df04fd9da700",
    "nonce": 5647426,
    "difficulty": 5,
    "dataHash": "afb26882aa9f57a14c9a8dc3becdea1cba25a0108936439bf6fe2600eaf58d66"
        }
        this.loading = false
      } else {
        this.fetchBlocks()
      }
    },
    pollData() {
      this.polling = this.hash && setInterval(() => {
        this.fetchBlocks()
      }, 10000)
    }
  }
}
</script>
