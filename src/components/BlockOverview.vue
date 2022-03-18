<template>
  <div class="flex flex-col h-full">
    <h3>Block Overview</h3>
    <div class="flex flex-col flex-1 space-y-2">
      <div class="transactionRow">
        <div class="transactionRow__label">Timestamp</div>
        <div class="transactionRow__value">{{new Date(block.timestamp).toLocaleString()}}</div>
      </div>
      <div class="transactionRow">
        <div class="transactionRow__label">Height</div>
        <div class="transactionRow__value">
          <router-link v-if="$route.params.blockId != block.height" :to="{name: 'Block', params: {blockId: block.height}}">
            {{ block.height }}
          </router-link>
          <span v-else>{{ block.height }}</span>
        </div>
      </div>
      <div class="transactionRow">
        <div class="transactionRow__label">Block Hash</div>
        <div class="transactionRow__value">
          <router-link v-if="$route.params.blockId != block.hash" :to="{name: 'Block', params: {blockId: block.hash}}">
            {{ block.hash }}
          </router-link>
          <span v-else>{{ block.hash }}</span>
        </div>
      </div>
      <div class="transactionRow">
        <div class="transactionRow__label">Parent Hash</div>
        <div class="transactionRow__value">
          <router-link :to="{name: 'Block', params: {blockId: block.parent}}">
            {{ block.parent }}
          </router-link>
        </div>
      </div>
      <div class="transactionRow">
        <div class="transactionRow__label">Data Hash</div>
        <div class="transactionRow__value">{{ block.dataHash }}</div>
      </div>
      <div class="transactionRow">
        <div class="transactionRow__label">Ledger Hash</div>
        <div class="transactionRow__value">{{ block.ledgerHash }}</div>
      </div>
      <div class="transactionRow">
        <div class="transactionRow__label">Transactions</div>
        <div class="transactionRow__value">{{ block.txCount }}</div>
      </div>
      <div class="transactionRow">
        <div class="transactionRow__label">Total XE</div>
        <div class="transactionRow__value">{{ formatAmount(block.total) }} XE</div>
      </div>
      <div class="transactionRow">
        <div class="transactionRow__label">Nonce</div>
        <div class="transactionRow__value">{{ block.nonce }}</div>
      </div>
    </div>
  </div>
</template>

<script>
const { formatXe } = require('@edge/wallet-utils')

export default {
  name: "BlockOverview",
  props: {
    block: {
      type: Object
    }
  },
  methods: {
    formatAmount(amount) {
      return formatXe(amount / 1e6, true)
    }
  }
}
</script>

<style scoped>
  .transactionRow {
    @apply px-12 md:px-24 py-12 text-sm bg-white rounded w-full grid grid-cols-12 items-center;
  }
  .transactionRow__label {
    @apply col-span-4 md:col-span-3;
  }
  .transactionRow__value {
    @apply font-mono col-span-8 md:col-span-9 text-gray-300 truncate;
  }
  .transactionRow__value a {
    @apply leading-none border-b border-black border-opacity-25 hover:border-green hover:border-opacity-25 hover:text-green align-middle;
  }
</style>
