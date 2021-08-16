<template>
  <td data-title="Date:">{{ item.date }}</td>
  <td data-title="From:">
    <span class="monospace">{{ sliceString(item.sender, 20) }}</span>
  </td>
  <td data-title="To:">
    <span class="monospace">{{ sliceString(item.recipient, 20) }}</span>
  </td>
  <td data-title="Tx Hash:" :title="item.hash">
    <router-link :to="{name: 'Transaction', params: {hash: item.hash}}">
      <span class="monospace">{{ sliceString(item.hash, 10) }}</span>
    </router-link>
  </td>
  <td data-title="Memo:" :class="item.description === 'None' ? 'text-gray-400' : ''">
    {{ item.description }}
  </td>
  <td data-title="Status:">
    <span v-if="item.confirmations >= 10 || !item.confirmations" class="mr-0 -mt-2 icon icon--confirmed icon-green"><CheckCircleIcon /></span>
    {{ formatStatus(item) }}
  </td>
  <td data-title="Amount:">
    <span v-if="item.type.toLowerCase() === 'sent'">-</span>
    {{ formatAmount(item.amount) }}
    XE
  </td>
</template>

<script>
const { formatXe } = require('@edge/wallet-utils')
import { ArrowDownIcon, ArrowUpIcon, CheckCircleIcon } from "@heroicons/vue/outline"

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
    ArrowUpIcon,
    CheckCircleIcon
  }
}
</script>

<style scoped>
td {
  @apply bg-white text-sm2 font-normal flex items-center px-5 break-all max-w-full;
}

td::before {
  content: attr(data-title);
  @apply font-bold mr-8 min-w-100;
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
  @apply w-18;
}

td .icon-green {
  @apply text-green;
}

td .icon-red {
  @apply text-red;
}

td a {
  @apply text-green align-middle;
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
