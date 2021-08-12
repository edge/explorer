<template>
  <div class="flex flex-col h-full">
    <h3>Transaction Summary</h3>
    <div class="tile">
      This block was mined on <span>{{ block.completed }}</span> at <span>{{ block.timestamp }}</span>. It currently has <span>{{ block.confirmations }} confirmations</span> on the XE blockchain. A total of <span>{{ block.transactions }} XE</span> were sent in the block with the average transaction being <span>{{ block.average }} XE</span>.
    </div>
  </div>
</template>

<script>

export default {
  name: "BlockTransactionSummary",
  props: {
    block: {
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
