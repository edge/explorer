<template>
  <tr>
    <td data-title="Height:">
      <router-link :to="blockHeightRoute">
        <span class="monospace">
          {{ item.height }}
        </span>
      </router-link>
    </td>

    <td data-title="Block Hash:">
      <router-link :to="blockHashRoute">
        <span class="monospace md:inline-block">
          {{ item.hash }}
        </span>
      </router-link>
    </td>

    <td data-title="Data Hash:">
      <span class="monospace md:inline-block">
        {{ item.dataHash }}
      </span>
    </td>

    <td data-title="Ledger Hash:">
      <span class="monospace md:inline-block">
        {{ item.ledgerHash }}
      </span>
    </td>

    <td data-title="Transactions:" class="monospace">
      {{ item.transactions.length }}
      <!-- delete above and uncomment below when index updated -->
      <!-- {{ item.txCount }} -->
    </td>

    <td data-title="XE:" class="monospace amount-col">
      {{ formattedTotal }}
    </td>

    <td data-title="Mined:">
      <span class="mr-1 lg:-mt-2 icon"><ClockIcon /></span>
      <span class="md:text-gray-400 monospace md:font-sans">
        {{ timeSince }}
      </span>
    </td>
  </tr>
</template>

<script>
/*global process*/
import moment from 'moment'
import { formatXe } from '@edge/wallet-utils'
import { ClockIcon } from '@heroicons/vue/outline'

export default {
  name: 'BlocksTableItem',
  props: [
    'item'
  ],
  components: {
    ClockIcon
  },
  computed: {
    date() {
      return new Date(this.item.timestamp).toLocaleString()
    },
    blockHeightRoute() {
      return {name: 'Block', params: {blockId: this.item.height}}
    },
    blockHashRoute() {
      return {name: 'Block', params: {blockId: this.item.hash}}
    },
    formattedTotal() {
      let total = this.item.transactions.reduce((accum, tx) => accum + parseInt(tx.amount), 0)
      return formatXe(total, true)
      // delete above and replace with below when index updated
      // return formatXe(this.item.total / 1e6, true)
    },
    timeSince() {
      return moment(this.item.timestamp).fromNow()
    }
  },
  methods: {
    formatAmount(amount) {
      return formatXe(amount, true)
    }
  }
}
</script>

<style scoped>
td {
  @apply bg-white text-sm2 font-normal flex content-center px-5 break-all max-w-full pb-4;
}

td span {
  @apply w-full overflow-ellipsis overflow-hidden whitespace-nowrap
}

td a {
  @apply overflow-ellipsis overflow-hidden whitespace-nowrap
}

td .overflow {
  @apply overflow-ellipsis overflow-hidden whitespace-nowrap
}

td::before {
  content: attr(data-title);
  @apply font-normal mr-8 min-w-100 text-xs text-gray-600 pt-2;
}

td:first-child {
  @apply rounded-l-4 pt-8;
}

td:last-child {
  @apply pr-30 pb-13 border-b-2;
}

td .icon {
  @apply w-13 lg:w-15 inline-block align-middle text-gray-600 lg:text-gray-400;
}

td .icon-grey {
  @apply text-gray-400;
}

td a {
  @apply leading-none border-b border-black border-opacity-25 hover:border-green hover:border-opacity-25 hover:text-green align-middle;
}

tr.pending {
  @apply italic text-gray-400
}

tr.pending a {
  @apply italic text-gray-400
}

@screen lg {
  td {
    @apply border-gray-200 pt-13 pb-15 table-cell border-b-2 align-middle;
  }

  td:first-child {
    @apply pl-20 pt-13;
  }

  td.amount-col {
    @apply text-right pr-20
  }

  td:last-child {
    @apply pb-13 border-b-2;
  }

  td:before {
    @apply hidden;
  }
}
</style>
