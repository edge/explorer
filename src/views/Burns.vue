<template>
  <div class="flex flex-col h-full">
    <Header />
    <HeroPanel v-if="hash" :title="'Burn'" :hash="hash" />
    <HeroPanel v-else :title="'Burns'" />

    <div class="flex-1 bg-gray-200 py-35">
      <div v-if="burn" class="container">
        <div v-if="burn" class="row mb-25">
          <BurnOverview :burn="burn" />
          <BurnSummary :burn="burn" />
        </div>

        <div v-if="rawData" class="mb-25">
          <RawData :rawData="rawData" />
        </div>
      </div>
      <div v-else-if="!hash" class="container">
        <BurnsTable
          :limit="limit"
          :receiveMetadata="onBurnsUpdate"
          :page="currentPage"
        />
        <Pagination
          v-if="metadata.totalCount > limit"
          baseRoute="Burns"
          :currentPage="currentPage"
          :limit="limit"
          :totalCount="metadata.totalCount"
        />
      </div>
      <div v-else class="container h-full">
        <div v-if="!loading" class="flex flex-col items-center justify-center h-full">
          <h1 class="m-0 mt-20 text-2xl font-bold">This burn doesn't exist</h1>
          <p class="mt-5 mb-0 text-center monospace">
            Try searching for a different burn, or <router-link to="/burns" class="underline hover:text-green">view all burns</router-link>.
          </p>
          <router-link to="/burns">
            <a class="mt-20 button button--solid">View all burns</a>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/*global process*/
import * as index from '@edge/index-utils'
import Header from "@/components/Header.vue"
import HeroPanel from "@/components/HeroPanel.vue"
import Pagination from "@/components/Pagination.vue";
import RawData from "@/components/RawData.vue"
import BurnOverview from "@/components/BurnOverview.vue"
import BurnSummary from "@/components/BurnSummary.vue"
import BurnsTable from "@/components/BurnsTable.vue"
import { fetchTransactions, fetchExchangeTransaction } from '../utils/api'

const numRegEx = /^[-+]?\d*$/

export default {
  name: 'Burns',
  title() {
    if (window.location.href.indexOf('/burn/') > 0) {
      const parts = window.location.href.split('/')
      return 'Burn ' + this.sliceString(parts[parts.length - 1], 7)
    }

    return 'Burns'
  },
  data: function () {
    return {
      burn: null,
      limit: 20,
      loading: false,
      metadata: { totalCount: 0 },
      pollInterval: 10000,
      polling: null,
      rawData: null
    }
  },
  components: {
    BurnOverview,
    BurnSummary,
    BurnsTable,
    Header,
    HeroPanel,
    Pagination,
    RawData
  },
  computed: {
    currentPage() {
      return Math.max(1, parseInt(this.$route.query.page) || 1)
    },
    lastPage() {
      return Math.max(1, Math.ceil(this.metadata.totalCount / this.limit))
    },
    hash() {
      return this.$route.params.burnHash
    },
    isBurnPending() {
      return this.burn.pending
    }
  },
  mounted() {
    if (this.hash) {
      this.fetchData().then(() => {
        this.pollData()
      })
    }
  },
  methods: {
    beforeDestroy() {
      clearInterval(this.polling)
    },
    async fetchData() {
      this.loading = true

      if (this.hash) {
        const burn = await index.burn.burn(
        import.meta.env.VITE_INDEX_API_URL,
        this.hash
      )

        this.burn = burn
        this.rawData = { ...burn }

        this.loading = false
      }
    },
    onBurnsUpdate(metadata) {
      this.metadata = metadata
    },
    pollData() {
      this.polling = setInterval(() => {
        this.fetchData()
      }, this.pollInterval)
    },
    sliceString(string, symbols) {
      return string.length > symbols ? `${string.slice(0, symbols)}…` : string;
    }
  },
  watch: {
    $route (to, from) {
      // When the route changes, stops polling for new data.
      this.beforeDestroy()
      this.fetchData()
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
</style>
