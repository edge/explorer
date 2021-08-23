<template>
  <div class="flex flex-col h-full">
    <h3>Transaction Summary</h3>
    <div class="tile">
      This transaction was sent on <span class="emphasis">{{new Date(transaction.timestamp).toLocaleString().split(',')[0]}}</span> at <span class="emphasis">{{new Date(transaction.timestamp).toLocaleString().split(',')[1]}}</span>. It was first confirmed in block <span class="emphasis">{{ transaction.block.height }}</span>.
      A total of <span class="emphasis">{{formatAmount(transaction.amount)}} XE</span> was sent.

      <span v-if="!transaction.memo">
        It did not contain a memo.
      </span>
      <span v-else>
        The transaction had a memo that read <span class="emphasis">{{transaction.memo}}</span>.
      </span>
    </div>
  </div>
</template>

<script>
const { formatXe } = require('@edge/wallet-utils')

export default {
  name: "TransactionSummary",
  props: {
    transaction: {
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
    @apply flex-1 p-12 md:p-24 text-sm text-gray-300 bg-white rounded md:pr-50;
  }
  .tile span.emphasis {
    @apply text-gray-900 font-medium font-mono;
  }
</style>
