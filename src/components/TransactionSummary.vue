<template>
  <div class="flex flex-col h-full">
    <h3>Transaction Summary</h3>
    <div class="tile">
      This block was mined on <span>{{ transaction.date }}</span> at <span>{{ transaction.timestamp }}</span>. A total of <span>{{ transaction.amouunt }} XE</span> were sent in the block.
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
    @apply text-black font-medium;
  }
</style>
