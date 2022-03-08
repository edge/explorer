<template>
  <div class="flex flex-col h-full">
    <Header />
    <HeroPanel v-if="address" :title="'Node'" :address="address" />
    <HeroPanel v-else :title="'Nodes'" />

    <div class="flex-1 bg-gray-200 py-35">
      <div v-if="node && address" class="container">
        <div v-if="node && lastTx">
          <div class="row mb-25">
            <!-- <NodeOverview :node="node" /> -->
            <!-- <NodeSummary :node="node" /> -->
          </div>
          <div v-if="rawData" class="mb-25">
            <RawData :rawData="rawData" />
          </div>
        </div>
      </div>
      <div v-else-if="!$route.params.address" class="container">
        <NodesTable
          :limit="limit"
          :receiveMetadata="onNodesUpdate"
          :page="currentPage"
          :sortable="false"
        />
        <Pagination
          v-if="metadata.totalCount > limit"
          baseRoute="Network"
          :currentPage="currentPage"
          :limit="limit"
          :totalCount="metadata.totalCount"
        />
      </div>
      <div v-else class="container h-full">
        <div v-if="!loading" class="flex flex-col items-center justify-center h-full">
          <h1 class="m-0 mt-20 text-2xl font-bold">This node doesn't exist</h1>
          <p class="mt-5 mb-0 text-center monospace">
            Try searching for a different node, or <router-link to="/network" class="underline hover:text-green">view all nodes</router-link>.
          </p>
          <router-link to="/network">
            <a class="mt-20 button button--solid">View all nodes</a>
          </router-link>
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
// import NodeOverview from "@/components/NodeOverview"
// import NodeSummary from "@/components/NodeSummary"
import NodesTable from "@/components/NodesTable"

import { Node } from '../utils/api'

export default {
  name: 'Nodes',
  title() {
    if (window.location.href.indexOf('/node/') > 0) {
      const parts = window.location.href.split('/')
      return 'Node ' + this.sliceString(parts[parts.length - 1], 7)
    }

    return 'Nodes'
  },
  data: function () {
    return {
      limit: 20,
      loading: false,
      metadata: { totalCount: 0 },
      node: null,
      rawData: null,
    }
  },
  components: {
    Header,
    HeroPanel,
    Pagination,
    RawData,
    // NodeOverview,
    // NodeSummary,
    NodesTable,
  },
  mounted() {
    if (this.$route.params.address) { 
      this.fetchData()
    } else {
      const p = parseInt(this.$route.query.page) || 0
      if (p < 1) this.$router.replace({ query: { ...this.$route.query, page: 1 } })
    }
  },
  computed: {
    baseRoute() {
      return this.$route.params.address ? 'Node' : 'Nodes'
    },
    currentPage() {
      return Math.max(1, parseInt(this.$route.query.page) || 1)
    },
    lastPage() {
      return Math.max(1, Math.ceil(this.metadata.totalCount / this.limit))
    },
    address() {
      return this.$route.params.address || null
    }
  },
  methods: {
    async fetchData() {
      this.loading = true
      const node = await Node(this.address)
      this.node = node
      this.rawData = node
      this.loading = false
    },
    sliceString(string, symbols) {
      return string.length > symbols ? `${string.slice(0, symbols)}…` : string;
    },
    onNodesUpdate(metadata) {
      this.metadata = metadata
    },
  },
  watch: {
    $route (to, from) {
      this.fetchData()
    },
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
