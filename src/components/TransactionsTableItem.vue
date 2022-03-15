<template>
  <tr v-if="!wallet" :class="item.pending && 'pending'">
    <td data-title="Date:" :title="date">
      <div class="overflow"><span class="overflow">
        {{ date }}
      </span></div>
    </td>

    <td data-title="Tx Hash:" :title="item.hash">
      <router-link :to="txHashRoute">
        <span class="monospace md:inline-block">
          {{ item.hash }}
        </span>
      </router-link>
    </td>
    
    <td data-title="From:" :title="item.sender">
      <router-link :to="fromAddressRoute">
        <span class="monospace md:inline-block">
          {{ item.sender }}
        </span>
      </router-link>
    </td>

    <td>
      <span class="mr-1 -mt-2 icon icon-green"><ArrowRightIcon /></span>
    </td>

    <td data-title="To:" :title="item.recipient">
      <router-link :to="toAddressRoute">
        <span class="monospace md:inline-block">
          {{ item.recipient }}
        </span>
      </router-link>
    </td>

    <td data-title="Memo:" :title="item.data.memo || 'None'">
      <div class="overflow"><span class="monospace md:font-sans" :class="!item.data.memo && 'text-gray-400'">
        {{ item.data.memo || 'None'}}
      </span></div>
    </td>

    <td data-title="Status:">
      <span v-if="isConfirmed && item.confirmations > 9">
        <span class="mr-1 -mt-2 icon icon-green"><CheckCircleIcon /></span>
        <span class="monospace md:font-sans">{{ statusFormatted }}</span>
      </span>
      <span v-else>
        <span class="mr-1 -mt-2 icon icon-grey"><ClockIcon/></span>
        <span class="monospace md:font-sans text-gray-400">{{ statusFormatted }}</span>
      </span>
    </td>

    <td data-title="Amount (XE):" class="amount-col">
      <span class="monospace">
        {{ formattedAmount }}
      </span>
    </td>
  </tr>

  <!--for tx table in wallet, display a single "from/to" column rather than separate from and to columns-->
  <tr v-else :class="item.pending && 'pending'">
    <td data-title="Date:">
      <span class="md:inline-block">
        {{ date }}
      </span>
    </td>

    <td data-title="Tx Hash:" :title="item.hash">
      <router-link :to="txHashRoute">
        <span class="monospace md:inline-block">
          {{ item.hash }}
        </span>
      </router-link>
    </td>

    <td v-if="sent" data-title="To:">
      <span class="icon-wrap">
        <span class="mr-1 -mt-2 icon icon-red"><ArrowUpIcon /></span>
        <router-link :to="toAddressRoute">
          <span class="monospace md:inline-block">
            {{ item.recipient }}
          </span>
        </router-link>
      </span>
    </td>
    <td v-else data-title="From:">
      <span class="icon-wrap">
        <span class="mr-1 -mt-2 icon icon-green"><ArrowDownIcon /></span>
        <router-link :to="fromAddressRoute">
          <span class="monospace md:inline-block">
            {{ item.sender }}
          </span>
        </router-link>
      </span>
    </td>

    <td data-title="Memo:" :title="item.data.memo || 'None'">
      <div class="overflow"><span class="monospace md:font-sans" :class="!item.data.memo && 'text-gray-400'">
        {{ item.data.memo || 'None'}}
      </span></div>
    </td>

    <td data-title="Status:">
      <span v-if="isConfirmed && item.confirmations > 10">
        <span class="mr-1 -mt-2 icon icon-green"><CheckCircleIcon /></span>
        <span
          class="monospace md:font-sans">{{ statusFormatted }}</span>
      </span>
      <span v-else>
        <span class="mr-1 -mt-2 icon icon-grey"><ClockIcon/></span>
        <span
          class="monospace md:font-sans text-gray-400">{{ statusFormatted }}</span>
      </span>
    </td>

    <td data-title="Amount (XE):" class="amount-col">
      <span class="monospace">
        {{ `${sent ? '-' : ''}${formattedAmount}` }}
      </span>
    </td>
  </tr>
</template>

<script>
/*global process*/
import { formatXe } from '@edge/wallet-utils'
import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon, CheckCircleIcon, ClockIcon } from '@heroicons/vue/outline'

export default {
  name: 'StakesTableItem',
  props: [
    'item'
  ],
  components: {
    ArrowDownIcon,
    ArrowRightIcon,
    ArrowUpIcon,
    CheckCircleIcon,
    ClockIcon
  },
  computed: {
    date() {
      return new Date(this.item.timestamp).toLocaleString()
    },
    fromAddressRoute() {
      return {name: 'Wallet', params: {address: this.item.sender}}
    },
    toAddressRoute() {
      return {name: 'Wallet', params: {address: this.item.recipient}}
    },
    txHashRoute() {
      return {name: 'Transaction', params: {hash: this.item.hash}}
    },
    formattedAmount() {
      return formatXe(this.item.amount / 1e6, true)
    },
    isConfirmed() {
      return (!this.item.pending || !this.item.confirmations < 10)
    },
    statusFormatted() {
      if (this.item.pending) return 'Pending'
      if (this.item.confirmations === 1) return `${this.item.confirmations} confirmation`
      if (this.item.confirmations < 10) return `${this.item.confirmations} confirmations`
      return 'Confirmed'
    },
    sent() {
      return this.item.sender === this.item.recipient || this.wallet === this.item.sender
    },
    wallet() {
      return this.$route.params.address
    }
  }
}
</script>

<style scoped>
td {
  @apply bg-white text-sm2 font-normal flex items-center px-5 break-all max-w-full pb-4 leading-tight;
}

td span {
  @apply w-full overflow-ellipsis overflow-hidden whitespace-nowrap;
}

td a {
  @apply overflow-ellipsis overflow-hidden whitespace-nowrap;
}

td .overflow {
  @apply overflow-ellipsis overflow-hidden whitespace-nowrap;
}

td::before {
  content: attr(data-title);
  @apply font-normal mr-8 min-w-100 text-xs text-gray-600 pt-2;
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

.icon-wrap {
  @apply flex overflow-ellipsis overflow-hidden whitespace-nowrap;
}

td a {
  @apply leading-none border-b border-black border-opacity-25 hover:border-green hover:border-opacity-25 hover:text-green align-middle;
}

tr.pending {
  @apply italic text-gray-400;
}

tr.pending a {
  @apply italic text-gray-400;
}

@screen lg {
  td {
    @apply border-gray-200 pt-13 pb-15 table-cell border-b-2 align-middle;
  }

  td:first-child {
    @apply pl-20 pt-13;
  }

  td.amount-col {
    @apply text-right;
  }

  td:last-child {
    @apply pr-30 pb-13 text-right border-b-2;
  }

  td:before {
    @apply hidden;
  }
}
</style>
