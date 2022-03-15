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
          <router-link :to="addressRoute">{{ session.node.address }}</router-link>
        </div>
      </div>
      <div class="nodeRow" v-if="session.gateway">
        <div class="nodeRow__label">Gateway</div>
        <div class="nodeRow__value">
          <router-link :to="gatewayRoute">{{ session.gateway.node.address }}</router-link>
        </div>
      </div>
      <div class="nodeRow" v-if="session.stargate">
        <div class="nodeRow__label">Stargate</div>
        <div class="nodeRow__value">
          <router-link  :to="stargateRoute">{{ session.stargate.node.address }}</router-link>
        </div>
      </div>
      <div class="nodeRow">
        <div class="nodeRow__label">Status</div>
        <div class="nodeRow__value">{{ status }}</div>
      </div>
      <div class="nodeRow" v-if="!isOnline">
        <div class="nodeRow__label">Last Seen</div>
        <div class="nodeRow__value">{{ lastActive }}</div>
      </div>
      <div class="nodeRow">
        <div class="nodeRow__label">Availability</div>
        <div class="nodeRow__value">{{ (session.availability * 100).toFixed(2) }}%</div>
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
    session: {
      type: Object
    }
  },
  computed: {
    addressRoute() {
      return {name: 'Node', params: {address: this.session.node.address}}
    },
    formattedType() {
      return this.session.node.type.charAt(0).toUpperCase() + this.session.node.type.slice(1)
    },
    gatewayRoute() {
      if (this.session.gateway) return {name: 'Node', params: {address: this.session.gateway.node.address}}
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
    stargateRoute() {
      if (this.session.stargate) return {name: 'Node', params: {address: this.session.stargate.node.address}}
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
