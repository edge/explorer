<template>
  <div class="flex flex-col h-full">
    <h3>Node Overview</h3>

    <div class="flex flex-col flex-1 space-y-2">
      <div class="nodeRow">
        <div class="nodeRow__label">Type</div>
        <div class="nodeRow__value">{{ formattedType }}</div>
      </div>
      <div class="nodeRow">
        <div class="nodeRow__label">Address</div>
        <div class="nodeRow__value">
          <router-link :to="addressRoute">{{ node.node.address }}</router-link>
        </div>
      </div>
      <div class="nodeRow" v-if="node.gateway">
        <div class="nodeRow__label">Gateway</div>
        <div class="nodeRow__value">
          <router-link :to="gatewayRoute">{{ node.gateway.node.address }}</router-link>
        </div>
      </div>
      <div class="nodeRow" v-if="node.stargate">
        <div class="nodeRow__label">Stargate</div>
        <div class="nodeRow__value">
          <router-link  :to="stargateRoute">{{ node.stargate.node.address }}</router-link>
        </div>
      </div>
      <div class="nodeRow">
        <div class="nodeRow__label">Status</div>
        <div class="nodeRow__value">{{ status }}</div>
      </div>
      <div class="nodeRow" v-if="!isOnline">
        <div class="nodeRow__label">Last Seen</div>
        <div class="nodeRow__value">{{ lastSeen }}</div>
      </div>
      <div class="nodeRow">
        <div class="nodeRow__label">Availability</div>
        <div class="nodeRow__value">{{ (node.availability * 100).toFixed(2) }}%</div>
      </div>
      <div class="nodeRow">
        <div class="nodeRow__label">Location</div>
        <div class="nodeRow__value">{{ location }}</div>
      </div>
    </div>

  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: "NodeOverview",
  props: {
    node: {
      type: Object
    }
  },
  computed: {
    addressRoute() {
      return {name: 'Node', params: {address: this.node.node.address}}
    },
    formattedType() {
      return this.node.node.type.charAt(0).toUpperCase() + this.node.node.type.slice(1)
    },
    gatewayRoute() {
      if (this.node.gateway) return {name: 'Node', params: {address: this.node.gateway.node.address}}
    },
    isOnline() {
      return Date.now() - this.node.lastActive < 60000
    },
    lastSeen() {
      return moment(this.node.lastActive).fromNow()
    },
    location() {
      return `${this.node.node.geo.city}, ${this.node.node.geo.country}`
    },
    stargateRoute() {
      if (this.node.stargate) return {name: 'Node', params: {address: this.node.stargate.node.address}}
    },
    status() {
      if (this.isOnline) return 'Online'
      return 'Offline'
    }
  }
}
</script>

<style scoped>
.nodeRow {
  @apply px-12 md:px-24 py-12 text-sm bg-white rounded w-full grid grid-cols-12 items-center;
}

.nodeRow .icon-green {
  @apply text-green;
}

.nodeRow .icon-grey {
  @apply text-gray-400;
}

.nodeRow__label {
  @apply col-span-4 md:col-span-3;
}

.nodeRow__value {
  @apply font-mono col-span-8 text-gray-300 md:col-span-9 truncate;
}

.nodeRow__value a {
  @apply leading-none border-b border-black border-opacity-25 hover:border-green hover:border-opacity-25 hover:text-green align-middle;
}
</style>
