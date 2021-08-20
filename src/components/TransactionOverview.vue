<template>
  <div class="flex flex-col h-full">
    <h3>Transaction Overview</h3>

    <div class="flex flex-col flex-1 space-y-2">
      <div class="transactionRow">
        <div class="transactionRow__label">Hash</div>
        <div class="transactionRow__value">{{ transaction.hash }}</div>
      </div>
      <div class="transactionRow">
        <div class="transactionRow__label">Completed</div>
        <div class="transactionRow__value">{{new Date(transaction.timestamp).toLocaleString()}}</div>
      </div>
      <div class="transactionRow">
        <div class="transactionRow__label">From</div>
        <div class="transactionRow__value">{{transaction.sender}}</div>
      </div>
      <div class="transactionRow">
        <div class="transactionRow__label">To</div>
        <div class="transactionRow__value">{{transaction.recipient}}</div>
      </div>
      <div class="transactionRow">
        <div class="transactionRow__label">Amount</div>
        <div class="transactionRow__value">{{ formatAmount(transaction.amount) }} XE</div>
      </div>
      <div class="transactionRow">
        <div class="transactionRow__label">Memo</div>
        <div class="transactionRow__value">{{transaction.description}}</div>
      </div>
      <div class="transactionRow">
        <div class="transactionRow__label">Block</div>
        <div class="transactionRow__value">
          <router-link :to="{name: 'Block', params: {blockId: transaction.block.height}}">
            {{transaction.block.height}}
          </router-link>
        </div>
      </div>
      <div class="transactionRow">
        <div class="transactionRow__label">Block Hash</div>
        <div class="transactionRow__value">
          <router-link :to="{name: 'Block', params: {blockId: transaction.block.hash}}">
            {{transaction.block.hash}}
          </router-link>
        </div>
      </div>
      <div class="transactionRow">
        <div class="transactionRow__label">Confirmations</div>
        <div class="transactionRow__value">{{ transaction.confirmations }}</div>
      </div>
    </div>
  </div>
</template>

<script>
const { formatXe } = require('@edge/wallet-utils')

export default {
  name: "TransactionOverview",
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
  .transactionRow {
    @apply px-12 md:px-24 py-12 text-sm text-gray-300 bg-white rounded w-full grid grid-cols-12 items-center;
  }
  .transactionRow__label {
    @apply col-span-4 md:col-span-3;
  }
  .transactionRow__value {
    @apply font-mono col-span-8 md:col-span-9 text-black truncate;
  }
</style>