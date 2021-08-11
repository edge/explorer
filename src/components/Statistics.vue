<template>
  <div class="w-full">
    <h3>STATISTICS</h3>
    <div class="grid w-full grid-cols-2 gap-2 md:grid-cols-2">
      <div class="stat">
        <span class="stat__label">Blocks</span>
        <span class="stat__value">62,029</span>
      </div>
      <div class="stat">
        <span class="stat__label">Transactions</span>
        <span class="stat__value">719</span>
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
        <span class="stat__label">Wallets</span>
        <span class="stat__value">238</span>
      </div>
      <div class="stat">
        <span class="stat__label">Circulating supply</span>
        <span class="stat__value">7,241,239 <span class="text-lg">XE</span></span>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Statistics'
}
</script>

<style scoped>
.stat {
  @apply p-12 bg-white rounded flex flex-col;
  @apply md:p-16 lg:p-20;
}
.stat__label {}
.stat__value {
  @apply text-green text-3xl leading-none mt-1;
}
</style>
