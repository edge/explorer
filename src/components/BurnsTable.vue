<template>
  <div class="transaction-table">
    <table>
      <thead class="hidden lg:table-header-group">
        <tr v-if="sortable">
           <TableHeader width="165" header="Date" :sortQuery="sortQuery"
            sortParam="timestamp" :onSortingUpdate="updateSorting"
          />
          <TableHeader width="15%" header="Hash" :sortQuery="sortQuery"
            sortParam="hash" :onSortingUpdate="updateSorting" :sortAscFirst="true"
          />
          <TableHeader width="15%" header="Parent Tx" :sortQuery="sortQuery"
            sortParam="parentTx" :onSortingUpdate="updateSorting" :sortAscFirst="true"
          />
          <TableHeader width="15%" header="From" :sortQuery="sortQuery"
            sortParam="sender" :onSortingUpdate="updateSorting" :sortAscFirst="true"
          />
          <!-- <th width="24" class="hidden lg:table-cell">&nbsp;</th>
          <TableHeader width="15%" header="To" :sortQuery="sortQuery"
            sortParam="recipient" :onSortingUpdate="updateSorting" :sortAscFirst="true"
          /> -->
          <TableHeader width="30%" header="Description" :sortQuery="sortQuery"
            sortParam="description" :onSortingUpdate="updateSorting"
          />
          <TableHeader width="125" header="Status" :sortQuery="sortQuery"
            sortParam="pending" :onSortingUpdate="updateSorting"
          />
          <TableHeader class="amount-col" width="25%" header="Amount XE" :sortQuery="sortQuery"
            sortParam="amount" :onSortingUpdate="updateSorting"
          />
        </tr>
        <tr v-else>
          <th width="165">Date</th>
          <th width="20%">Hash</th>
          <th width="20%">Parent Tx</th>
          <th width="20%">From</th>
          <!-- <th width="24" class="hidden lg:table-cell">&nbsp;</th>
          <th width="15%">To</th> -->
          <th width="20%">Description</th>
          <th width="100">Status</th>
          <th class="amount-col" width="20%">Amount XE</th>
        </tr>
      </thead>
      <tbody v-if="burns.length">
        <BurnsTableItem
          v-for="item in burns"
          :key="item.hash"
          :item="item"
        />
      </tbody>
      <tbody v-else-if="!loaded && loading">
        <td :colspan="7" class="block w-full text-center bg-white lg:table-cell py-35">
          Loading...
        </td>
      </tbody>
      <tbody v-else>
        <tr>
          <td :colspan="7" class="block w-full text-center bg-white lg:table-cell py-35">
            No burns.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
/*global process*/
import * as index from '@edge/index-utils'
import BurnsTableItem from '@/components/BurnsTableItem'
import TableHeader from '@/components/TableHeader'

const burnsRefreshInterval = 5 * 1000

export default {
  name: 'BurnsTable',
  data: function () {
    return {
      burns: [],
      iBurns: null,
      loaded: false,
      loading: false,
    }
  },
  components: {
    BurnsTableItem,
    TableHeader
  },
  props: [
    'limit',
    'page',
    'receiveMetadata',
    'sortable'
  ],
  computed: {
    sortQuery() {
      return this.$route.query.sort || this.$route.query.txSort
    }
  },
  mounted() {
    this.updateBurns()
    // initiate polling
    this.iBurns = setInterval(() => {
      this.updateBurns()
    }, burnsRefreshInterval)
  },
  unmounted() {
    clearInterval(this.iBurns)
  },
  methods: {
    async updateBurns() {
      this.loading = true

      // the sort query sent to index needs to include "-created", but this is hidden from user in browser url
      const sortQuery = this.sortQuery ? `${this.sortQuery},-timestamp` : '-timestamp'
      const burns = await index.burn.burns(
        process.env.VUE_APP_INDEX_API_URL,
        {
          limit: this.limit,
          page: this.page,
          sort: sortQuery
        }
      )
      this.burns = burns.results
      if (this.receiveMetadata) this.receiveMetadata(burns.metadata)

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
      this.updateBurns()
    },
    sortQuery() {
      this.updateBurns()
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

th.amount-col {
  @apply text-right pr-30
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
