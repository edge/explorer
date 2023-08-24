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
          <NodeChartTimeToggle :period="chartPeriod" :onPeriodUpdate="updateChartPeriod" />
          <div v-if="isGateway || isStargate" class="row full mb-25">
            <NodeChartAvailability
              v-if="sessionStats.length"
              :data="chartAvailabilityMetrics"
              :xLabel="xLabel"
              :timeSeries="timeSeries"
              :height="isSmView ? 400 : isMdView ? 200 : 100"
              :pointRadius="isSmView ? 2 : 3"
            />
          </div>
          <div v-if="isGateway || isStargate" class="mb-35">
            <h3>Connected {{ isGateway ? 'Hosts' : 'Gateways'}}</h3>
            <NodesTable
              :hideOfflineNodes="hideOfflineNodes"
              :limit="limit"
              :receiveMetadata="onSessionsUpdate"
              :page="currentPage"
              :parentNode="session.node.address"
              :sortable="true"
            />
            <Pagination
              v-if="metadata.totalCount > limit"
              baseRoute="Node"
              :currentPage="currentPage"
              :limit="limit"
              :totalCount="metadata.totalCount"
            />
          </div>
          <div v-else>
            <div class="row mb-25">
              <NodeChartAvailability
                v-if="sessionStats.length"
                :data="chartAvailabilityMetrics"
                :xLabel="xLabel"
                :timeSeries="timeSeries"
                :height="isSmView ? 400 : 200"
                :pointRadius="isSmView ? 2 : 3"
              />
              <NodeChartRequests
                v-if="sessionStats.length"
                :data="chartRequestsMetrics"
                :xLabel="xLabel"
                :timeSeries="timeSeries"
                :height="isSmView ? 400 : 200"
                :pointRadius="isSmView ? 2 : 3"
              />
            </div>
            <div class="row full mb-25">
              <NodeChartDataInOut
                v-if="sessionStats.length"
                :dataIn="chartDataInMetrics"
                :dataOut="chartDataOutMetrics"
                :xLabel="xLabel"
                :timeSeries="timeSeries"
                :height="isSmView ? 400 : isMdView ? 200 : 100"
                :pointRadius="isSmView ? 2 : 3"
                :yLabel="isChartDataMb ? 'Data (MB)' : 'Data (KB)'"
              />
            </div>
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
import moment from 'moment'
import { fetchSessionStats } from '../utils/api'
import Header from "@/components/Header.vue"
import HeroPanel from "@/components/HeroPanel.vue"
import Pagination from "@/components/Pagination.vue"
import NodeChartAvailability from "@/components/NodeChartAvailability.vue"
import NodeChartDataInOut from "@/components/NodeChartDataInOut.vue"
import NodeChartRequests from "@/components/NodeChartRequests.vue"
import NodeChartTimeToggle from "@/components/NodeChartTimeToggle.vue"
import NodeOverview from "@/components/NodeOverview.vue"
import NodeSummary from "@/components/NodeSummary.vue"
import NodesTable from "@/components/NodesTable.vue"

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
      loading: false,
      metadata: { totalCount: 0 },
      session: null,
      sessionStats: [],
      timeSeries: [],
      iSession: null
    }
  },
  components: {
    Header,
    HeroPanel,
    Pagination,
    NodeChartAvailability,
    NodeChartDataInOut,
    NodeChartRequests,
    NodeChartTimeToggle,
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
    chartAvailabilityMetrics() {
      return this.sessionStats.map(step => step.uptime * 100 / this.maxUptime).reverse()
    },
    chartDataInMetrics() {
      return this.sessionStats.map(step => {
        if (this.isChartDataMb) return step.metrics.cdn.data.in / 1000000
        else return step.metrics.cdn.data.in / 1000
      }).reverse()
    },
    chartDataOutMetrics() {
      return this.sessionStats.map(step => {
        if (this.isChartDataMb) return step.metrics.cdn.data.out / 1000000
        else return step.metrics.cdn.data.out / 1000
      }).reverse()
    },
    chartPeriod() {
      const period = this.$route.query.period
      const validPeriods = ['day', 'week', 'month']
      if (validPeriods.includes(period)) return this.$route.query.period
      else return 'day'
    },
    chartRange() {
      if (this.chartPeriod == 'day') return 'hourly'
      else return 'daily'
    },
    chartRequestsMetrics() {
      return this.sessionStats.map(step => step.metrics.cdn.requests).reverse()
    },
    chartSteps() {
      if (this.chartPeriod == 'day') return 24
      if (this.chartPeriod == 'week') return 7
      if (this.chartPeriod == 'month') return 30
      return 24
    },
    currentPage() {
      return Math.max(1, parseInt(this.$route.query.page) || 1)
    },
    hideOfflineNodes() {
      // query string uses showOffline rather than hideOffline so default (no query) is for hide offline to be selected
      return this.$route.query.showOffline !== '1'
    },
    isChartDataMb() {
      return this.sessionStats.some(el => el.metrics.cdn.data.in + el.metrics.cdn.data.out > 1000000)
    },
    isSmView() {
      return window.innerWidth < 640
    },
    isMdView() {
      return window.innerWidth >= 640 && window.innerWidth < 1000
    },
    isGateway() {
      return this.session && this.session.node.type === 'gateway'
    },
    isStargate() {
      return this.session && this.session.node.type === 'stargate'
    },
    lastPage() {
      return Math.max(1, Math.ceil(this.metadata.totalCount / this.limit))
    },
    limit() {
      return this.address ? 5 : 20
    },
    maxUptime() {
      if (this.chartPeriod === 'day') return 3600 * 1000
      return 86400 * 1000
    },
    xLabel() {
      if (this.chartPeriod === 'day') return 'Time'
      if (this.chartPeriod === 'week') return 'Day'
      if (this.chartPeriod === 'month') return 'Date'
      return 'Time'
    }
  },
  methods: {
    onSessionsUpdate(metadata) {
      this.metadata = metadata
    },
    sliceString(string, symbols) {
      return string.length > symbols ? `${string.slice(0, symbols)}…` : string;
    },
    updateChartPeriod(newPeriod) {
      const query = { ...this.$route.query, period: newPeriod}
      this.$router.replace({ query })
    },
    updateHideOfflineNodes() {
      // query string uses showOffline rather than hideOffline so default (no query) is for hide offline to be selected
      const showOffline = this.hideOfflineNodes ? 1 : undefined
      const query = { ...this.$route.query, showOffline }
      this.$router.replace({ query })
    },
    async updateSessionStats() {
      const options = {
        range: this.chartRange,
        count: this.chartSteps
      }
      const snapshots = await fetchSessionStats(this.address, options)
      await this.updateTimeSeries(snapshots.results)
      this.sessionStats = snapshots.results
    },
    async updateSession() {
      if (!this.address) return
      this.loading = true
      try {
        const session = await index.session.session(
          import.meta.env.VITE_INDEX_API_URL,
          this.address
        )
        // add gateway (if host) and stargate (if host/gateway) data to the node data
        if (session.node.type === 'host') {
          const gateway = await index.session.session(import.meta.env.VITE_INDEX_API_URL, session.node.gateway)
          session.gateway = gateway
          const stargate = await index.session.session(import.meta.env.VITE_INDEX_API_URL, gateway.node.stargate)
          session.stargate = stargate
        }
        else if (session.node.type === 'gateway') {
          const stargate = await index.session.session(import.meta.env.VITE_INDEX_API_URL, session.node.stargate)
          session.stargate = stargate
        }
        // add wallet address to node data
        const stake = await index.stake.stake(import.meta.env.VITE_INDEX_API_URL, session.node.stake)
        session.node.wallet = stake.wallet

        this.session = session

        // update metrics for charts
        await this.updateSessionStats()

        this.loaded = true
        this.loading = false
      } catch (e) {
        this.session = null
        clearInterval(this.iSession)
        this.loaded = true
        this.loading = false
        return
      }
    },
    updateTimeSeries(stats) {
      let latestSnapshotPeriod = new Date(stats[0].end)
      if (this.chartPeriod === 'day') {
        const hourLabels = []
        for (let i = 0; i < 24; i++) {
          hourLabels.unshift(moment(latestSnapshotPeriod).subtract(i, 'hours').format('LT'))
        }
        this.timeSeries = hourLabels
      }
      if (this.chartPeriod === 'week') {
        const dayLabels = []
          for (let i = 0; i < 7; i++) {
            dayLabels.unshift(moment(latestSnapshotPeriod).subtract(i + 1, 'days').format('ddd'))
          }
          this.timeSeries = dayLabels
      }
      if (this.chartPeriod === 'month') {
        const dateLabels = []
        for (let i = 0; i < 30; i++) {
          dateLabels.unshift(moment(latestSnapshotPeriod).subtract(i + 1, 'days').format('ll'))
        }
        this.timeSeries = dateLabels
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
    },
    chartPeriod() {
      this.updateSession()
    }
  }
}
</script>
<style scoped>
.row {
  @apply grid items-start grid-cols-1 gap-24;
  @apply lg:grid-cols-2;
}

.row.full {
  @apply lg:grid-cols-1
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
