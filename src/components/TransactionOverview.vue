<template>
  <div class="flex flex-col h-full">
    <h3>Transaction Overview</h3>

    <div class="flex flex-col flex-1 space-y-2">
      <div class="transactionRow">
        <div class="transactionRow__label">Timestamp</div>
        <div class="transactionRow__value">{{ new Date(transaction.timestamp).toLocaleString() }}</div>
      </div>
      <div class="transactionRow" v-if="isPending">
        <div class="transactionRow__label">Status</div>
        <div class="transactionRow__value pending">
          <span class="icon icon-grey mb-2"><ClockIcon/></span>
          <span class="ml-5 inline-block">Pending for {{secondsPending}} seconds</span>
        </div>
      </div>
      <div class="transactionRow" v-else>
        <div class="transactionRow__label">Block</div>
        <div class="transactionRow__value">
          <router-link :to="{ name: 'Block', params: { blockId: transaction.block.height } }">
            {{ transaction.block.height }}
          </router-link>
        </div>
      </div>
      <div class="transactionRow">
        <div class="transactionRow__label">Tx Hash</div>
        <div class="transactionRow__value">
            {{ transaction.hash }}
        </div>
        <div class="transactionRow__clipboard">
          <button
            class="flex-shrink-0 w-24 ml-24 text-green on-clicked-effect"            
            @click.prevent="copyToClipboard(transaction.hash)"
          >
            <ClipboardCopyIcon/>
          </button>
        </div>
      </div>
      <div class="transactionRow">
        <div class="transactionRow__label">From</div>
        <div class="transactionRow__value">
          <router-link :to="{name: 'Wallet', params: {address: transaction.sender}}">
            {{ transaction.sender }}
          </router-link>
        </div>
      </div>
      <div class="transactionRow">
        <div class="transactionRow__label">To</div>
        <div class="transactionRow__value">
          <router-link :to="{name: 'Wallet', params: {address: transaction.recipient}}">
            {{ transaction.recipient }}
          </router-link>
        </div>
      </div>
      <div class="transactionRow">
        <div class="transactionRow__label">Amount</div>
        <div class="transactionRow__value">{{ formatAmount(transaction.amount) }} XE</div>
      </div>
      <div class="transactionRow">
        <div class="transactionRow__label">Memo</div>
        <div class="transactionRow__value">
          <span :class="{ 'text-gray-400': !transaction.memo }">
            {{ transaction.memo || 'None' }}
          </span>
        </div>
      </div>
      <div class="transactionRow" v-if="transaction.confirmations > 0">
        <div class="transactionRow__label flex items-center space-x-3">
          Confirmations
          <Tooltip
            class="ml-3 icon-grey" position="right" :wide="true"
            text="The number of blocks since this transaction was included in the blockchain">
            <InformationCircleIcon class="hidden md:block button__icon w-16" />
          </Tooltip>
        </div>

        <div class="transactionRow__value">{{ transaction.confirmations }}</div>
      </div>
      <div v-if="transaction.exchangeResult" class="transactionRow">
        <div class="transactionRow__label">Exchange Status</div>
        <div class="transactionRow__value flex items-center space-x-3">
          <span v-if="transaction.exchangeResult.completedTransactionHash" class="flex items-center space-x-3">
            <CheckCircleIcon class="mr-4 w-16 icon-green" />
            Completed
          </span>
          <span v-else class="flex items-center space-x-3">
            <ClockIcon class="mr-4 w-16 icon-grey" />
            Pending
          </span>
        </div>
      </div>
      <div class="transactionRow" v-if="transaction.exchangeResult && transaction.exchangeResult.completedTransactionHash">
        <div class="transactionRow__label">{{
          transaction.exchangeResult.destToken === 'XE'
            ? 'Deposit Tx'
            : transaction.exchangeResult.destToken === 'EDGE'
              ? 'Withdrawal Tx'
              : 'Sale Tx'
          }}</div>
        <div class="transactionRow__value">
          <router-link
            v-if="transaction.exchangeResult.destToken === 'XE'"
            :to="{ name: 'Transaction', params: { hash: transaction.exchangeResult.completedTransactionHash } }">
            {{ transaction.exchangeResult.completedTransactionHash }}
          </router-link>
          <a target="_about" class=""
            v-if="transaction.exchangeResult.destToken === 'EDGE'"
            :href="`${etherscanUrl}/tx/${transaction.exchangeResult.completedTransactionHash}`">
            {{ transaction.exchangeResult.completedTransactionHash }}
          </a>
          <a target="_about" class=""
            v-if="transaction.exchangeResult.destToken === 'USDC'"
            :href="`${etherscanUrl}/tx/${transaction.exchangeResult.completedTransactionHash}`">
            {{ transaction.exchangeResult.completedTransactionHash }}
          </a>
        </div>
      </div>
      <div class="transactionRow" v-if="transaction.exchangeResult && transaction.exchangeResult.feeTransactionHash">
        <div class="transactionRow__label">Fee Tx</div>
        <div class="transactionRow__value">
          <router-link
            :to="{ name: 'Transaction', params: { hash: transaction.exchangeResult.feeTransactionHash } }">
            {{ transaction.exchangeResult.feeTransactionHash }}
          </router-link>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { CheckCircleIcon, ClockIcon, ClipboardCopyIcon } from '@heroicons/vue/outline'
import { InformationCircleIcon } from '@heroicons/vue/solid'
import Tooltip from '@/components/Tooltip'
const { formatXe } = require('@edge/wallet-utils')

export default {
  name: "TransactionOverview",
  components: {
    ClipboardCopyIcon,
    CheckCircleIcon,
    ClockIcon,
    InformationCircleIcon,
    Tooltip
  },
  props: {
    transaction: {
      type: Object
    }
  },
  methods: {
    copyToClipboard(input) {
      if (!!navigator.clipboard) {
        return navigator.clipboard.writeText(input)
      }
      window.alert('Clipboard unavailable. Please copy-paste manually.')
    },
    formatAmount(amount) {
      return formatXe(amount, true)
    },
    updateSecondsPending() {
      const ms = Date.now() - this.transaction.timestamp
      this.secondsPending = Math.floor(ms/1000)
    }
  },
  data: function() {
    return {
      secondsPending: 0,
      secondsPendingInterval: null,
      etherscanUrl: process.env.VUE_APP_IS_TESTNET === 'true' ? 'https://rinkeby.etherscan.io' : 'https://etherscan.io'
    }
  },
  computed: {
    isPending() {
      return this.transaction.block.height === 0 && this.transaction.confirmations === 0
    }
  },
  mounted() {
    if (this.transaction.block.height === 0) {
      this.secondsPendingInterval = setInterval(this.updateSecondsPending, 1000)
      this.refreshTxInterval = setInterval(this.updateTx, 30*1000)
    }
  },
  unmounted() {
    if (this.secondsPendingInterval !== null) {
      clearInterval(this.secondsPendingInterval)
    }
  }
}
</script>

<style scoped>
.transactionRow {
  @apply px-12 md:px-24 py-12 text-sm bg-white rounded w-full grid grid-cols-12 items-center;
}

.transactionRow .icon {
  @apply w-18 inline-block align-middle;
}

.transactionRow .icon-green {
  @apply text-green;
}

.transactionRow .icon-grey {
  @apply text-gray-400;
}

.transactionRow__label {
  @apply col-span-4 md:col-span-3;
}

.transactionRow__value {
  @apply font-mono col-span-6 text-gray-300 md:col-span-8 truncate;
}

.transactionRow__value.pending {
  @apply text-gray-400;
}

.transactionRow__value a {
  @apply leading-none border-b border-black border-opacity-25 hover:border-green hover:border-opacity-25 hover:text-green align-middle;
}

.transactionRow__clipboard {
  @apply font-mono col-span-2 text-gray-300 md:col-span-1;
}
</style>
