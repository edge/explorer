<template>
  <div class="flex flex-col h-full">
    <h3>Node Overview</h3>

    <div class="flex flex-col flex-1 space-y-2">
      <div class="nodeRow">
        <div class="nodeRow__label">Address</div>
        <div class="nodeRow__value">
          <router-link :to="addressRoute">{{ node.address }}</router-link>
        </div>
      </div>
      <div class="nodeRow">
        <div class="nodeRow__label">Gateway</div>
        <div class="nodeRow__value">
          <router-link v-if="node.gateway" :to="gatewayRoute">{{ node.gateway }}</router-link>
          <span v-else>N/A</span>
        </div>
      </div>
      <div class="nodeRow">
        <div class="nodeRow__label">Stargate</div>
        <div class="nodeRow__value">
          <router-link v-if="node.stargate" :to="stargateRoute">{{ node.stargate }}</router-link>
          <span v-else>N/A</span>
        </div>
      </div>
      <div class="nodeRow">
        <div class="nodeRow__label">Type</div>
        <div class="nodeRow__value">{{ node.type.slice(0, 1).toUpperCase() + node.type.slice(1) }}</div>
      </div>
      <div class="nodeRow">
        <div class="nodeRow__label">Availability</div>
        <div class="nodeRow__value">{{ node.availability.toFixed(2) }}%</div>
      </div>
      <div class="nodeRow" v-if="node.device">
        <div class="nodeRow__label">Last Seen</div>
        <div class="nodeRow__value">{{ lastSeen }}</div>
      </div>
    </div>

  </div>
</template>

<script>
import { ClockIcon, StatusOnlineIcon } from '@heroicons/vue/outline'
import moment from 'moment'
import Tooltip from '@/components/Tooltip'

export default {
  name: "NodeOverview",
  components: {
    ClockIcon,
    StatusOnlineIcon,
    Tooltip
  },
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
  @apply font-mono col-span-8 text-gray-300 md:col-span-9;
}

.nodeRow__value a {
  @apply leading-none border-b border-black border-opacity-25 hover:border-green hover:border-opacity-25 hover:text-green align-middle;
}
</style>
