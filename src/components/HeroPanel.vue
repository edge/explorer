<template>
  <div class="hero-panel">
    <div class="container flex flex-col justify-end h-full md:justify-between md:flex-row md:items-end">
      <div class="flex flex-col">
        <h1 class="hero-panel__title">{{ title }}</h1>
        <div class="max-w-md mt-10 font-mono text-white truncate lg:max-w-lg" :class="hash ? '' : 'hidden'">
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
  @apply bg-black-100 pb-24 md:pb-20 h-180 md:h-128;
}
.hero-panel__title {
  @apply text-white text-2xl font-normal leading-none mb-0;
}
</style>
