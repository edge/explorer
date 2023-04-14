<template>
  <div class="hero-panel">
    <div class="container flex flex-col justify-end h-full md:justify-between md:flex-row md:items-end">
      <div class="flex flex-col">
        <h1 class="hero-panel__title">{{ title }}</h1>
        <div class="max-w-md mt-5 font-mono text-white truncate md:mt-10 lg:max-w-lg" >
          <div v-if="hash || thisHash">
            <span class="text-green">Hash: </span>
            {{ hash || thisHash }}
          </div>
          <div v-else-if="height">
            <span class="text-green">Height: </span>
            {{ height }}
          </div>
          <div v-else-if="address">
            <span class="text-green">Address: </span>
           {{ address }}
          </div>
        </div>
      </div>
      <Search />
    </div>
  </div>
</template>

<script>

import Search from '@/components/Search.vue'

export default {
  name: "HeroPanel",
  props: ['title', 'blockId', 'hash', 'address'],
  data: function () {
    return {
      thisHash: null,
      height: null
    }
  },
  components: {
    Search
  },
  mounted() {
    this.determineBlockIdentifier()
  },
  methods: {
    determineBlockIdentifier() {
      const blockHeightRegex = /^[0-9]+$/
      const txHashRegex = /[0-9a-f]{64}/

      if (this.blockId) {
        if (txHashRegex.test(this.blockId)) {
          this.thisHash = this.blockId
        }

        if (blockHeightRegex.test(this.blockId)) {
          this.height = this.blockId
        }
      }
    }
  }
}
</script>

<style scoped>
.hero-panel {
  @apply bg-black-100 pb-24 md:pb-20 h-150 md:h-128 flex-shrink-0;
}
.hero-panel__title {
  @apply text-white text-2xl font-normal leading-none mb-0;
}
</style>
