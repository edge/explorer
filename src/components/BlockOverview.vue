<template>
  <div class="flex flex-col h-full">
    <h3>Block Overview</h3>
    <div class="flex flex-col flex-1 space-y-2">
      <div class="transactionRow">
        <div class="transactionRow__label">Average Transaction</div>
        <div class="transactionRow__value">{{ block.average }}</div>
      </div>
      <div class="transactionRow">
        <div class="transactionRow__label">Confirmations</div>
        <div class="transactionRow__value">{{ block.confirmations }}</div>
      </div>
      <div class="transactionRow">
        <div class="transactionRow__label">Completed</div>
        <div class="transactionRow__value">{{new Date(block.timestamp).toLocaleString()}}</div>
      </div>
      <div class="transactionRow">
        <div class="transactionRow__label">Transactions</div>
        <div class="transactionRow__value">{{ block.transactions.length }}</div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "BlockOverview",
  props: {
    block: {
      type: Object
    }
  }
}
</script>

<style scoped>
  .transactionRow {
    @apply px-12 md:px-24 py-12 text-sm text-gray-300 bg-white rounded w-full grid grid-cols-12 items-center;
  }
  .transactionRow__label {
    @apply col-span-5 md:col-span-4;
  }
  .transactionRow__value {
    @apply font-mono col-span-7 md:col-span-8 text-black truncate;
  }
</style>