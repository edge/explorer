<template>
  <td data-title="ID:" :title="item.id">
    <router-link v-if="!item.pending" :to="{name: 'Stake', params: {stakeId: item.id}}">
      <span class="hidden monospace md:inline-block">{{ sliceString(item.id, 8) }}</span>
      <span class="monospace md:hidden">{{ sliceString(item.id, 26) }}</span>
    </router-link>
    <div v-else>
      <span class="hidden monospace md:inline-block">{{ sliceString(item.id, 8) }}</span>
      <span class="monospace md:hidden">{{ sliceString(item.id, 26) }}</span>
    </div>
  </td>
  <td data-title="Hash:">
    <span class="hidden monospace md:inline-block">{{ sliceString(item.hash, 8) }}</span>
    <span class="monospace md:hidden">{{ sliceString(item.hash, 26) }}</span>
  </td>
  <td data-title="Wallet:">
    <router-link :to="{name: 'Wallet', params: {address: item.tx.recipient}}">
      <span class="hidden monospace md:inline-block">{{ sliceString(item.tx.recipient, 22) }}</span>
      <span class="monospace md:hidden">{{ sliceString(item.tx.recipient, 40) }}</span>
    </router-link>
  </td>
  <td data-title="Device:">
    <span v-if="item.device">
      <span class="hidden monospace md:inline-block">{{ sliceString(item.device, 22) }}</span>
      <span class="monospace md:hidden">{{ sliceString(item.tx.device, 40) }}</span>
    </span>
    <span v-else class="text-gray-400">None</span>
  </td>
  <td :title="item.tx.memo" data-title="Type:">
    <span class="monospace md:font-sans">{{ formatType(item.type) }}</span>
  </td>
  <td data-title="Status:">
    <span v-if="item.released">
      <span class="mr-1 -mt-2 icon icon-grey"><ArrowCircleDownIcon/></span>
      <span>Released</span>
    </span>
    <span v-else-if="item.unlockRequested">
      <span v-if="item.unlockRequested + item.unlockPeriod > Date.now()">
        <span class="mr-1 -mt-2 icon icon-grey"><ClockIcon/></span>
        <span>Unlocking</span>
      </span>
      <span v-else>
        <span class="mr-1 -mt-2 icon icon-grey"><DotsCircleHorizontalIcon/></span>
        <span>Unlocked</span>
      </span>
    </span>
    <span v-else>
      <span class="mr-1 -mt-2 icon icon-green"><CheckCircleIcon/></span>
      <span>Active</span>
    </span>
  </td>
  <td data-title="Amount:">
    <span class="monospace lg:font-sans">{{ formatAmount(item.amount / 1e6) }}</span>
  </td>
</template>

<script>
const { formatXe } = require('@edge/wallet-utils')
import { ArrowCircleDownIcon, CheckCircleIcon, ClockIcon, DotsCircleHorizontalIcon } from "@heroicons/vue/outline"

export default {
  name: "StakesTableItem",
  props: ['item'],
  methods: {
    async copyToClipboard (input) {
      if (!!navigator.clipboard) {
        await navigator.clipboard.writeText(input)
      }
    },
    sliceString(string, symbols) {
      return string && string.length > symbols ? `${string.slice(0, symbols)}…` : string;
    },
    formatAmount(amount) {
      return formatXe(amount, true)
    },
    formatType(typ) {
      return typ.charAt(0).toUpperCase() + typ.slice(1)
    },
    isConfirmed(item) {
      if (item.pending) return false
      if (item.confirmations === 1) return false
      if (item.confirmations < 10) return false
      return true
    }
  },
  components: {
    ArrowCircleDownIcon,
    CheckCircleIcon,
    ClockIcon,
    DotsCircleHorizontalIcon
  }
}
</script>

<style scoped>
td {
  @apply bg-white text-sm2 font-normal flex items-center px-5 break-all max-w-full pb-4 truncate;
}

td::before {
  content: attr(data-title);
  @apply font-normal mr-8 min-w-75 text-xs text-gray-600 pt-2;
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
td.arrow-icon {
  @apply hidden lg:table-cell;
}

td.arrow-icon svg {
  @apply pt-px w-14 h-14 text-green;
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

  td:last-child {
    @apply pr-30 pb-13 text-right border-b-2;
  }

  td:before {
    @apply hidden;
  }
}
</style>