<template>
  <tr>
    <td data-title="Height:">
      <router-link :to="blockHeightRoute">
        <span class="monospace md:inline-block max-w-max">
          {{ item.height }}
        </span>
      </router-link>
    </td>

    <td data-title="Block Hash:" :title="item.hash">
      <router-link :to="blockHashRoute">
        <span class="monospace md:inline-block">
          {{ item.hash }}
        </span>
      </router-link>
    </td>

    <td data-title="Data Hash:" :title="item.dataHash">
      <span class="monospace md:inline-block">
        {{ item.dataHash }}
      </span>
    </td>

    <td data-title="Ledger Hash:" :title="item.ledgerHash">
      <span class="monospace md:inline-block">
        {{ item.ledgerHash }}
      </span>
    </td>

    <td data-title="Transactions:">
      <span class="monospace md:inline-block">{{ item.txCount }}</span>
    </td>

    <td data-title="XE:" class="monospace amount-col" :title="formattedTotal">
      <span class="md:inline-block">{{ formattedTotal }}</span>
    </td>

    <td data-title="Mined:" :title="timeSince">
      <span class="md:inline-block">
        <span class="mr-1 -mt-2 icon icon-grey"><ClockIcon /></span>
        <span class="lg:text-gray-400 monospace lg:font-sans">
          {{ timeSince }}
        </span>
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
      return formatXe(this.item.total / 1e6, true)
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
  @apply bg-white text-sm2 font-normal flex content-center px-5 break-all max-w-full pb-4 leading-tight;
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
  @apply pr-30 pb-13 border-b-2;
}

td .icon {
  @apply w-13 lg:w-15 inline-block align-middle text-gray-600 lg:text-gray-400;
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
    @apply text-right pr-20;
  }

  td:last-child {
    @apply pb-10 border-b-2;
  }

  td:before {
    @apply hidden;
  }
}
</style>
