<template>
  <div class="flex flex-col h-full">
    <h3>Wallet Overview</h3>
    <div class="flex flex-col flex-1 space-y-2">
      <div class="overviewRow">
        <div class="overviewRow__label">Address</div>
        <div class="overviewRow__value">{{ wallet && wallet.address }}<BadgeCheckIcon v-if="wallet.trusted" class="trusted" /></div>
      </div>
      <div class="overviewRow">
        <div class="overviewRow__label">Balance</div>
        <div class="overviewRow__value">{{ formatAmount(wallet ? wallet.balance : 0) }} XE</div>
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
const { xeStringFromMicroXe } = require('@edge/wallet-utils')
import { BadgeCheckIcon } from '@heroicons/vue/solid'

export default {
  name: 'WalletOverview',
  props: {
    wallet: {
      type: Object
    }
  },
  components: {
    BadgeCheckIcon
  },
  methods: {
    formatAmount(amount) {
      return xeStringFromMicroXe(amount, true)
    }
  }
}
</script>

<style scoped>
  .trusted {
    @apply w-18 h-18 inline-block ml-2 -mt-2 text-green;
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
</style>
