<template>
  <div class="hero-panel">
    <div class="container">
      <h1 class="hero-panel__title">{{ title }}</h1>
      <Search size="large" />
    </div>

  </div>
</template>

<script>
import {
  SearchIcon
} from '@heroicons/vue/solid'
import Search from '@/components/Search.vue'

export default {
  name: "SummaryHero",
  components: {
    Search,
    SearchIcon
  },
  data() {
    return {
      title: import.meta.env.VITE_IS_TESTNET === 'true' ? 'Search the XE Testnet' : 'Search the XE Blockchain'
    }
  }
}
</script>

<style scoped>
.hero-panel {
  @apply bg-black-100 pb-24 pt-40 md:pb-40;
}
.hero-panel__title {
  @apply text-white text-2xl font-normal leading-none mb-12;
}
.input {
  @apply bg-white text-black rounded-r-none border-none !important;
}
</style>
