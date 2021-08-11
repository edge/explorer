<template>
  <div class="hero-panel">
    <div class="container">
      <h1 class="hero-panel__title">The XE blockchain explorer</h1>
      <div class="flex w-full mb-0 form-group lg:pr-24 lg:w-1/2">
        <div class="relative flex-1 input-wrap">
          <span class="pointer-events-none icon">
            <SearchIcon />
          </span>
          <input class="input" type="text" placeholder="Search Tx or Block ID" />
        </div>
        <button class="border-none rounded-l-none button button--success">Search</button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  SearchIcon
} from '@heroicons/vue/solid'

export default {
  name: "SummaryHero",
  components: {SearchIcon}
}
</script>

<style scoped>
.hero-panel {
  @apply bg-black-100 py-40;
}
.hero-panel__title {
  @apply text-white text-xl font-normal leading-none mb-12;
}
.input {
  @apply bg-white text-black rounded-r-none border-none !important;
}
</style>
