<template>
  <td data-title="Address:" :title="item.address" class="address">
    <router-link :to="{name: 'Wallet', params: {address: item.address}}">
      <span class="monospace md:inline-block">{{ item.address }}</span>
    </router-link><BadgeCheckIcon v-if="item.trusted" class="trusted" />
  </td>
  <td data-title="Latest Tx:">
    <router-link :to="{name: 'Transaction', params: {hash: item.latestTransaction.hash}}">
      <span class="monospace md:inline-block">{{ item.latestTransaction.hash }}</span>
    </router-link>
  </td>
  <td data-title="Transactions:">
    <span class="monospace lg:font-sans">{{ item.txCount }}</span>
  </td>
  <td data-title="Stakes:">
    <span class="monospace lg:font-sans">{{ item.stakeCount }}</span>
  </td>
  <td data-title="Staked XE:" class="amount-col">
    <span class="monospace lg:font-sans">{{ formatAmount(item.staked || 0 ) }}</span>
  </td>
  <td data-title="Balance (XE):" class="amount-col">
    <span class="monospace lg:font-sans">{{ formatAmount(item.balance) }}</span>
  </td>  
</template>

<script>
const { xeStringFromMicroXe } = require('@edge/wallet-utils')
import { BadgeCheckIcon } from '@heroicons/vue/solid'

export default {
  name: "WalletsTableItem",
  props: ['item'],
  components: {
    BadgeCheckIcon
  },
  methods: {
    sliceString(string, symbols) {
      return string && string.length > symbols ? `${string.slice(0, symbols)}…` : string;
    },
    formatAmount(amount) {
      return xeStringFromMicroXe(amount, true)
    },
    formatNumber(number) {
      return number.toLocaleString('en-US')
    }
  }
}
</script>

<style scoped>
td {
  @apply bg-white text-sm2 font-normal flex items-center px-5 break-all max-w-full pb-4;
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
td .icon--confirmed {
  @apply w-16 md:w-18;
}

td .icon-green {
  @apply text-green;
}

td .icon-grey {
  @apply text-gray-400;
}

td .icon-red {
  @apply text-red;
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

td a {
  @apply overflow-ellipsis overflow-hidden whitespace-nowrap
}

td span {
  @apply max-w-max w-full overflow-ellipsis overflow-hidden whitespace-nowrap
}

.trusted {
  @apply w-18 h-18 inline-block ml-2 text-green;
}

@screen lg {
  td {
    @apply border-gray-200 pt-13 pb-15 table-cell border-b-2 align-middle;
  }

  td span {
    @apply w-11/12
  }

  td:first-child {
    @apply pl-20 pt-13;
  }

  td:last-child {
    @apply pr-30 pb-13 text-right border-b-2;
  }

  td.amount-col {
    @apply pr-30 text-right
  }

  td:before {
    @apply hidden;
  }
}
</style>
