<template>
  <div class="hero-panel">
    <div class="container flex flex-col md:justify-between md:flex-row md:items-center">
      <div class="flex flex-col">
        <h1 class="max-w-lg truncate hero-panel__title">{{ title }}</h1>
        <div class="max-w-lg mt-10 font-mono text-white truncate" :class="hash ? '' : 'hidden'">
          <span class="text-green">Hash: </span>
          {{ hash }}
        </div>
      </div>
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
    },
    hash: {
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
