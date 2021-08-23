<template>
  <div class="flex flex-col h-full">
    <h3>Block Summary</h3>
    <div class="relative max-h-full tile md:pr-50">
      Block <span class="emphasis">{{ block.height }}</span> was mined on <span class="emphasis">{{new Date(block.timestamp).toLocaleString().split(',')[0]}}</span> at <span class="emphasis">{{new Date(block.timestamp).toLocaleString().split(',')[1]}}</span>.

      <span v-if="block.total == 0">
        No transactions were sent in this block.
      </span>
      <span v-else>
        A total of <span class="emphasis">{{ formatAmount(block.total) }} XE</span> was sent in this block over <span class="emphasis">{{ block.transactions.length }}</span> {{ block.transactions.length === 1 ? 'transaction' : 'transactions' }} with an average value of <span class="emphasis">{{ formatAmount(block.average) }} XE</span>.
      </span>

      The block nonce was <span class="emphasis">{{ block.nonce }}</span>.
    </div>
  </div>
</template>

<script>
const { formatXe } = require('@edge/wallet-utils')

export default {
  name: "BlockSummary",
  props: {
    block: {
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
  .tile {
    @apply flex-1 p-12 md:p-24 text-sm text-gray-300 bg-white rounded;
  }
  .tile span.emphasis {
    @apply text-black font-medium font-mono;
  }
  button {
    @apply leading-none text-sm2 border-b border-black border-opacity-25 hover:border-green hover:border-opacity-25 hover:text-green align-middle;
  }
</style>
