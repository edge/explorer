<template>
  <div class="hero-panel">
    <div class="container">
      <h1 class="hero-panel__title">The XE blockchain explorer</h1>
      <div class="relative flex w-full lg:pr-24 lg:w-1/2">
        <span class="absolute flex items-center flex-shrink-0 h-full text-gray-400 pointer-events-none left-10 w-18">
          <SearchIcon />
        </span>
        <input class="input" type="text" placeholder="Search Tx or Block ID" />
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
  @apply bg-white w-full text-black rounded-r-none border-none pl-32 !important;
}
</style>
