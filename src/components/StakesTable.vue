<template>
  <div class="stake-table">
    <table>
      <thead class="sticky top-0 z-10 hidden lg:table-header-group">
      <tr>
        <th width="16%">ID</th>
        <th width="16%">Hash</th>
        <th width="16%">Wallet</th>
        <th width="16%">Device</th>
        <th width="12%">Type</th>
        <th width="12%">Status</th>
        <th width="16%">Amount XE</th>
      </tr>
      </thead>
      <tbody v-if="stakes && stakes.length">
        <tr v-for="item in stakes" :key="item.id" :class="item.pending ? 'italic text-gray-400' : ''">
          <StakesTableItem :item="item"/>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td colspan="8" class="block w-full text-center bg-white lg:table-cell py-35">
            No stakes.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import StakesTableItem from "@/components/StakesTableItem";

export default {
  name: "StakesTable",
  components: {
    StakesTableItem
  },
  props: ['stakes'],
  methods: {
  }
}
</script>

<style scoped>
table, tbody, tr {
  @apply block;
}

th {
  @apply font-normal text-sm2 text-left bg-gray-100 border-b-2 border-gray-200;
}

th:last-child {
  @apply rounded-r-4 text-right;
}

@screen lg {
  .stake-table thead th {
    @apply py-2;
  }

tbody {
    @apply table-row-group;
  }

  table {
    @apply table;
  }

  tr {
    @apply table-row;
  }
}
</style>
