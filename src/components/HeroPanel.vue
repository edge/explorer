<template>
  <div class="hero-panel">
    <div class="container flex flex-col md:justify-between md:flex-row md:items-center">
      <h1 class="hero-panel__title">{{ title }}</h1>
      <Search />
    </div>
  </div>
</template>

<script>

import Search from '@/components/Search'

export default {
  name: "HeroPanel",
  props: {
    title: {
      type: String
    }
  },
  components: {
    Search
  },
}
</script>

<style scoped>
.hero-panel {
  @apply bg-black-100 pb-20 pt-64;
}
.hero-panel__title {
  @apply text-white text-2xl font-normal leading-none mb-0;
}
</style>
