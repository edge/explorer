<template>
  <div class="w-full">
    <h3>{{ title }}</h3>
    <div class="grid w-full grid-cols-2 gap-2 md:grid-cols-2">
      <div class="stat">
        <span class="stat__label">Blocks</span>
        <span class="stat__value">{{blockMetadata && Number(blockMetadata.totalCount).toLocaleString()}}</span>
      </div>
      <div class="stat">
        <span class="stat__label">Transactions</span>
        <span class="stat__value">{{transactionMetadata && Number(transactionMetadata.totalCount).toLocaleString()}}</span>
      </div>
      <div class="stat">
        <span class="stat__label">Blocks <span class="text-gray-400">last 24 hrs</span></span>
        <span class="stat__value">{{blockMetadata && blockMetadata.recentBlocksCount && Number(blockMetadata.recentBlocksCount).toLocaleString()}}&nbsp;</span>
      </div>
      <div class="stat">
        <span class="stat__label">Transactions <span class="text-gray-400">last 24 hrs</span></span>
        <span class="stat__value">{{transactionMetadata && transactionMetadata.recentTransactionsCount && Number(transactionMetadata.recentTransactionsCount).toLocaleString()}}</span>
      </div>
      <div class="stat">
        <span class="stat__label">Block Time <span class="text-gray-400">avg</span></span>
        <span class="stat__value">{{calculateBlockTime(blockMetadata)}}s</span>
      </div>
      <div class="stat">
        <span class="stat__label">Blocks / Hour <span class="text-gray-400">avg</span></span>
        <span class="stat__value">{{calculateBlocksPerHour(blockMetadata)}}</span>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Statistics',
  props: ['blockMetadata', 'transactionMetadata'],
  data() {
    return {
      title: process.env.VUE_APP_IS_TESTNET === 'true' ? 'TESTNET STATISTICS' : 'MAINNET STATISTICS'
    }
  },
  methods: {
    calculateBlocksPerHour(blockMetadata) {
      if (!blockMetadata || !blockMetadata.recentBlocksCount) {
        return 0
      }

      return Number(blockMetadata.recentBlocksCount / 24).toFixed(2)
    },
    calculateBlockTime(blockMetadata) {
      if (!blockMetadata || !blockMetadata.recentBlocksCount) {
        return 0
      }

      return Number((1440 / blockMetadata.recentBlocksCount) * 60).toFixed(0)
    }
  }
}
</script>

<style scoped>
.stat {
  @apply p-12 bg-white rounded flex flex-col;
  @apply md:p-16 lg:p-20;
}
.stat__label {
  @apply truncate;
}
.stat__value {
  @apply text-green text-2xl md:text-3xl leading-none mt-1;
}
</style>
