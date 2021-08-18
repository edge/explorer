<template>
  <div class="flex flex-col h-full">
    <div class="tile">
      <div
        class="flex items-center justify-between cursor-pointer group hover:text-green"
        @click.prevent="rawDataVisible = !rawDataVisible"
      >
        <h3 class="p-0 m-0">
          {{ rawDataVisible ? 'Hide Raw Data' : 'Show Raw Data' }}
        </h3>
        <span class="monospace group-hover:text-green">
          {{ rawDataVisible ? '-' : '+' }}
        </span>
      </div>
      <div v-if="rawDataVisible" class="mt-20">
        <pre class="text-sm md:text-xs">{{ JSON.stringify(rawData, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "RawData",
  props: {
    rawData: {
      type: Object
    }
  },
  data: function () {
    return {
      rawDataVisible: false
    }
  },
}
</script>

<style scoped>
  .tile {
    @apply flex-1 p-12 md:p-24 text-sm text-gray-300 bg-white rounded;
  }
  .tile span {
    @apply text-black font-medium font-mono;
  }
</style>
