<template>
  <div class="w-full mb-25">
    <h3>Recent Transactions</h3>

    <table class="w-full">
      <thead class="hidden lg:table-header-group">
        <tr>
          <th width="25%">Hash</th>
          <th width="15%">From</th>
          <th width="15%"><span class="pl-5">To</span></th>
          <th class="right">Amount</th>
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
              <span class="monospace md:inline-block">{{ sliceString(transaction.hash, 10) }}</span>
              <span class="monospace md:hidden">{{ sliceString(transaction.hash, 20) }}</span>
            </router-link>
          </td>
          <td data-title="From:">
            <span class="truncate monospace">
              {{ sliceString(transaction.sender, 10) }}
            </span>
          </td>
          <td data-title="To:" class="relative">
            <span class="arrow-icon"><ArrowRightIcon /></span>
            <span class="truncate lg:pl-5 monospace">
              {{ sliceString(transaction.recipient, 10) }}
            </span>
          </td>
          <td class="lg:text-right" data-title="Amount:">
            <span class="monospace lg:font-sans">
              {{ transaction.amount }} XE
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import moment from 'moment'
import { fetchTransactions } from '../utils/api'
import { ArrowRightIcon } from "@heroicons/vue/outline"

export default {
  name: 'RecentTransactions',
  props: ['loading', 'transactions'],
  data: function () {
    return {}
  },
  mounted() {
    // this.loading = true
    // this.fetchTransactions()
    // this.pollData()
  },
  watch: {
    $route (to, from) {
      // clearInterval(this.polling)
      // this.polling = null
    }
  },
  methods: {
    // async fetchTransactions() {
    //   const { transactions } = await fetchTransactions({ options: { limit: 5 } })
    //   this.transactions = transactions
    //   this.loading = false
    // },
    // pollData() {
    //   this.polling = setInterval(() => {
    //     this.fetchTransactions()
    //   }, 10000)
    // },
    sliceString(string, symbols) {
      return string.length > symbols ? string.slice(0, symbols) : string
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

th {
  @apply font-normal text-sm2 text-left text-black bg-gray-100 px-5 border-b-2 border-gray-200 py-8;
}
th.right {
  @apply text-right;
}

/* th:first-child {
  @apply pt-8;
} */

th:last-child {
  @apply rounded-r-4;
}

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

td a {
  @apply leading-none border-b border-black border-opacity-25 hover:border-green hover:border-opacity-25 hover:text-green align-middle;
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
