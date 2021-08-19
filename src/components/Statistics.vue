<template>
  <div class="w-full">
    <h3>STATISTICS</h3>
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
        <span class="stat__value">62,029</span>
      </div>
      <div class="stat">
        <span class="stat__label">Transactions <span class="text-gray-400">last 24 hrs</span></span>
        <span class="stat__value">24</span>
      </div>
      <div class="stat">
        <span class="stat__label">Block Time <span class="text-gray-400">avg</span></span>
        <span class="stat__value">62s</span>
      </div>
      <div class="stat">
        <span class="stat__label">Blocks / Hour <span class="text-gray-400">avg</span></span>
        <span class="stat__value">58</span>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Statistics',
  props: ['blockMetadata', 'transactionMetadata']
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
