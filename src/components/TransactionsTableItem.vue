<template>
  <tr v-if="!wallet" :class="item.pending && 'pending'">
    <td data-title="Date:" :title="date">
      <span class="lg:inline-block">
        {{ date }}
      </span>
    </td>

    <td data-title="Tx Hash:" :title="item.hash">
      <router-link :to="txHashRoute">
        <span class="monospace lg:inline-block">
          {{ item.hash }}
        </span>
      </router-link>
    </td>

    <td data-title="From:" :title="item.sender">
      <router-link :to="fromAddressRoute">
        <span class="monospace lg:inline-block">
          {{ item.sender }}
        </span>
      </router-link>
    </td>

    <td class="arrow-icon">
      <span class="mr-1 -mt-2 icon icon-green lg:inline-block"><ArrowRightIcon /></span>
    </td>

    <td data-title="To:" :title="item.recipient">
      <router-link :to="toAddressRoute">
        <span class="monospace lg:inline-block">
          {{ item.recipient }}
        </span>
      </router-link>
    </td>

    <td data-title="Memo:" :title="item.data.memo || 'None'">
      <span class="lg:inline-block"><span class="monospace lg:font-sans" :class="!item.data.memo && 'text-gray-400'">
        {{ item.data.memo || 'None'}}
      </span></span>
    </td>

    <td data-title="Status:" :title="statusFormatted">
      <span v-if="isConfirmed" class="lg:inline-block">
        <span class="mr-1 -mt-2 icon icon-green">
          <BurnIcon v-if="burn"/>
          <CheckCircleIcon v-else />
        </span>
        <span class="monospace lg:font-sans">{{ statusFormatted }}</span>
      </span>
      <span v-else class="lg:inline-block">
        <span class="mr-1 -mt-2 icon icon-grey">
          <BurnIcon v-if="burning" class="filter grayscale"/>
          <ClockIcon v-else />
        </span>
        <span class="monospace lg:font-sans text-gray-400">{{ statusFormatted }}</span>
      </span>
    </td>

    <td data-title="Amount (XE):" class="amount-col">
      <span class="monospace lg:inline-block">
        {{ formattedAmount }}
      </span>
    </td>
  </tr>

  <!--for tx table in wallet, display a single "from/to" column rather than separate from and to columns-->
  <tr v-else :class="item.pending && 'pending'">
    <td data-title="Date:">
      <span class="lg:inline-block">
        {{ date }}
      </span>
    </td>

    <td data-title="Tx Hash:" :title="item.hash">
      <router-link :to="txHashRoute">
        <span class="monospace lg:inline-block">
          {{ item.hash }}
        </span>
      </router-link>
    </td>

    <td v-if="sent" data-title="To:" class="from-to" :title="item.recipient">
      <span>
        <span class="icon-wrap"><ArrowUpIcon class="icon inline-icon icon-red"/></span>
        <router-link :to="toAddressRoute">
          <span class="monospace lg:inline-block">
            {{ item.recipient }}
          </span>
        </router-link>
      </span>
    </td>
    <td v-else data-title="From:" class="from-to" :title="item.sender">
      <span>
        <span class="icon-wrap"><ArrowDownIcon class="icon inline-icon icon-green"/></span>
        <router-link :to="fromAddressRoute">
          <span class="monospace lg:inline-block">
            {{ item.sender }}
          </span>
        </router-link>
      </span>
    </td>

    <td data-title="Memo:" :title="item.data.memo || 'None'">
      <span class="lg:inline-block"><span class="monospace lg:font-sans" :class="!item.data.memo && 'text-gray-400'">
        {{ item.data.memo || 'None'}}
      </span></span>
    </td>

    <td data-title="Status:" :title="statusFormatted">
      <span v-if="isConfirmed" class="lg:inline-block">
        <span class="mr-1 -mt-2 icon icon-green">
          <BurnIcon v-if="burn"/>
          <CheckCircleIcon v-else />
        </span>
        <span class="monospace lg:font-sans">{{ statusFormatted }}</span>
      </span>
      <span v-else class="lg:inline-block">
        <span class="mr-1 -mt-2 icon icon-grey">
          <BurnIcon v-if="burning" class="filter grayscale"/>
          <ClockIcon v-else/>
        </span>
        <span class="monospace lg:font-sans text-gray-400">{{ statusFormatted }}</span>
      </span>
    </td>

    <td data-title="Amount (XE):" class="amount-col" :title="`${sent ? '-' : ''}${formattedAmount}`">
      <span class="monospace lg:inline-block">
        {{ `${sent && item.amount > 0 ? '-' : ''}${formattedAmount}` }}
      </span>
    </td>
  </tr>
</template>

<script>
/*global process*/
import BurnIcon from './BurnIcon.vue'
import { formatXe } from '@edge/wallet-utils'
import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon, CheckCircleIcon, ClockIcon } from '@heroicons/vue/outline'

export default {
  name: 'TransactionsTableItem',
  props: [
    'item'
  ],
  components: {
    ArrowDownIcon,
    ArrowRightIcon,
    ArrowUpIcon,
    BurnIcon,
    CheckCircleIcon,
    ClockIcon
  },
  computed: {
    burn() {
      return this.item.recipient === 'xe_0000000000000000000000000000000000000000'
    },
    burning() {
      return this.burn && !this.item.pending && this.item.confirmations < 10
    },
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
      return {name: 'Transaction', params: {txHash: this.item.hash}}
    },
    formattedAmount() {
      return formatXe(this.item.amount / 1e6, true)
    },
    isConfirmed() {
      return ((this.item.confirmations || 0) >= 10)
    },
    statusFormatted() {
      if (this.item.pending) return 'Pending'
      if (this.item.confirmations === 1) {
        if (this.burn) return 'Burning'
        return `${this.item.confirmations} confirmation`
      }
      if (this.item.confirmations < 10) {
        if (this.burn) return 'Burning'
        return `${this.item.confirmations} confirmations`
      }
      else {
        if (this.burn) return 'Burned'
        return 'Confirmed'
      }
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

td .inline-icon {
  @apply inline-block mb-2 lg:mb-0
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

td.arrow-icon {
  @apply lg:table-cell hidden
}

td a {
  @apply border-b border-black border-opacity-25 hover:border-green hover:border-opacity-25 hover:text-green align-middle;
}

tr.pending {
  @apply italic text-gray-400;
}

tr.pending a {
  @apply italic text-gray-400;
}

td.from-to span {
  @apply lg:w-11/12;
}

.icon-wrap {
  @apply max-w-max
}

@screen lg {
  td {
    @apply border-gray-200 pt-13 pb-10 table-cell border-b-2 align-middle;
  }

  td:first-child {
    @apply pl-20 pt-13;
  }

  td.amount-col {
    @apply text-right pr-30;
  }

  td:last-child {
    @apply pb-10 border-b-2;
  }

  td:before {
    @apply hidden;
  }
}
</style>
