<template>
  <div class="w-full mb-25">
    <table class="w-full">
      <thead class="sticky top-0 hidden lg:table-header-group">
        <tr>
          <th width="15%">Height</th>
          <th width="30%">Hash</th>
          <th>Transactions</th>
          <th>Total XE</th>
          <th>Mined</th>
        </tr>
      </thead>
      <!-- <tbody v-if="loading">
        <tr>
          <td colspan="3" class="w-full text-center bg-white py-35">
            Loading latest blocks...
          </td>
        </tr>
      </tbody> -->
      <tbody v-if="blocks.length">
        <tr v-for="block in blocks" :key="block.height">
          <td data-title="Height:">
            <router-link :to="{name: 'Block', params: {height: block.height}}">
              <span class="monospace">{{block.height}}</span>
            </router-link>
          </td>
          <td data-title="Hash:"><span class="truncate monospace">{{ block.hash.substr(0, 32) }}&#8230;</span>
          </td>
          <td data-title="Transactions:">
            {{ block.transactions.length }}
          </td>
          <td data-title="XE:">
            {{ block.total }}
          </td>
          <td data-title="Mined:">
            <span class="md:text-gray-400 monospace md:font-sans">
              {{ timeSince(block.timestamp) }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'BlocksTable',
  components: {},
  props: ['blocks'],
  data: function () {
    return {
      loading: false,
      polling: null
    }
  },
  methods: {
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

td a {
  @apply leading-none border-b border-black border-opacity-25 hover:border-green hover:border-opacity-25 hover:text-green align-middle;
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
