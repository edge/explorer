<template>
  <div class="flex flex-col h-full">
    <h3>Block Summary</h3>
    <div class="relative max-h-full tile md:pr-50">
      Block <span class="emphasis">{{ block.height }}</span> was mined on <span class="emphasis">{{new Date(block.timestamp).toLocaleString().split(',')[0]}}</span> at <span class="emphasis">{{new Date(block.timestamp).toLocaleString().split(',')[1]}}</span>.

      <span v-if="!block.txCount">
        No transactions were sent in this block.
      </span>
      <span v-else>
        A total of <span class="emphasis">{{ formatAmount(block.total) }} XE</span> was sent in this block over <span class="emphasis">{{ block.txCount.toLocaleString() }}</span> {{ block.txCount === 1 ? 'transaction' : 'transactions' }}<span v-if="block.txCount > 1"> with an average value of <span class="emphasis">{{ formatAmount(block.average) }} XE</span></span>.
      </span>

      The block nonce was <span class="emphasis">{{ block.nonce }}</span>.
    </div>
  </div>
</template>

<script>
import * as xe from '@edge/xe-utils'

export default {
  name: "BlockSummary",
  props: {
    block: {
      type: Object
    }
  },
  methods: {
    formatAmount(amount) {
      return xe.xe.formatMxe(amount, true)
    }
  }
}
</script>

<style scoped>
  .tile {
    @apply flex-1 p-12 md:p-24 text-sm text-gray-300 bg-white rounded break-words;
  }
  .tile span.emphasis {
    @apply text-gray-900 font-medium font-mono;
  }
  button {
    @apply leading-none text-sm2 border-b border-black border-opacity-25 hover:border-green hover:border-opacity-25 hover:text-green align-middle;
  }
</style>
