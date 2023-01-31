<template>
  <div class="w-full">
    <div class="grid w-full grid-cols-2 gap-2 md:grid-cols-2" v-if="stats">
      <div class="stat" v-if="stats.earnings">
        <span class="stat__label">
          <span>XE Earned</span>
          <span class="text-gray-400">total</span>
        </span>
        <span class="stat__value">
          <div class="w-24 text-gray-600"><EarnIcon /></div>
          <span>{{paymentsTotal}}</span>
        </span>
      </div>
      <div class="stat" v-if="stats.earnings">
        <span class="stat__label">
          <span>XE Earned</span>
          <span class="text-gray-400">last 24 hrs</span>
        </span>
        <span class="stat__value">
          <div class="w-24 text-gray-600"><EarnIcon /></div>
          <span>{{payments24Hours}}</span>
        </span>
      </div>
      <div class="stat" v-if="stats.burns">
        <span class="stat__label">
          <span>XE Burned</span>
          <span class="text-gray-400">total</span>
        </span>
        <span class="stat__value">
          <div class="w-24"><BurnIcon /></div>
          <span>{{burnedTotal}}</span></span>
      </div>
      <div class="stat" v-if="stats.burns">
        <span class="stat__label">
          <span>XE Burned</span>
          <span class="text-gray-400">last 30 days</span>
        </span>
        <span class="stat__value">
          <div class="w-24"><BurnIcon /></div>
          <span>{{burned30Days}}</span></span>
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

export default {
  name: 'StatisticsAdditional',
  props: ['stats'],
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
.stat__label {
  @apply truncate;
}
.stat__value {
  @apply text-green text-2xl md:text-3xl leading-none mt-1 flex items-center space-x-4;
}
</style>
