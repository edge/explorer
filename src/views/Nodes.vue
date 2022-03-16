<template>
  <div class="flex flex-col h-full">
    <Header />
    <HeroPanel v-if="address" :title="'Node'" :address="address" />
    <HeroPanel v-else :title="'Nodes'" />

    <div class="flex-1 bg-gray-200 py-35">
      <div v-if="session && address" class="container">
          <div class="row mb-25">
            <NodeOverview :session="session" />
            <NodeSummary :session="session" />
          </div>
      </div>
      <div v-else-if="!$route.params.nodeAddress" class="container">
        <NodesTable
          :limit="limit"
          :receiveMetadata="onSessionsUpdate"
          :page="currentPage"
          :sortable="true"
        />
        <Pagination
          v-if="metadata.totalCount > limit"
          baseRoute="Nodes"
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
import * as index from '@edge/index-utils'
import Header from "@/components/Header"
import HeroPanel from "@/components/HeroPanel"
import Pagination from "@/components/Pagination"
import NodeOverview from "@/components/NodeOverview"
import NodeSummary from "@/components/NodeSummary"
import NodesTable from "@/components/NodesTable"

const nodeRefreshInterval = 5 * 1000

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
      session: null,
      iSession: null
    }
  },
  components: {
    Header,
    HeroPanel,
    Pagination,
    NodeOverview,
    NodeSummary,
    NodesTable,
  },
  mounted() {
    if (this.$route.params.nodeAddress) { 
      this.updateSession()
      // initiate polling
      this.iSession = setInterval(() => {
        this.updateSession()
      }, nodeRefreshInterval)
    } else {
      const p = parseInt(this.$route.query.page) || 0
      if (p < 1) this.$router.replace({ query: { ...this.$route.query, page: 1 } })
    }
  },
  umounted() {
    clearInterval(this.iSession)
  },
  computed: {
    address() {
      return this.$route.params.nodeAddress || null
    },
    baseRoute() {
      return this.$route.params.nodeAddress ? 'Node' : 'Nodes'
    },
    currentPage() {
      return Math.max(1, parseInt(this.$route.query.page) || 1)
    },
    lastPage() {
      return Math.max(1, Math.ceil(this.metadata.totalCount / this.limit))
    }
  },
  methods: {
    onSessionsUpdate(metadata) {
      this.metadata = metadata
    },
    sliceString(string, symbols) {
      return string.length > symbols ? `${string.slice(0, symbols)}…` : string;
    },
    async updateSession() {
      if (!this.address) return
      this.loading = true
      const session = await index.session.session(
        process.env.VUE_APP_INDEX_API_URL,
        this.address
      )
      // add gateway (if host) and stargate (if host/gateway) data to the node data
      if (session.node.type === 'host') {
        const gateway = await index.session.session(process.env.VUE_APP_INDEX_API_URL, session.node.gateway)
        session.gateway = gateway
        const stargate = await index.session.session(process.env.VUE_APP_INDEX_API_URL, gateway.node.stargate)
        session.stargate = stargate
      }
      else if (session.node.type === 'gateway') {
        const stargate = await index.session.session(process.env.VUE_APP_INDEX_API_URL, session.node.stargate)
        session.stargate = stargate
      }
      // add wallet address to node data
      const stake = await index.stake.stake(process.env.VUE_APP_INDEX_API_URL, session.node.stake)
      session.node.wallet = stake.wallet

      this.session = session

      this.loaded = true
      this.loading = false
    }
  },
  watch: {
    $route (to, from) {
      this.updateSession()
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

  .row-full {
    @apply grid items-start grid-cols-1 gap-24;
    @apply lg:grid-cols-1;
  }

  .map-container {
    display: flex;
    justify-content: center;
    background-color: #cd0e27
  }

  .map {
    justify-self: center;
    align-self: center;
  }
</style>
