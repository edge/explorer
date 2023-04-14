<template>
  <div class="w-full mb-25">
    <table class="w-full">
      <thead class="sticky top-0 hidden lg:table-header-group">
        <tr>
          <TableHeader width="9%" header="Height" :sortQuery="sortQuery"
            sortParam="height" :onSortingUpdate="updateSorting"
          />
          <TableHeader width="18%" header="Block Hash" :sortQuery="sortQuery"
            sortParam="hash" :onSortingUpdate="updateSorting" :sortAscFirst="true"
          />
          <TableHeader width="18%" header="Data Hash" :sortQuery="sortQuery"
            sortParam="dataHash" :onSortingUpdate="updateSorting" :sortAscFirst="true"
          />
          <TableHeader width="18%" header="Ledger Hash" :sortQuery="sortQuery"
            sortParam="ledgerHash" :onSortingUpdate="updateSorting" :sortAscFirst="true"
          />
          <th width="5%">Txs</th>
          <th class="amount-col" width="16%">Total XE</th>
          <TableHeader width="16%" header="Mined" :sortQuery="sortQuery"
            sortParam="timestamp" :onSortingUpdate="updateSorting"
          />
        </tr>
      </thead>
      <tbody v-if="blocks && blocks.length">
        <BlocksTableItem
          v-for="item in blocks"
          :key="item.hash"
          :item="item"
        />
      </tbody>
      <tbody v-else-if="!loaded & loading">
        <td colspan="7" class="block w-full text-center bg-white lg:table-cell py-35">
          Loading...
        </td>
      </tbody>
    </table>
  </div>
</template>

<script>
import BlocksTableItem from '@/components/BlocksTableItem.vue'
import TableHeader from '@/components/TableHeader.vue'
import { fetchBlocks } from '@/utils/api.js'

const blocksRefreshInterval = 5 * 1000

export default {
  name: 'BlocksTable',
  data: function () {
    return {
      loaded: false,
      loading: false,
      blocks: [],
      iBlocks: []
    }
  },
  components: {
    BlocksTableItem,
    TableHeader
  },
  props: [
    'hideEmptyBlocks',
    'limit',
    'page',
    'receiveMetadata',
    'sortable'
  ],
  computed: {
    sortQuery() {
      return this.$route.query.sort
    }
  },
  mounted() {
    this.updateBlocks()
    // initiate polling
    this.iBlocks = setInterval(() => {
      this.updateBlocks()
    }, blocksRefreshInterval)
  },
  unmounted() {
    clearInterval(this.iBlocks)
  },
  methods: {
    async updateBlocks() {
      this.loading = true
      // the sort query sent to index needs to include "-height", but this is hidden from user in browser url
      const sortQuery = this.$route.query.sort ? `${this.$route.query.sort},-height` : '-height'
      const options = {
        limit: this.limit,
        page: this.page,
        sort: sortQuery
      }
      if (this.hideEmptyBlocks) options.noEmpty = 1

      const blocks = await fetchBlocks({options})
      this.blocks = blocks.blocks
      this.receiveMetadata(blocks.metadata)
      this.loaded = true
      this.loading = false
    },
    updateSorting(newSortQuery) {
      const query = { ...this.$route.query, sort: newSortQuery }
      if (!newSortQuery) delete query.sort
      this.$router.replace({ query })
    }
  },
  watch: {
    page() {
      this.updateBlocks()
    },
    sortQuery() {
      this.updateBlocks()
    }
  }
}
</script>

<style scoped>
table {
  @apply w-full table-fixed
}

table, tbody, tr {
  @apply block;
}

th {
  @apply font-normal text-sm2 text-left text-black bg-gray-100 border-b-2 border-gray-200 py-13 px-5;
}

th:first-of-type {
  @apply pl-20;
}

th:last-of-type {
  @apply pr-20;
}

th.amount-col {
  @apply text-right pr-20
}

th .icon {
  @apply w-15 inline-block align-middle text-gray-400;
}

@screen lg {
  table {
    @apply table;
  }

  tbody {
    @apply table-row-group;
  }

  tr {
    @apply table-row;
  }
}
</style>
