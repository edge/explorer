<template>
  <tr>
    <td data-title="Address:" :title="item.address">
      <router-link :to="addressRoute">
        <span class="monospace md:inline-block">{{ item.address }}</span>
      </router-link>
      <span class="icon-wrap"><BadgeCheckIcon v-if="item.trusted" class="trusted" /></span>
    </td>

    <td data-title="Latest Tx:">
      <router-link :to="latestTxRoute">
        <span class="monospace md:inline-block">{{ item.latestTransaction.hash }}</span>
      </router-link>
    </td>

    <td data-title="Transactions:">
      <span class="monospace md:inline-block">{{ txCountFormatted }}</span>
    </td>

    <td data-title="Stakes:">
      <span class="monospace md:inline-block">{{ stakeCountFormatted }}</span>
    </td>

    <td data-title="Staked XE:" class="amount-col">
      <span class="monospace md:inline-block">{{ stakedFormatted }}</span>
    </td>

    <td data-title="Balance (XE):" class="amount-col">
      <span class="monospace md:inline-block">{{ balanceFormatted }}</span>
    </td>
  </tr>
</template>

<script>
const { xeStringFromMicroXe } = require('@edge/wallet-utils')
import { BadgeCheckIcon } from '@heroicons/vue/solid'

export default {
  name: "WalletsTableItem",
  props: ['item'],
  components: {
    BadgeCheckIcon
  },
  computed: {
    addressRoute() {
      return {name: 'Wallet', params: {address: this.item.address}}
    },
    latestTxRoute() {
      return {name: 'Transaction', params: {hash: this.item.latestTransaction.hash}}
    },
    balanceFormatted() {
      return this.formatAmount(this.item.balance)
    },
    stakedFormatted() {
      return this.formatAmount(this.item.staked)
    },
    stakeCountFormatted() {
      return this.formatNumber(this.item.stakeCount)
    },
    txCountFormatted() {
      return this.formatNumber(this.item.txCount)
    }
  },
  methods: {
    formatAmount(amount) {
      return xeStringFromMicroXe(amount, true)
    },
    formatNumber(number) {
      return number.toLocaleString('en-US')
    }
  }
}
</script>

<style scoped>
td {
  @apply bg-white text-sm2 font-normal flex items-center px-5 break-all max-w-full pb-4 leading-tight;
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

td .icon {
  @apply w-15 inline-block align-middle;
}

td .icon-green {
  @apply text-green;
}

td .icon-grey {
  @apply text-gray-400;
}

td .icon-red {
  @apply text-red;
}

td a {
  @apply border-b border-black border-opacity-25 hover:border-green hover:border-opacity-25 hover:text-green align-middle;
}

td span {
  @apply w-full overflow-ellipsis overflow-hidden whitespace-nowrap;
}

td a {
  @apply overflow-ellipsis overflow-hidden whitespace-nowrap;
}

.trusted {
  @apply w-18 h-18 inline-block ml-2 text-green mb-2 lg:mb-0;
}

.icon-wrap {
  @apply max-w-max
}

@screen lg {
  td {
    @apply border-gray-200 pt-13 pb-10 table-cell border-b-2 align-middle;
  }

  td span {
    @apply w-11/12;
  }

  td:first-child {
    @apply pl-20 pt-13;
  }

  td:last-child {
    @apply pr-30 pb-10 text-right border-b-2;
  }

  td.amount-col {
    @apply pr-30 text-right;
  }

  td:before {
    @apply hidden;
  }
}
</style>
