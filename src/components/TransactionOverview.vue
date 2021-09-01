<template>
  <div class="flex flex-col h-full">
    <h3>Transaction Overview</h3>

    <div class="flex flex-col flex-1 space-y-2">
      <div class="transactionRow">
        <div class="transactionRow__label">Timestamp</div>
        <div class="transactionRow__value">{{ new Date(transaction.timestamp).toLocaleString() }}</div>
      </div>
      <div class="transactionRow">
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
          <router-link :to="{ name: 'Transaction', params: { transactionId: transaction.hash } }">
            {{ transaction.hash }}
          </router-link>
        </div>
      </div>
      <div class="transactionRow">
        <div class="transactionRow__label">From</div>
        <div class="transactionRow__value">{{ transaction.sender }}</div>
      </div>
      <div class="transactionRow">
        <div class="transactionRow__label">To</div>
        <div class="transactionRow__value">{{ transaction.recipient }}</div>
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
      <div class="transactionRow">
        <div class="transactionRow__label flex items-center space-x-3">
          Confirmations
          <Tooltip
            class="ml-3 icon-grey" position="right" wide="true"
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
        <div class="transactionRow__label">{{ transaction.exchangeResult.destToken === 'XE' ? 'Deposit Tx' : 'Withdrawal Tx' }}</div>
        <div class="transactionRow__value">
          <router-link
            v-if="transaction.exchangeResult.destToken === 'XE'"
            :to="{ name: 'Transaction', params: { transactionId: transaction.exchangeResult.completedTransactionHash } }">
            {{ transaction.exchangeResult.completedTransactionHash }}
          </router-link>
          <a target="_about" class=""
            v-if="transaction.exchangeResult.destToken === 'EDGE'"
            :href="`https://etherscan.io/tx/${transaction.exchangeResult.completedTransactionHash}`">
            {{ transaction.exchangeResult.completedTransactionHash }}
          </a>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { CheckCircleIcon, ClockIcon } from '@heroicons/vue/outline'
import { InformationCircleIcon } from '@heroicons/vue/solid'
import Tooltip from '@/components/Tooltip'
const { formatXe } = require('@edge/wallet-utils')

export default {
  name: "TransactionOverview",
  components: {
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
    formatAmount(amount) {
      return formatXe(amount, true)
    }
  }
}
</script>

<style scoped>
.transactionRow {
  @apply px-12 md:px-24 py-12 text-sm bg-white rounded w-full grid grid-cols-12 items-center;
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
  @apply font-mono col-span-8 text-gray-300 md:col-span-9 truncate;
}

.transactionRow__value a {
  @apply leading-none border-b border-black border-opacity-25 hover:border-green hover:border-opacity-25 hover:text-green align-middle;
}
</style>
