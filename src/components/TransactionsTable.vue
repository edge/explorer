<template>
  <div>
    <table>
      <thead class="sticky top-0 z-10 hidden lg:table-header-group">
      <tr>
        <th width="10%">Tx Hash</th>
        <th width="12%">Date</th>
        <th width="16%">From</th>
        <th width="2%" class="hidden lg:table-cell">&nbsp;</th>
        <th width="16%">To</th>
        <th width="16%">Memo</th>
        <th width="10%">Status</th>
        <th width="18%">Amount XE</th>
      </tr>
      </thead>
      <tbody v-if="transactions && transactions.length">
        <tr v-for="item in transactions" :key="item.id" :class="item.pending ? 'italic text-gray-400' : ''">
          <TransactionsTableItem :item="item"/>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td colspan="8" class="block w-full text-center bg-white lg:table-cell py-35">
            No transactions.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import TransactionsTableItem from "@/components/TransactionsTableItem";

export default {
  name: "TransactionsTable",
  components: {
    TransactionsTableItem
  },
  props: ['transactions'],
  methods: {
  }
}
</script>

<style scoped>
table, tbody, tr {
  @apply block;
}

table {
  width: 100%;
}
thead th {
  @apply font-normal text-sm2 text-left bg-gray-100 border-b-2 border-gray-200;
  padding: 0.8125rem 0.3125rem !important;
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
}
</style>
