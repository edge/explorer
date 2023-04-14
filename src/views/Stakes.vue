<template>
  <div class="flex flex-col h-full">
    <Header />
    <HeroPanel v-if="stakeId" :title="'Stake'" :stakeId="stakeId" />
    <HeroPanel v-else :title="'Stakes'" />

    <div class="flex-1 bg-gray-200 py-35">
      <div v-if="stake && stakeId" class="container">
        <div v-if="stake && lastTx">
          <div class="row mb-25">
            <StakeOverview :stake="stake" :tx="lastTx" />
            <StakeSummary :stake="stake" :tx="lastTx" />
          </div>
          <div v-if="rawData" class="mb-25">
          <RawData :rawData="rawData" />
        </div>
          <div class="txs-row mb-25">
            <div>
              <h3>Transactions</h3>
              <TransactionsTable />
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="!$route.params.stakeId" class="container">
        <div class="checkbox-container" @click="updateHideReleasedStakes" >
          <label>Hide Released Stakes</label>
          <input type="checkbox" :checked="hideReleasedStakes" />
          <span class="checkmark"></span>
        </div>
        <StakesTable
          :hideReleasedStakes="hideReleasedStakes"
          :limit="limit"
          :receiveMetadata="onStakesUpdate"
          :page="currentPage"
          :sortable="true"
        />
        <Pagination
          v-if="metadata.totalCount > limit"
          baseRoute="Stakes"
          :currentPage="currentPage"
          :limit="limit"
          :totalCount="metadata.totalCount"
        />
      </div>
      <div v-else class="container h-full">
        <div v-if="!loading" class="flex flex-col items-center justify-center h-full">
          <h1 class="m-0 mt-20 text-2xl font-bold">This stake doesn't exist</h1>
          <p class="mt-5 mb-0 text-center monospace">
            Try searching for a different stake, or <router-link to="/stakes" class="underline hover:text-green">view all stakes</router-link>.
          </p>
          <router-link to="/stakes">
            <a class="mt-20 button button--solid">View all stakes</a>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header.vue"
import HeroPanel from "@/components/HeroPanel.vue"
import Pagination from "@/components/Pagination.vue";
import RawData from "@/components/RawData.vue"
import StakeOverview from "@/components/StakeOverview.vue"
import StakeSummary from "@/components/StakeSummary.vue"
import StakesTable from "@/components/StakesTable.vue"
import TransactionsTable from "@/components/TransactionsTable.vue"

import { fetchStake, fetchStakeHistory } from '../utils/api'
import { xeStringFromMicroXe } from '@edge/wallet-utils'

const numRegEx = /^[-+]?\d*$/

export default {
  name: 'Stakes',
  title() {
    if (window.location.href.indexOf('/stake/') > 0) {
      const parts = window.location.href.split('/')
      return 'Stake ' + this.sliceString(parts[parts.length - 1], 7)
    }

    return 'Stakes'
  },
  data: function () {
    return {
      lastTx: null,
      limit: 20,
      loading: false,
      metadata: { totalCount: 0 },
      rawData: null,
      stake: null,
      txs: []
    }
  },
  components: {
    Header,
    HeroPanel,
    Pagination,
    RawData,
    StakeOverview,
    StakeSummary,
    StakesTable,
    TransactionsTable
  },
  mounted() {
    if (this.$route.params.stakeId) {
      this.fetchData()
    }
  },
  computed: {
    baseRoute() {
      return this.$route.params.stakeId ? 'Stake' : 'Stakes'
    },
    currentPage() {
      return Math.max(1, parseInt(this.$route.query.page) || 1)
    },
    hideReleasedStakes() {
      return this.$route.query.hideReleased === '1' || false
    },
    lastPage() {
      return Math.max(1, Math.ceil(this.metadata.totalCount / this.limit))
    },
    stakeId() {
      return this.$route.params.stakeId || null
    }
  },
  methods: {
    async fetchData() {
      this.loading = true
      const stake = await fetchStake(this.stakeId)
      this.stake = stake
      await this.fetchStakeTxs(this.stakeId)
      this.rawData = stake
      this.loading = false
    },
    sliceString(string, symbols) {
      return string.length > symbols ? `${string.slice(0, symbols)}…` : string;
    },
    async fetchStakeTxs() {
      const { results: transactions } = await fetchStakeHistory(this.stake.id)
      if (transactions.length < 0) return
      const lastTx = transactions.find(tx => tx.hash === this.stake.transaction)
      if (lastTx !== undefined) this.lastTx = lastTx
      this.txs = transactions.map(tx => ({
        address: tx.sender === lastTx.recipient ? tx.recipient : tx.sender,
        amount: xeStringFromMicroXe(tx.amount),
        date: new Date(tx.timestamp).toLocaleString(), // '16/04/2021 13:06',
        memo: tx.data.memo,
        hash: tx.hash,
        recipient: tx.recipient,
        sender: tx.sender,
        timestamp: tx.timestamp,
        type: tx.sender === lastTx.recipient ? 'Sent' : 'Received',
        confirmations: tx.confirmations,
        block: tx.block,
        pending: false
      })).sort((a, b) => b.timestamp - a.timestamp)
    },
    onStakesUpdate(metadata) {
      this.metadata = metadata
    },
    updateHideReleasedStakes() {
      const hideReleased = !this.hideReleasedStakes ? 1 : undefined
      const query = { ...this.$route.query, hideReleased }
      this.$router.replace({ query })
    }
  },
  watch: {
    $route (to, from) {
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
