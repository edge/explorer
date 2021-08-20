<template>
  <div class="flex flex-col h-full">
    <h3>Transaction Summary</h3>
    <div class="tile">
      This transaction was mined on <span>{{new Date(transaction.timestamp).toLocaleString().split(',')[0]}}</span> at <span>{{new Date(transaction.timestamp).toLocaleString().split(',')[1]}}</span>.
      A total of <span>{{transaction.amount}} XE</span> were sent.
    </div>
  </div>
</template>

<script>

export default {
  name: "TransactionSummary",
  props: {
    transaction: {
      type: Object
    }
  }
}
</script>

<style scoped>
  .tile {
    @apply flex-1 p-12 md:p-24 text-sm text-gray-300 bg-white rounded md:pr-50;
  }
  .tile span {
    @apply text-black font-medium font-mono;
  }
</style>
