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
          <div class="row mb-25">
            <NodeChartAvailability :session="session" />
            <NodeChartRequests :session="session" />
          </div>
          <div class="row mb-25">
            <NodeChartDataInOut :session="session" />
          </div>
      </div>
      <div v-else-if="!$route.params.nodeAddress" class="container">
        <div class="checkbox-container" @click="updateHideOfflineNodes" >
          <label>Hide Offline Nodes</label>
          <input type="checkbox" :checked="hideOfflineNodes" />
          <span class="checkmark"></span>
        </div>
        <NodesTable
          :hideOfflineNodes="hideOfflineNodes"
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
            Try searching for a different node, or <router-link to="/nodes" class="underline hover:text-green">view all nodes</router-link>.
          </p>
          <router-link to="/nodes">
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
import NodeChartAvailability from "@/components/NodeChartAvailability"
import NodeChartRequests from "@/components/NodeChartRequests"
import NodeChartDataInOut from "@/components/NodeChartDataInOut"
import NodeOverview from "@/components/NodeOverview"
import NodeSummary from "@/components/NodeSummary"
import NodesTable from "@/components/NodesTable"

const nodeRefreshInterval = 5 * 1000
const numRegEx = /^[-+]?\d*$/

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
    NodeChartAvailability,
    NodeChartRequests,
    NodeChartDataInOut,
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
    hideOfflineNodes() {
      return this.$route.query.hideOffline === '1'
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
    updateHideOfflineNodes() {
      const hideOffline = !this.hideOfflineNodes ? 1 : undefined
      const query = { ...this.$route.query, hideOffline }
      this.$router.replace({ query })
    },
    async updateSession() {
      if (!this.address) return
      this.loading = true
      try {
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
      } catch (e) {
        this.session = null
        clearInterval(this.iSession)
        this.loaded = true
        this.loading = false
        return
      }
    }
  },
  watch: {
    $route (to, from) {
      this.updateSession()
    },
    metadata() {
      if (this.$route.query.page) {
        if (this.$route.query.page < 1 || !numRegEx.test(this.$route.query.page)) this.$router.replace({ query: { ...this.$route.query, page: 1 } })
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
