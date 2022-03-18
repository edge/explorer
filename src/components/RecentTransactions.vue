<template>
  <div class="w-full mb-25">
    <h3>Recent Transactions</h3>

    <table class="w-full">
      <thead class="hidden lg:table-header-group">
        <tr>
          <th width="20%">Hash</th>
          <th width="25%">From</th>
          <th width="25%"><span class="pl-5">To</span></th>
          <th width="30%" class="amount-col">Amount XE</th>
        </tr>
      </thead>
      <tbody v-if="loading">
        <tr>
          <td colspan="4" class="w-full text-center bg-white py-35">
            Loading latest transactions...
          </td>
        </tr>
      </tbody>
      <tbody v-if="transactions.length">
        <tr v-for="transaction in transactions" :key="transaction.hash">
          <td data-title="Hash:">
            <router-link :to="{name: 'Transaction', params: {hash: transaction.hash}}">
              <span class="monospace lg:inline-block">{{ transaction.hash }}</span>
            </router-link>
          </td>
          <td data-title="From:">
            <router-link :to="{name: 'Wallet', params: {address: transaction.sender}}">
              <span class="monospace lg:inline-block" :title="transaction.sender">
                {{ transaction.sender }}
              </span>
            </router-link>
          </td>
          <td data-title="To:" class="relative">
            <router-link :to="{name: 'Wallet', params: {address: transaction.recipient}}">
              <span class="lg:pl-5 lg:inline-block monospace" :title="transaction.recipient">
                {{ transaction.recipient }}
              </span>
            </router-link>
          </td>
          <td class="amount-col" data-title="Amount XE:">
            <span class="monospace lg:inline-block">
              {{ formatAmount(transaction.amount) }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import moment from 'moment'
import { ArrowRightIcon } from "@heroicons/vue/outline"
const { formatXe } = require('@edge/wallet-utils')

export default {
  name: 'RecentTransactions',
  props: ['loading', 'transactions'],
  methods: {
    formatAmount(amount) {
      return formatXe(amount, true)
    },
    timeSince(ts) {
      return moment(ts).fromNow()
    }
  },
  components: {
    ArrowRightIcon
  }
}
</script>

<style scoped>
table, tbody, tr {
  @apply block;
}

table {
  @apply w-full table-fixed
}

th {
  @apply font-normal text-sm2 text-left bg-gray-100 px-5 border-b-2 border-gray-200 py-8;
}
th.right {
  @apply text-right;
}

th.amount-col {
  @apply text-right pr-30
}

/* th:first-child {
  @apply pt-8;
} */

th:last-child {
  @apply rounded-r-4;
}

td {
  @apply bg-white text-sm2 font-normal flex items-center px-5 break-all max-w-full pb-4 leading-tight;
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

td a {
  @apply border-b border-black border-opacity-25 hover:border-green hover:border-opacity-25 hover:text-green align-middle;
}

td span {
  @apply w-full overflow-ellipsis overflow-hidden whitespace-nowrap;
}

td a {
  @apply overflow-ellipsis overflow-hidden whitespace-nowrap;
}

td .arrow-icon {
  @apply absolute hidden pt-1 lg:block w-12 h-12 -left-4 text-green;
}

@screen lg {
  tbody {
    @apply table-row-group;
  }

  table {
    @apply table;
  }

  tr {
    @apply table-row;
  }

  th {
    @apply pt-13 pb-13 pr-30 pb-13;
  }

  th:first-child {
    @apply pl-20 pt-13;
  }

  td {
    @apply border-gray-200 pt-13 pb-14 table-cell border-b-2 align-middle;
  }

  td.amount-col {
    @apply text-right pr-30;
  }

  td:first-child {
    @apply pl-20 pt-13;
  }

  td:last-child {
    @apply pr-30 pb-13 border-b-2;
  }

  td:before {
    @apply hidden;
  }
}
</style>
