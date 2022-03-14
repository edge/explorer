<template>
  <table>
    <thead class="hidden lg:table-header-group">
      <tr v-if="sortable">
        <TableHeader width="20%" header="Address" :sortQuery="sortQuery"
          sortParam="node.address" :onSortingUpdate="updateSorting"
        />
        <!-- currently no sorting on gateway and stargate columns as stargate address isn't contained in a host node's data -->
        <th width="15%">Gateway</th>
        <th width="15%">Stargate</th>
        <TableHeader width="8%" header="Type" :sortQuery="sortQuery"
          sortParam="node.type" :onSortingUpdate="updateSorting"
        />
        <TableHeader width="20%" header="Location" :sortQuery="sortQuery"
          sortParam="node.geo.city" :onSortingUpdate="updateSorting"
        />
        <TableHeader width="10" header="Availability" :sortQuery="sortQuery"
          sortParam="sortAvailability" :onSortingUpdate="updateSorting"
        />
        <TableHeader width="12%" header="Last Seen" :sortQuery="sortQuery"
          sortParam="lastActive" :onSortingUpdate="updateSorting"
        />
      </tr>
      <tr v-else>
        <th width="20%">Address</th>
        <th width="16%">Gateway</th>
        <th width="16%">Stargate</th>
        <th width="8%">Type</th>
        <th width="20%">Location</th>
        <th width="8%">Availability</th>
        <th width="12%">Last Seen</th>
      </tr>
    </thead>
    <tbody v-if="sessions.length">
      <NodesTableItem
        v-for="item in sessions"
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

const nodesRefreshInterval = 60 * 1000

export default {
  name: 'NodesTable',
  data: function () {
    return {
      loaded: false,
      loading: false,
      sessions: [],
      iSessions: null
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
    address() {
      return this.$route.params.address
    },
    sortQuery() {
      return this.$route.query.sort
    }
  },
  mounted() {
    this.updateSessions()
    // initiate polling
    this.iSessions = setInterval(() => {
      this.updateSessions()
    }, nodesRefreshInterval)
  },
  unmounted() {
    clearInterval(this.iSessions)
  },
  methods: {
    async updateSessions() {
      this.loading = true
      // the sort query sent to index needs to include "-created", but this is hidden from user in browser url
      const sortQuery = this.$route.query.sort ? `${this.$route.query.sort},-lastActive,node.address` : '-lastActive,node.address'
      const sessionsData = await index.session.sessions(
        process.env.VUE_APP_INDEX_API_URL,
        {
          limit: this.limit,
          page: this.page,
          sort: sortQuery
        }
      )
      
      // add stargate address to host sessions
      const sessions = await Promise.all(sessionsData.results.map(async (session) => {
        if (session.node.type === 'host') {
          const gateway = await index.session.session(process.env.VUE_APP_INDEX_API_URL, session.node.gateway)
          session.node.stargate = gateway.node.stargate
        }
        return session
      }))
      
      this.sessions = sessions
      this.receiveMetadata(sessionsData.metadata)

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
      this.updateSessions()
    },
    sortQuery() {
      this.updateSessions()
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
