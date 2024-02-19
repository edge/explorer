<template>
  <tr :class="!item.block && 'pending'">
    <td data-title="Date:" :title="date">
      <span class="lg:inline-block">
        {{ date }}
      </span>
    </td>

    <td data-title="Hash:" :title="item.hash">
      <router-link :to="burnHashRoute">
        <span class="monospace lg:inline-block">
          {{ item.hash }}
        </span>
      </router-link>
    </td>

    <td data-title="Parent Tx:" :title="item.parentTx">
      <router-link :to="parentTxRoute">
        <span class="monospace lg:inline-block">
          {{ item.parentTx }}
        </span>
      </router-link>
    </td>

    <td data-title="From:" :title="item.sender">
      <router-link :to="fromAddressRoute">
        <span class="monospace lg:inline-block">
          {{ item.sender }}
        </span>
      </router-link>
    </td>

    <!-- <td class="arrow-icon">
      <span class="mr-1 -mt-2 icon icon-green lg:inline-block"><ArrowRightIcon /></span>
    </td>

    <td data-title="To:" :title="item.recipient">
      <router-link :to="toAddressRoute">
        <span class="monospace lg:inline-block">
          {{ item.recipient }}
        </span>
      </router-link>
    </td> -->

    <td data-title="Description:" :title="item.description || 'Misc'">
      <span class="lg:inline-block"><span class="monospace lg:font-sans">
        {{ item.description || 'Misc'}}
      </span></span>
    </td>

    <td data-title="Status:" :title="statusFormatted">
      <span v-if="!item.block" class="lg:inline-block">
        <span class="mr-1 -mt-2 icon icon-grey"><ClockIcon/></span>
        <span class="monospace lg:font-sans text-gray-400">{{ statusFormatted }}</span>
      </span>
      <span v-else class="lg:inline-block">
        <span class="mr-1 -mt-2 icon" :class="burning && 'filter grayscale'"><BurnIcon /></span>
        <span class="monospace lg:font-sans" :class="burning && 'text-gray-400'">{{ statusFormatted }}</span>
      </span>

    </td>

    <td data-title="Amount (XE):" class="amount-col">
      <span class="monospace lg:inline-block">
        {{ formattedAmount }}
      </span>
    </td>
  </tr>
</template>

<script>
/*global process*/
import * as xe from '@edge/xe-utils'
import BurnIcon from './BurnIcon.vue'
import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon, CheckCircleIcon, ClockIcon } from '@heroicons/vue/outline'

export default {
  name: 'BurnsTableItem',
  props: [
    'item'
  ],
  components: {
    ArrowDownIcon,
    ArrowRightIcon,
    ArrowUpIcon,
    BurnIcon,
    CheckCircleIcon,
    ClockIcon
  },
  computed: {
    burning() {
      return this.item.confirmations < 10
    },
    date() {
      return new Date(this.item.timestamp).toLocaleString()
    },
    fromAddressRoute() {
      return {name: 'Wallet', params: {address: this.item.sender}}
    },
    toAddressRoute() {
      return {name: 'Wallet', params: {address: this.item.recipient}}
    },
    burnHashRoute() {
      return {name: 'Burn', params: {burnHash: this.item.hash}}
    },
    parentTxRoute() {
      return {name: 'Transaction', params: {txHash: this.item.parentTx}}
    },
    formattedAmount() {
      return xe.xe.formatMxe(this.item.amount, true)
    },
    statusFormatted() {
      if (!this.item.block) return 'Pending'
      if (this.item.confirmations < 10) return 'Burning'
      return 'Burned'
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

td .inline-icon {
  @apply inline-block mb-2 lg:mb-0
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
  @apply lg:table-cell hidden
}

td a {
  @apply border-b border-black border-opacity-25 hover:border-green hover:border-opacity-25 hover:text-green align-middle;
}

tr.pending {
  @apply italic text-gray-400;
}

tr.pending a {
  @apply italic text-gray-400;
}

td.from-to span {
  @apply lg:w-11/12;
}

.icon-wrap {
  @apply max-w-max
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
