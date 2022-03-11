<template>
  <tr>
    <td data-title="Address:" :title="item.node.address">
      <router-link :to="addressRoute">
        <span class="monospace md:inline-block">
          {{ item.node.address }}
        </span>
      </router-link>
    </td>

    <td data-title="Gateway:" :title="item.node.gateway">
      <router-link v-if="item.node.gateway" :to="gatewayRoute">
        <span class="monospace md:inline-block">
          {{ item.node.gateway }}
        </span>
      </router-link>
      <span v-else class="monospace md:inline-block text-gray">
        N/A
      </span>
    </td>

    <td data-title="Stargate:" :title="item.node.stargate">
      <router-link v-if="item.node.stargate" :to="stargateRoute">
        <span class="monospace md:inline-block">
          {{ item.node.stargate }}
        </span>
      </router-link>
      <span v-else class="monospace md:inline-block text-gray">
        N/A
      </span>
    </td>

    <td data-title="Type:">
      <span class="monospace md:font-sans">{{ formattedType }}</span>
    </td>

    <td data-title="Location:" :title="item.node.geo.city">
      <div class="overflow"><span class="monospace md:font-sans">
        {{ location }}
      </span></div>
    </td>

    <td data-title="Availability:" :title="item.availability">
      <span class="monospace md:inline-block">
        {{ (item.availability * 100).toFixed(2) }}%
      </span>
    </td>

    <td data-title="Last Seen:">
      <span v-if="isOnline" class="mr-1 lg:-mt-2 icon icon-green"><StatusOnlineIcon /></span>
      <span v-else class="mr-1 lg:-mt-2 icon icon-grey"><ClockIcon /></span>
      <span class="monospace md:font-sans" :class="!isOnline && 'text-gray'">{{ lastSeen }}</span>
    </td>
  </tr>
</template>

<script>
/*global process*/
import { ClockIcon, StatusOnlineIcon } from '@heroicons/vue/outline'
import moment from 'moment'

export default {
  name: 'NodesTableItem',
  props: ['item'],
  components: {
    ClockIcon,
    StatusOnlineIcon
  },
  computed: {
    action() {
      if (this.item.released) return null
      else if (this.item.unlockRequested) return 'Release'
      else return 'Unlock'
    },
    addressRoute() {
      return {name: 'Node', params: {address: this.item.node.address}}
    },
    gatewayRoute() {
      return {name: 'Node', params: {address: this.item.node.gateway}}
    },
    stargateRoute() {
      return {name: 'Node', params: {address: this.item.node.stargate}}
    },
    formattedType() {
      return this.item.node.type.charAt(0).toUpperCase() + this.item.node.type.slice(1)
    },
    location() {
      return `${this.item.node.geo.city}, ${this.item.node.geo.country}`
    },
    isOnline() {
      return Date.now() - this.item.lastSeen < 60000
    },
    lastSeen() {
      if (this.isOnline) return 'Online'
      return moment(this.item.lastSeen).fromNow()
    }
  }
}
</script>

<style scoped>
td {
  @apply bg-white text-sm2 font-normal flex items-center px-5 break-all max-w-full pb-4 leading-none;
}

td span {
  @apply w-full overflow-ellipsis overflow-hidden whitespace-nowrap;
}

td a {
  @apply overflow-ellipsis overflow-hidden whitespace-nowrap;
}

td .overflow {
  @apply overflow-ellipsis overflow-hidden whitespace-nowrap;
}

td::before {
  content: attr(data-title);
  @apply font-normal mr-8 min-w-100 text-xs text-gray-600 pt-2;
}

td:first-child {
  @apply rounded-l-4 pt-8;
}

td:last-child {
  @apply rounded-r-4 pb-8 border-b-4 border-gray-200;
}

td .icon {
  @apply w-15 inline-block align-middle;
}

td .icon-green {
  @apply text-green;
}

td .icon-grey {
  @apply text-gray-400;
}

td a {
  @apply leading-none border-b border-black border-opacity-25 hover:border-green hover:border-opacity-25 hover:text-green align-middle;
}

@screen lg {
  td {
    @apply border-gray-200 pt-13 pb-15 table-cell border-b-2 align-middle;
  }

  td:first-child {
    @apply pl-20 pt-13;
  }

  td.amount-col {
    @apply text-right pr-30;
  }

  td:last-child {
    @apply pb-13 border-b-2;
  }

  td:before {
    @apply hidden;
  }
}
</style>

