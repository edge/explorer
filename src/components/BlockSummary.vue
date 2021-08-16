<template>
  <div class="flex flex-col h-full">
    <h3>Block Summary</h3>
    <div class="tile">
      This block was mined on <span>{{new Date(block.timestamp).toLocaleString().split(',')[0]}}</span> at <span>{{new Date(block.timestamp).toLocaleString().split(',')[1]}}</span>. A total of <span>{{ block.total }} XE</span> were sent in the block with the average transaction being <span>{{ block.average }} XE</span>.
    </div>
  </div>
</template>

<script>

export default {
  name: "BlockSummary",
  props: {
    block: {
      type: Object
    }
  }
}
</script>

<style scoped>
  .tile {
    @apply flex-1 p-12 md:p-24 text-sm text-gray-300 bg-white rounded md:pr-50;
  }
  .tile span {
    @apply text-black font-medium font-mono;
  }
</style>
