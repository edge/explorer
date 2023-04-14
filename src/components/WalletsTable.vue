<template>
  <div>
    <table>
      <thead class="sticky top-0 z-10 hidden lg:table-header-group">
      <tr>
        <TableHeader width="30%" header="Address" :sortQuery="sortQuery"
          sortParam="address" :onSortingUpdate="updateSorting" :sortAscFirst="true"
        />
        <th width="16%">Latest Tx</th>
        <TableHeader width="8%" header="Txs" :sortQuery="sortQuery"
          sortParam="sortTxCount" :onSortingUpdate="updateSorting"
        />
        <TableHeader width="8%" header="Stakes" :sortQuery="sortQuery"
          sortParam="sortStakeCount" :onSortingUpdate="updateSorting"
        />
        <TableHeader class="amount-col" width="17%" header="Staked XE" :sortQuery="sortQuery"
          sortParam="sortStakedTotal" :onSortingUpdate="updateSorting"
        />
        <TableHeader class="amount-col" width="17%" header="Balance XE" :sortQuery="sortQuery"
          sortParam="balance" :onSortingUpdate="updateSorting"
        />
      </tr>
      </thead>
      <tbody v-if="wallets && wallets.length">
        <WalletsTableItem
          v-for="item in wallets"
          :key="item.id"
          :item="item"
        />
      </tbody>
      <tbody v-else-if="!loaded & loading">
        <td colspan="6" class="block w-full text-center bg-white lg:table-cell py-35">
          Loading...
        </td>
      </tbody>
      <tbody v-else>
        <tr>
          <td colspan="6" class="block w-full text-center bg-white lg:table-cell py-35">
            No wallets.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import TableHeader from '@/components/TableHeader.vue'
import WalletsTableItem from "@/components/WalletsTableItem.vue";
import { fetchWallets } from '@/utils/api.js'

const walletsRefreshInterval = 5 * 1000

export default {
  name: "WalletsTable",
  data: function () {
    return {
      loaded: false,
      loading: false,
      wallets: [],
      iWallets: null
    }
  },
  components: {
    TableHeader,
    WalletsTableItem
  },
  props: [
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
    this.updateWallets()
    // initiate polling
    this.iWallets = setInterval(() => {
      this.updateWallets()
    }, walletsRefreshInterval)
  },
  unmounted() {
    clearInterval(this.iWallets)
  },
  methods: {
    async updateWallets() {
      this.loading = true
      // the sort query sent to index needs to include "-balance", but this is hidden from user in browser url
      const sortQuery = this.$route.query.sort ? `${this.$route.query.sort},-balance` : '-balance'

      const options = {
        limit: this.limit,
        page: this.page,
        sort: sortQuery
      }

      const wallets = await fetchWallets(options)
      this.wallets = wallets.results
      if (this.receiveMetadata) this.receiveMetadata(wallets.metadata)
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
      this.updateWallets()
    },
    sortQuery() {
      this.updateWallets()
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
  @apply font-normal text-sm2 text-left text-black bg-gray-100 border-b-2 border-gray-200 py-13 pl-5;
}

th:first-of-type {
  @apply pl-20;
}

th.amount-col {
  @apply text-right
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
