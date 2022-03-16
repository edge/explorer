<template>
  <div class="flex flex-col h-full">
    <h3>Stake Overview</h3>

    <div class="flex flex-col flex-1 space-y-2">
      <div class="stakeRow">
        <div class="stakeRow__label">ID</div>
        <div class="stakeRow__value">
          {{ stake.id }}
        </div>
      </div>
      <div class="stakeRow">
        <div class="stakeRow__label">Hash</div>
        <div class="stakeRow__value">
          {{ stake.hash }}
        </div>
      </div>
      <div class="stakeRow" v-if="tx">
        <div class="stakeRow__label">Wallet</div>
        <div class="stakeRow__value">
          <router-link :to="{name: 'Wallet', params: {address: tx.recipient}}">
            {{ tx.recipient }}
          </router-link>
        </div>
      </div>
      <div class="stakeRow">
        <div class="stakeRow__label">Type</div>
        <div class="stakeRow__value">{{ stake.type.slice(0, 1).toUpperCase() + stake.type.slice(1) }}</div>
      </div>
      <div class="stakeRow" v-if="stake.device">
        <div class="stakeRow__label">Node</div>
        <div class="stakeRow__value">
          <router-link :to="{name: 'Node', params: {nodeAddress: stake.device}}">{{ stake.device }}</router-link>
        </div>
      </div>
      <div class="stakeRow">
        <div class="stakeRow__label">Amount</div>
        <div class="stakeRow__value">{{ formatAmount(stake.amount / 1e6) }} XE</div>
      </div>
    </div>

  </div>
</template>

<script>
import { CheckCircleIcon, ClockIcon } from '@heroicons/vue/outline'
import { InformationCircleIcon } from '@heroicons/vue/solid'
import Tooltip from '@/components/Tooltip'
import { formatXe } from '@edge/wallet-utils'

export default {
  name: "StakeOverview",
  components: {
    CheckCircleIcon,
    ClockIcon,
    InformationCircleIcon,
    Tooltip
  },
  props: {
    tx: {
      type: Object
    },
    stake: {
      type: Object
    }
  },
  methods: {
    formatAmount(amount) {
      return formatXe(amount, true)
    }
  }
}
</script>

<style scoped>
.stakeRow {
  @apply px-12 md:px-24 py-12 text-sm bg-white rounded w-full grid grid-cols-12 items-center;
}

.stakeRow .icon-green {
  @apply text-green;
}

.stakeRow .icon-grey {
  @apply text-gray-400;
}

.stakeRow__label {
  @apply col-span-4 md:col-span-3;
}

.stakeRow__value {
  @apply font-mono col-span-8 text-gray-300 md:col-span-9 truncate;
}

.stakeRow__value a {
  @apply leading-none border-b border-black border-opacity-25 hover:border-green hover:border-opacity-25 hover:text-green align-middle;
}
</style>
