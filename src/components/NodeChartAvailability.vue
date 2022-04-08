<template>
  <div class="flex flex-col h-full">
    <h3>Availability</h3>
    <div class="relative max-h-full tile md:pr-50">

    </div>
  </div>
</template>

<script>

export default {
  name: "NodeChartAvailability",
  props: {
    session: {
      type: Object
    }
  },
  computed: {

  }
}
</script>

<style scoped>
  .tile {
    @apply flex-1 p-12 md:p-24 text-sm text-gray-300 bg-white rounded;
  }
  .tile span.emphasis {
    @apply text-gray-900 font-medium font-mono;
  }
  button {
    @apply leading-none text-sm2 border-b border-black border-opacity-25 hover:border-green hover:border-opacity-25 hover:text-green align-middle;
  }
</style>
