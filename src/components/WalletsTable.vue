<template>
  <div class="wallet-table">
    <table>
      <thead class="sticky top-0 z-10 hidden lg:table-header-group">
      <tr>
        <th>Address</th>
        <th>First Tx Date</th>
        <th>Hash</th>
        <th>Latest Tx Date</th>
        <th>Hash</th>
        <th>Balance XE</th>
      </tr>
      </thead>
      <tbody v-if="wallets && wallets.length">
        <tr v-for="item in wallets" :key="item.id" :class="item.pending ? 'italic text-gray-400' : ''">
          <WalletsTableItem :item="item"/>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td colspan="5" class="block w-full text-center bg-white lg:table-cell py-35">
            No wallets.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import WalletsTableItem from "@/components/WalletsTableItem";

export default {
  name: "WalletsTable",
  components: {
    WalletsTableItem
  },
  props: ['wallets'],
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
