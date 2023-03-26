<template>
  <div class="w-full">
    <h3>Recent Blocks</h3>

    <table class="w-full">
      <thead class="sticky top-0 z-10 hidden lg:table-header-group">
        <tr>
          <th width="15%">Height</th>
          <th width="20%">Hash</th>
          <th width="10%">Txs</th>
          <th width="25%" class="amount-col">Total XE</th>
          <th width="30%">Mined</th>
        </tr>
      </thead>
      <tbody v-if="loading">
        <tr>
          <td colspan="5" class="w-full text-center bg-white py-35">
            Loading latest blocks...
          </td>
        </tr>
      </tbody>
      <tbody v-if="blocks.length">
        <tr v-for="block in blocks" :key="block.hash">
          <td data-title="Height:">
            <router-link :to="{name: 'Block', params: {blockId: block.height}}">
              <span class="monospace">{{ block.height }}</span>
            </router-link>
          </td>
          <td class="" data-title="Hash:">
            <router-link :to="{name: 'Block', params: {blockId: block.hash}}">
              <span class="monospace lg:inline-block">{{ block.hash }}…</span>
            </router-link>
          </td>
          <td data-title="Txs:">
            <span class="monospace lg:inline-block">{{ block.transactions.length }}</span>
          </td>
          <td data-title="Total XE:" class="amount-col">
            <span class="monospace lg:inline-block">{{ formatAmount(block.total) }}</span>
          </td>
          <td data-title="Mined:">
            <span class="lg:inline-block">
              <span class="mr-1 -mt-2 icon icon-grey"><ClockIcon /></span>
              <span class="monospace lg:font-sans lg:text-gray-400">
                {{ timeSince(block.timestamp) }}
              </span>
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { ClockIcon } from "@heroicons/vue/outline"
import moment from 'moment'
const { formatXe } = require('@edge/wallet-utils')

export default {
  name: 'RecentBlocks',
  props: ['blocks', 'loading'],
  methods: {
    formatAmount(amount) {
      return formatXe(amount / 1e6, true)
    },
    timeSince(ts) {
      return moment(ts).fromNow()
    }
  },
  components: {
    ClockIcon
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

th.amount-col {
  @apply text-right pr-30
}

/* th:first-child {
  @apply pt-8;
} */

th:last-child {
  @apply rounded-r-4;
}

tr {
  @apply overflow-hidden;
}

td {
  @apply bg-white text-sm2 font-normal flex items-center px-5 break-all max-w-full pb-4 leading-tight;
}

td::before {
  content: attr(data-title);
  @apply font-normal mr-8 min-w-75 text-xs text-gray-600 pt-2;
}

td:first-child {
  @apply rounded-t-4 pt-8;
}

td:last-child {
  @apply rounded-b-4 pb-8 mb-4;
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

td .icon {
  @apply w-13 lg:w-15 inline-block align-middle text-gray-600 lg:text-gray-400;
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
    @apply pt-13 pb-13 pr-30;
  }

  th:first-child {
    @apply pl-20 pt-13;
  }

  td {
    @apply border-gray-200 pt-13 pb-14 table-cell border-b-2 align-middle;
  }

  td:first-child {
    @apply pl-20 pt-13 rounded-l-4;
  }

  td.amount-col {
    @apply text-right pr-30;
  }

  td:last-child {
    @apply pr-30 pb-13 rounded-r-4;
  }

  td:before {
    @apply hidden;
  }
}
</style>
