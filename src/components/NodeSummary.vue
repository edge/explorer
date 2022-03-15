<template>
  <div class="flex flex-col h-full">
    <h3>Node Summary</h3>
    <div class="relative max-h-full tile md:pr-50">
      <span class="emphasis">{{ formattedType }}</span> node <span class="emphasis">{{ session.node.address }}</span> is currently <span v-if="isOnline">online</span><span v-else>offline and was last seen {{ lastActive }}</span>.

      It has been available for <span class="emphasis">{{ (session.availability * 100).toFixed(2) }}%</span> of the last 24 hours.

      <span v-if="location !== 'Unknown'">It is located in <span class="emphasis">{{ location }}</span></span><span v-else>Its location is <span class="emphasis">Unknown</span></span>.

      <span v-if="isOnline && session.node.type === 'gateway'">
        It is currently connected to Stargate <span class="emphasis">{{ session.stargate.node.address }}</span>.
      </span>
      <span v-if="isOnline && session.node.type === 'host'">
        It is currently connected to Gateway <span class="emphasis">{{ session.gateway.node.address }}</span> and Stargate <span class="emphasis">{{ session.stargate.node.address }}</span>.
      </span>

    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: "NodeSummary",
  props: {
    session: {
      type: Object
    }
  },
  computed: {
    formattedType() {
      return this.session.node.type.charAt(0).toUpperCase() + this.session.node.type.slice(1)
    },
    isOnline() {
      return Date.now() - this.session.lastActive < 60000
    },
    lastActive() {
      return moment(this.session.lastActive).fromNow()
    },
    location() {
      if (this.session.node.geo.city) return `${this.session.node.geo.city}, ${this.session.node.geo.country}`
      else if (this.session.node.geo.country) return this.session.node.geo.country
      else return 'Unknown'
    },
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
