<template>
  <tr>
    <td data-title="ID:" :title="item.id">
      <router-link :to="stakeRoute">
        <span class="monospace lg:inline-block">
          {{ item.id }}
        </span>
      </router-link>
    </td>

    <td data-title="Hash:" :title="item.hash">
      <span class="monospace lg:inline-block">
        {{ item.hash }}
      </span>
    </td>

    <td data-title="Wallet:" :title="item.tx.recipient">
      <router-link :to="walletRoute">
        <span class="monospace lg:inline-block">
          {{ item.tx.recipient }}
        </span>
      </router-link>
    </td>

    <td data-title="Node:" :title="item.device">
      <span v-if="item.type === 'governance'" class="text-gray-400">N/A</span>
      <router-link :to="nodeRoute" v-else-if="item.device">
        <span class="monospace lg:inline-block">
          {{ item.device }}
        </span>
      </router-link>
      <span v-else class="text-gray-400">None</span>
    </td>

    <td data-title="Type:">
      <span class="monospace lg:font-sans lg:inline-block">{{ formattedType }}</span>
    </td>

    <td data-title="Status:">
      <span v-if="item.released" class="lg:inline-block">
        <span class="mr-1 -mt-2 icon icon-grey"><ArrowCircleDownIcon/></span>
        <span class="monospace lg:font-sans">Released</span>
      </span>
      <span v-else-if="item.unlockRequested" class="lg:inline-block">
        <span v-if="isUnlocking">
          <span class="mr-1 -mt-2 icon icon-grey"><ClockIcon/></span>
          <span class="monospace lg:font-sans">Unlocking</span>
        </span>
        <span v-else class="lg:inline-block">
          <span class="mr-1 -mt-2 icon icon-grey"><DotsCircleHorizontalIcon/></span>
          <span class="monospace lg:font-sans">Unlocked</span>
        </span>
      </span>
      <span v-else class="lg:inline-block">
        <span class="mr-1 -mt-2 icon icon-green"><CheckCircleIcon/></span>
        <span class="monospace lg:font-sans">Active</span>
      </span>
    </td>

    <td data-title="Amount (XE):" class="amount-col" :title="formattedAmount">
      <span class="monospace lg:inline-block">{{ formattedAmount }}</span>
    </td>
  </tr>
</template>

<script>
/*global process*/
import * as xe from '@edge/xe-utils'
import { ArrowCircleDownIcon, CheckCircleIcon, ClockIcon, DotsCircleHorizontalIcon } from '@heroicons/vue/outline'

export default {
  name: 'StakesTableItem',
  props: ['item'],
  components: {
    ArrowCircleDownIcon,
    CheckCircleIcon,
    ClockIcon,
    DotsCircleHorizontalIcon
  },
  computed: {
    action() {
      if (this.item.released) return null
      else if (this.item.unlockRequested) return 'Release'
      else return 'Unlock'
    },
    nodeRoute() {
      return {name: 'Node', params: {nodeAddress: this.item.device}}
    },
    stakeRoute() {
      return {name: 'Stake', params: {stakeId: this.item.id}}
    },
    walletRoute() {
      return {name: 'Wallet', params: {address: this.item.tx.sender}}
    },
    formattedAmount() {
      return xe.xe.formatMxe(this.item.amount, true)
    },
    formattedType() {
      return this.item.type.charAt(0).toUpperCase() + this.item.type.slice(1)
    },
    isUnlocking() {
      return this.item.unlockRequested + this.item.unlockPeriod > Date.now()
    }
  }
}
</script>

<style scoped>
td {
  @apply bg-white text-sm2 font-normal flex items-center px-5 break-all max-w-full pb-4 leading-tight;
}

td span {
  @apply w-full overflow-ellipsis overflow-hidden whitespace-nowrap;
}

td a {
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
  @apply border-b border-black border-opacity-25 hover:border-green hover:border-opacity-25 hover:text-green align-middle;
}

@screen lg {
  td {
    @apply border-gray-200 pt-13 pb-10 table-cell border-b-2 align-middle;
  }

  td:first-child {
    @apply pl-20 pt-13;
  }

  td.amount-col {
    @apply text-right pr-30;
  }

  td:last-child {
    @apply pb-10 border-b-2;
  }

  td:before {
    @apply hidden;
  }
}
</style>

