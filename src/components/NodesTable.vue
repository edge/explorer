<template>
  <table>
    <thead class="hidden lg:table-header-group">
      <tr v-if="sortable">
        <TableHeader width="12%" header="ID" :sortQuery="sortQuery"
          sortParam="id" :onSortingUpdate="updateSorting"
        />
        <TableHeader width="12%" header="Hash" :sortQuery="sortQuery"
          sortParam="hash" :onSortingUpdate="updateSorting"
        />
        <th width="23%">Wallet</th>
        <TableHeader width="20%" header="Device" :sortQuery="sortQuery"
          sortParam="device" :onSortingUpdate="updateSorting"
        />
        <TableHeader width="8%" header="Type" :sortQuery="sortQuery"
          sortParam="type" :onSortingUpdate="updateSorting"
        />
        <TableHeader width="8%" header="Status" :sortQuery="sortQuery"
          sortParam="released,unlockRequested" :onSortingUpdate="updateSorting"
        />
        <TableHeader class="amount-col" width="15%" header="Amount XE" :sortQuery="sortQuery"
          sortParam="amount" :onSortingUpdate="updateSorting"
        />
      </tr>
      <tr v-else>
        <th width="20%">Address</th>
        <th width="20%">Gateway</th>
        <th width="20%">Stargate</th>
        <th width="8%">Type</th>
        <th width="12%">Location</th>
        <th width="8%">Availability</th>
        <th width="12%">Last Seen</th>
      </tr>
    </thead>
    <tbody v-if="nodes.length">
      <NodesTableItem
        v-for="item in nodes"
        :key="item.id"
        :item="item"
      />
    </tbody>
    <tbody v-else-if="!loaded & loading">
      <td colspan="7" class="block w-full text-center bg-white lg:table-cell py-35">
        Loading...
      </td>
    </tbody>
    <tbody v-else>
      <tr>
        <td colspan="7" class="block w-full text-center bg-white lg:table-cell py-35">
          No Nodes.
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
/*global process*/
import * as index from '@edge/index-utils'
import NodesTableItem from '@/components/NodesTableItem'
import TableHeader from '@/components/TableHeader'

const nodesRefreshInterval = 5 * 1000

export default {
  name: 'NodesTable',
  data: function () {
    return {
      loaded: false,
      loading: false,
      nodes: [],
      iNodes: null
    }
  },
  components: {
    NodesTableItem,
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
      return this.$route.query.sort
    },
    address() {
      return this.$route.params.address
    },
    stargateAddress() {
      return this.$route.params.stargate || 'N/a'
    },
    gatewayAddress() {
      return this.$route.params.gateway || 'N/a'
    }
  },
  mounted() {
    this.updateNodes()
    // initiate polling
    this.iNodes = setInterval(() => {
      this.updateNodes()
    }, nodesRefreshInterval)
  },
  unmounted() {
    clearInterval(this.iNodes)
  },
  methods: {
    async updateNodes() {
      this.loading = true
      // the sort query sent to index needs to include "-created", but this is hidden from user in browser url
      const sortQuery = this.$route.query.sort ? `${this.$route.query.sort},-created` : '-created'
      // const nodes = await index.node.nodes(
      //   process.env.VUE_APP_INDEX_API_URL,
      //   this.wallet,
      //   {
      //     limit: this.limit,
      //     page: this.page,
      //     sort: sortQuery
      //   }
      // )
      // this.nodes = nodes.results
      const nodes = []
      this.receiveMetadata(nodes.metadata)
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
      this.updateNodes()
    },
    sortQuery() {
      this.updateNodes()
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
