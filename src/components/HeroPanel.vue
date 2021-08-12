<template>
  <div class="hero-panel">
    <div class="container">
      <h1 class="hero-panel__title">{{ title }}Blocks</h1>
    </div>
  </div>
</template>

<script>
import {
  SearchIcon
} from '@heroicons/vue/solid'

export default {
  name: "HeroPanel",
  props: {
    title: {
      type: String
    }
  }
}
</script>

<style scoped>
.hero-panel {
  @apply bg-black-100 pb-10 pt-50;
}
.hero-panel__title {
  @apply text-white text-2xl font-normal leading-none mb-12;
}
.input {
  @apply bg-white text-black rounded-r-none border-none !important;
}
</style>
