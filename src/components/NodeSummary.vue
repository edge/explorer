<template>
  <div class="flex flex-col h-full">
    <h3>Node Summary</h3>
    <div class="relative max-h-full tile md:pr-50">
      <span class="emphasis">{{ formattedType }}</span> node <span class="emphasis">{{ node.address }}</span>
      <span v-if="isOnline"> is currently online. </span><span v-else> was last seen {{ lastSeen }}. </span>

      <span v-if="node.type === 'stargate'">
        <span class="emphasis"> {{ node.gatewaysConnected }}</span> gateways and <span class="emphasis">{{ node.hosts }}</span> hosts are connected to it.</span>
      <span v-else-if="node.type === 'gateway'">
        <span class="emphasis">{{ node.hostsConnected }}</span> host nodes are connected to it and its stargate node is <span class="emphasis">{{ node.stargate }}.</span>
      </span>
      <span v-else>
        Its gateway node is <span class="emphasis">{{ node.gateway }}</span> and its stargate node is <span class="emphasis">{{ node.stargate }}.</span>
      </span>

      It has been available for <span class="emphasis">{{ node.availability.toFixed(2) }}%</span> of the last 24 hours.

      <br><br>

      This node is located in <span class="emphasis">{{ node.geo.location }}</span> at <span class="emphasis">{{ node.geo.lat.toFixed(2) }}&#176;</span> lattitude by <span class="emphasis">{{ node.geo.lat.toFixed(2) }}&#176;</span> longtitude.
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
    addressRoute() {
      return {name: 'Node', params: {address: this.node.address}}
    },
    gatewayRoute() {
      return {name: 'Node', params: {address: this.node.gateway}}
    },
    stargateRoute() {
      return {name: 'Node', params: {address: this.node.stargate}}
    },
    formattedType() {
      return this.node.type.charAt(0).toUpperCase() + this.node.type.slice(1)
    },
    isOnline() {
      return Date.now() - this.node.lastSeen < 60000
    },
    lastSeen() {
      if (this.isOnline) return 'Online'
      return moment(this.node.lastSeen).fromNow()
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
