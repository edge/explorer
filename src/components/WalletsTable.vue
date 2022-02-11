<template>
  <div>
    <table>
      <thead class="sticky top-0 z-10 hidden lg:table-header-group">
      <tr>
        <th width="30%">Address</th>
        <th width="20%">Latest Tx</th>
        <th width="10%">Transactions</th>
        <th width="5%">Stakes</th>
        <th width="15%" class="amount-col">Staked XE</th>
        <th width="15%" class="amount-col">Balance XE</th> 
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
table {
  @apply w-full table-fixed
}

table, tbody, tr {
  @apply block;
}
table {
  width: 100%;
}
thead th {
  @apply font-normal text-sm2 text-left bg-gray-100 border-b-2 border-gray-200;
  padding: 0.8125rem 0.3125rem;
}
thead th:first-of-type {
  padding-left: 1.25rem !important;
}
thead th:last-of-type {
  padding-right: 1.875rem !important;
}
thead th:last-child {
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

  th.amount-col {
    @apply text-right pr-30
  }
}
</style>
