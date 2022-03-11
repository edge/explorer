<template>
  <div class="flex flex-col h-full">
    <h3>Node Summary</h3>
    <div class="relative max-h-full tile md:pr-50">
      <span class="emphasis">{{ formattedType }}</span> node <span class="emphasis">{{ node.node.address }}</span> <span v-if="isOnline">is currently online</span><span v-else>was last seen {{ lastSeen }}</span>. It has been available for <span class="emphasis">{{ (node.availability * 100).toFixed(2) }}%</span> of the last 24 hours. It is located in <span class="emphasis">{{ location }}</span>.

      <span v-if="node.node.type === 'gateway'">
        It is currently connected to Stargate <span class="emphasis">{{ node.stargate.node.address }}</span>.
      </span>
      <span v-if="node.node.type === 'host'">
        It is currently connected to Gateway <span class="emphasis">{{ node.gateway.node.address }}</span> and Stargate <span class="emphasis">{{ node.stargate.node.address }}</span>.
      </span>

    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: "NodeSummary",
  props: {
    node: {
      type: Object
    }
  },
  computed: {
    formattedType() {
      return this.node.node.type.charAt(0).toUpperCase() + this.node.node.type.slice(1)
    },
    isOnline() {
      return Date.now() - this.node.lastActive < 60000
    },
    lastSeen() {
      if (this.isOnline) return 'Online'
      return moment(this.node.lastActive).fromNow()
    },
    location() {
      return `${this.node.node.geo.city}, ${this.node.node.geo.country}`
    }
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
