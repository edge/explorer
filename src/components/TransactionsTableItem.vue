<template>
  <td data-title="Date:">
    <span class="monospace md:font-sans">
      {{ item.date }}
    </span>
  </td>
  <td data-title="From:">
    <span class="hidden monospace md:block">{{ sliceString(item.sender, 20) }}</span>
    <span class="monospace md:hidden">{{ sliceString(item.sender, 26) }}</span>
  </td>
  <td data-title="To:" class="relative">
    <span class="arrow-icon"><ArrowRightIcon /></span>
    <span class="hidden lg:pl-10 monospace md:block">{{ sliceString(item.recipient, 19) }}</span>
    <span class="monospace md:hidden">{{ sliceString(item.recipient, 26) }}</span>
  </td>
  <td data-title="Tx Hash:" :title="item.hash">
    <router-link :to="{name: 'Transaction', params: {hash: item.hash}}">
      <span class="hidden monospace md:inline-block">{{ sliceString(item.hash, 8) }}</span>
      <span class="monospace md:hidden">{{ sliceString(item.hash, 26) }}</span>
    </router-link>
  </td>
  <td data-title="Memo:" :class="item.description === 'None' ? 'text-gray-400' : ''">
    <span class="monospace md:font-sans">{{ item.description }}</span>
  </td>
  <td data-title="Status:">
    <span v-if="item.confirmations >= 10 || !item.confirmations" class="mr-1 -mt-2 icon icon--confirmed icon-green"><CheckCircleIcon /></span>
    <span class="monospace md:font-sans">{{ formatStatus(item) }}</span>
  </td>
  <td data-title="Amount:">
    <span v-if="item.type.toLowerCase() === 'sent'">-</span>
    <span class="monospace lg:font-sans">{{ formatAmount(item.amount) }} XE</span>
  </td>
</template>

<script>
const { formatXe } = require('@edge/wallet-utils')
import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon, CheckCircleIcon } from "@heroicons/vue/outline"

export default {
  name: "TransactionsTableItem",
  props: ['item'],
  methods: {
    async copyToClipboard (input) {
      if (!!navigator.clipboard) {
        await navigator.clipboard.writeText(input)
      }
    },
    sliceString(string, symbols) {
      return string.length > symbols ? string.slice(0, symbols) + '...' : string;
    },
    formatAmount(amount) {
      return formatXe(amount, true)
    },
    formatStatus(item) {
      if (item.pending) return 'Pending'
      if (item.confirmations === 1) return `${item.confirmations} confirmation`
      if (item.confirmations < 10) return `${item.confirmations} confirmations`
      return `Confirmed`
    }
  },
  components: {
    ArrowDownIcon,
    ArrowRightIcon,
    ArrowUpIcon,
    CheckCircleIcon
  }
}
</script>

<style scoped>
td {
  @apply bg-white text-sm2 font-normal flex items-center px-10 break-all max-w-full pb-4;
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

td .icon-red {
  @apply text-red;
}

td .arrow-icon {
  @apply absolute hidden pt-px lg:block w-14 h-14 -left-6 text-green;
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
