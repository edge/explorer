<template>
  <div class="flex flex-col h-full">
    <h3>Burn Summary</h3>
    <div class="tile" v-if="isPending">
      This burn was sent on <span class="emphasis">{{new Date(burn.timestamp).toLocaleString().split(',')[0]}}</span> at <span class="emphasis">{{new Date(burn.timestamp).toLocaleString().split(',')[1]}}</span>. It is currently pending.
    </div>
    <div class="tile" v-else>
      This burn was sent on <span class="emphasis">{{new Date(burn.timestamp).toLocaleString().split(',')[0]}}</span> at <span class="emphasis">{{new Date(burn.timestamp).toLocaleString().split(',')[1]}}</span>.
      A total of <span class="emphasis">{{formattedAmount}} $EDGE</span> was burned. The burn description reads <span class="emphasis">{{ burn.description }}</span>.
    </div>
  </div>
</template>

<script>
import * as xe from '@edge/xe-utils'

export default {
  name: "BurnSummary",
  props: {
    burn: {
      type: Object
    }
  },
  computed: {
    isPending() {
      return this.burn.pending
    },
    formattedAmount() {
      return xe.xe.formatMxe(this.burn.amount, true)
    }
  },
  methods: {

  }
}
</script>

<style scoped>
  .tile {
    @apply flex-1 p-12 md:p-24 text-sm text-gray-300 bg-white rounded md:pr-50 break-words;
  }
  .tile span.emphasis {
    @apply text-gray-900 font-medium font-mono;
  }
</style>
