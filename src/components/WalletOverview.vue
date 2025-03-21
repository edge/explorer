<template>
  <div class="flex flex-col h-full">
    <h3>Wallet Overview</h3>
    <div class="flex flex-col flex-1 space-y-2">
      <div class="overviewRow">
        <div class="overviewRow__label">Address</div>
        <div class="overviewRow__value">{{ wallet && wallet.address }}<BadgeCheckIcon v-if="wallet.trusted" class="trusted" /></div>
      </div>
      <div class="overviewRow">
        <div class="overviewRow__label flex items-center space-x-3">
          Balance
          <Tooltip
            class="ml-3 icon-grey" position="right"
            text="Available balance excluding stakes">
            <InformationCircleIcon class="hidden md:block button__icon w-16" />
          </Tooltip>
        </div>
        <div class="overviewRow__value">{{ formatAmount(wallet ? wallet.balance : 0) }} $EDGE<LockClosedIcon v-if="wallet.locked" class="locked" /></div>
      </div>
      <div v-if="wallet.stakedAmount" class="overviewRow">
        <div class="overviewRow__label flex items-center space-x-3">
          Staked
          <Tooltip
            class="ml-3 icon-grey" position="right"
            text="Current amount locked in stakes">
            <InformationCircleIcon class="hidden md:block button__icon w-16" />
          </Tooltip>
        </div>
        <div class="overviewRow__value">{{ formatAmount(wallet ? wallet.stakedAmount : 0) }} $EDGE</div>
      </div>
      <div class="overviewRow">
        <div class="overviewRow__label">Nonce</div>
        <div class="overviewRow__value">{{ wallet ? wallet.nonce : 0 }}</div>
      </div>
      <div class="overviewRow" v-if="wallet.name">
        <div class="overviewRow__label">Name</div>
        <div class="overviewRow__value">{{ wallet.name }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import * as xe from '@edge/xe-utils'
import { BadgeCheckIcon, LockClosedIcon } from '@heroicons/vue/solid'
import { InformationCircleIcon } from '@heroicons/vue/solid'
import Tooltip from '@/components/Tooltip.vue'

export default {
  name: 'WalletOverview',
  props: {
    wallet: {
      type: Object
    }
  },
  components: {
    BadgeCheckIcon,
    LockClosedIcon,
    InformationCircleIcon,
    Tooltip
  },
  methods: {
    formatAmount(amount) {
      return xe.xe.formatMxe(amount, true)
    }
  }
}
</script>

<style scoped>
  .trusted, .locked {
    @apply w-18 h-18 inline-block ml-2 -mt-2;
    &.trusted {
      @apply text-green;
    }
    &.locked {
      @apply text-yellow-400;
    }
  }
  .overviewRow {
    @apply px-12 md:px-24 py-12 text-sm bg-white rounded w-full grid grid-cols-12 items-center;
  }
  .overviewRow__label {
    @apply col-span-4 md:col-span-3;
  }
  .overviewRow__value {
    @apply font-mono col-span-8 md:col-span-9 text-gray-300 truncate;
  }
  .overviewRow__value a {
    @apply leading-none border-b border-black border-opacity-25 hover:border-green hover:border-opacity-25 hover:text-green align-middle;
  }

  .overviewRow .icon {
    @apply w-18 inline-block align-middle;
  }

  .overviewRow .icon-green {
    @apply text-green;
  }

  .overviewRow .icon-grey {
    @apply text-gray-400;
  }
</style>
