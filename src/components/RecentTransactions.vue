<template>
  <div class="w-full mb-25">
    <h3>Recent Transcations</h3>

    <table class="w-full">
      <thead class="hidden lg:table-header-group">
        <tr>
          <th width="25%">Hash</th>
          <th width="15%">From</th>
          <th width="15%">To</th>
          <th class="text-right">Amount</th>
        </tr>
      </thead>
      <tbody v-if="loading">
        <tr>
          <td colspan="3" class="py-35 bg-white w-full text-center">
            Loading latest transactions...
          </td>
        </tr>
      </tbody>
      <tbody v-if="transactions.length">
        <tr v-for="transaction in transactions" :key="transaction.hash">
          <td data-title="Hash:">
            <span class="monospace">
              <span class="monospace">
                {{ sliceString(transaction.hash, 10) }}
              </span>
            </span>
          </td>
          <td data-title="From:">
            <span class="monospace">
              {{ sliceString(transaction.sender, 10) }}
            </span>
          </td>
          <td data-title="To:">
            <span class="monospace">
              {{ sliceString(transaction.recipient, 10) }}
            </span>
          </td>
          <td class="text-right" data-title="Amount:">
            {{ transaction.amount }} XE
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import moment from 'moment'
import { fetchTransactions } from '../utils/api'

export default {
  name: 'RecentTransactions',
  data: function () {
    return {
      loading: false,
      polling: null,
      transactions: []
    }
  },
  mounted() {
    this.loading = true
    this.fetchTransactions()
    this.pollData()
  },
  methods: {
    async fetchTransactions() {
      const { transactions, metadata } = await fetchTransactions('', { limit: 5 })
console.log('transactions', transactions)
      this.transactions = transactions
      this.loading = false
    },
    pollData() {
      this.polling = setInterval(() => {
        this.fetchTransactions()
      }, 10000)
    },
    sliceString(string, symbols) {
      return string.length > symbols ? string.slice(0, symbols) : string
    },
    timeSince(ts) {
      return moment(ts).fromNow()
    }
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

/* th:first-child {
  @apply pt-8;
} */

th:last-child {
  @apply rounded-r-4;
}

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
