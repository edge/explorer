<template>
  <div class="w-full">
    <h3>{{ title }}</h3>
    <div class="grid w-full grid-cols-2 gap-2 md:grid-cols-2" v-if="blockMetadata && stats && transactionMetadata">
      <div class="stat">
        <span class="stat__label">Blocks <span class="text-gray-400">Total</span></span>
        <span class="stat__value">{{Number(blockMetadata.totalCount).toLocaleString()}}</span>
      </div>
      <div class="stat">
        <span class="stat__label">Blocks <span class="text-gray-400">last 24 hrs</span></span>
        <span class="stat__value">{{blockMetadata.recentBlocksCount && Number(blockMetadata.recentBlocksCount).toLocaleString()}}&nbsp;</span>
      </div>
      <div class="stat">
        <span class="stat__label">Transactions <span class="text-gray-400">Total</span></span>
        <span class="stat__value">{{Number(transactionMetadata.totalCount).toLocaleString()}}</span>
      </div>
      <div class="stat">
        <span class="stat__label">Transactions <span class="text-gray-400">last 24 hrs</span></span>
        <span class="stat__value">{{transactionMetadata.recentTransactionsCount && Number(transactionMetadata.recentTransactionsCount).toLocaleString()}}</span>
      </div>
      <div class="stat">
        <span class="stat__label">Block Time <span class="text-gray-400">avg</span></span>
        <span class="stat__value">{{calculateBlockTime(blockMetadata)}}s</span>
      </div>
      <div class="stat">
        <span class="stat__label">Blocks / Hour <span class="text-gray-400">avg</span></span>
        <span class="stat__value">{{calculateBlocksPerHour(blockMetadata)}}</span>
      </div>
      <div class="stat" v-if="stats.stakes">
        <span class="stat__label">Stakes <span class="text-gray-400">Total</span></span>
        <span class="stat__value">{{stats.stakes.count}}</span>
      </div>
      <div class="stat" v-if="stats.stakes">
        <span class="stat__label">Staked XE <span class="text-gray-400">{{stakedPercent()}}% of supply</span></span>
        <span class="stat__value">{{stakedAmount()}}</span>
      </div>
      <div class="stat additional" v-if="stats.earnings">
        <span class="stat__label">XE Earned <span class="text-gray-400">total</span></span>
        <span class="stat__value">
          <div class="w-24 text-gray-600"><EarnIcon /></div>
          <span>{{paymentsTotal}}</span>
        </span>
      </div>
      <div class="stat additional" v-if="stats.earnings">
        <span class="stat__label">XE Earned <span class="text-gray-400">last 24 hrs</span></span>
        <span class="stat__value">
          <div class="w-24 text-gray-600"><EarnIcon /></div>
          <span>{{payments24Hours}}</span>
        </span>
      </div>
      <div class="stat additional" v-if="stats.burns">
        <span class="stat__label">XE Burned <span class="text-gray-400">total</span></span>
        <span class="stat__value">
          <div class="w-24"><BurnIcon /></div>
          <span>{{burnedTotal}}</span>
        </span>
      </div>
      <div class="stat additional" v-if="stats.burns">
        <span class="stat__label">XE Burned <span class="text-gray-400">last 30 days</span></span>
        <span class="stat__value">
          <div class="w-24"><BurnIcon /></div>
          <span>{{burned30Days}}</span>
        </span>
      </div>
    </div>
    <div class="tile md:pr-50" v-else>
      Loading statistics...
    </div>
  </div>
</template>

<script>
import BurnIcon from './BurnIcon.vue'
import EarnIcon from './EarnIcon.vue'
import { formatXe } from '@edge/wallet-utils'

const totalSupplyMXE = 51000000 * 1e6

export default {
  name: 'Statistics',
  props: ['blockMetadata', 'stats', 'transactionMetadata'],
  components: {
    BurnIcon,
    EarnIcon
  },
  data() {
    return {
      title: process.env.VUE_APP_IS_TESTNET === 'true' ? 'TESTNET STATISTICS' : 'MAINNET STATISTICS'
    }
  },
  computed: {
    burned30Days() {
      return formatXe(this.stats.burns['30d'].amount / 1e6, true).replace(/\.?[0-9]+$/, '')
    },
    burnedTotal() {
      return formatXe(this.stats.burns.total.amount / 1e6, true).replace(/\.?[0-9]+$/, '')
    },
    payments24Hours() {
      return formatXe(this.stats.earnings['24h'].amount / 1e6, true).replace(/\.?[0-9]+$/, '')
    },
    paymentsTotal() {
      return formatXe(this.stats.earnings.allTime.amount / 1e6, true).replace(/\.?[0-9]+$/, '')
    }
  },
  methods: {
    calculateBlocksPerHour(blockMetadata) {
      if (!blockMetadata || !blockMetadata.recentBlocksCount) {
        return 0
      }

      return Number(blockMetadata.recentBlocksCount / 24).toFixed(2)
    },
    calculateBlockTime(blockMetadata) {
      if (!blockMetadata || !blockMetadata.recentBlocksCount) {
        return 0
      }

      return Number((1440 / blockMetadata.recentBlocksCount) * 60).toFixed(0)
    },
    stakedAmount() {
      return formatXe(this.stats.stakes.stakedAmount / 1e6, true).replace(/\.?0+$/, '')
    },
    stakedPercent() {
      const dec = this.stats.stakes.stakedAmount / totalSupplyMXE
      if (dec < 0.01) return "< 1"
      return Math.round(dec * 1000) / 10
    }
  }
}
</script>

<style scoped>
.tile {
  @apply flex-1 p-12 md:p-24 text-sm bg-white rounded;
  text-align: center;
}

.stat {
  @apply p-12 bg-white rounded flex flex-col;
  @apply md:p-16 lg:p-24;
}
.stat.additional {
  @apply lg:hidden
}
.stat__label {
  @apply truncate;
}
.stat__value {
  @apply text-green text-2xl md:text-3xl leading-none mt-1 flex items-center space-x-4;
}
</style>
