<template>
  <div class="flex flex-col h-full">
    <h3>Wallet Summary</h3>
    <div class="relative max-h-full tile md:pr-50">
      The wallet with address <span class="emphasis">{{ wallet && wallet.address }}</span> has a balance of <span class="emphasis">{{ formatAmount(wallet ? wallet.balance : 0) }}</span> XE. It has <span class="emphasis">{{ wallet ? wallet.transactions : 0  }}</span> {{ wallet && wallet.transactions === 1 ? 'transaction' : 'transactions' }} associated with it. The nonce is <span class="emphasis">{{ wallet ? wallet.nonce : 0  }}</span>.
    </div>
  </div>
</template>

<script>
const { xeStringFromMicroXe } = require('@edge/wallet-utils')

export default {
  name: "WalletSummary",
  props: {
    wallet: {
      type: Object
    }
  },
  methods: {
    formatAmount(amount) {
      return xeStringFromMicroXe(amount, true)
    }
  }
}
</script>

<style scoped>
  .tile {
    @apply flex-1 p-12 md:p-24 text-sm text-gray-300 bg-white rounded;
  }
  .tile span.emphasis {
    @apply text-gray-900 font-medium font-mono;
  }
  button {
    @apply leading-none text-sm2 border-b border-black border-opacity-25 hover:border-green hover:border-opacity-25 hover:text-green align-middle;
  }
</style>
