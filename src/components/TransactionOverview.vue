<template>
  <div class="flex flex-col h-full">
    <h3>Transaction Overview</h3>

    <div class="flex flex-col flex-1 space-y-2">
      <div class="transactionRow">
        <div class="transactionRow__label">Timestamp</div>
        <div class="transactionRow__value">{{new Date(transaction.timestamp).toLocaleString()}}</div>
      </div>
      <div class="transactionRow">
        <div class="transactionRow__label flex items-center space-x-3">
          Block
          <Tooltip position="right" theme="light" :text="`The block this transaction was included in.`">
            <InformationCircleIcon class="hidden md:block button__icon w-16" />
          </Tooltip>
        </div>
        <div class="transactionRow__value">
          <router-link :to="{name: 'Block', params: {blockId: transaction.block.height}}">
            {{transaction.block.height}}
          </router-link>
        </div>
      </div>
      <div class="transactionRow">
        <div class="transactionRow__label">Tx Hash</div>
        <div class="transactionRow__value">
          <router-link :to="{name: 'Transaction', params: {transactionId: transaction.hash}}">
            {{transaction.hash}}
          </router-link>
        </div>
      </div>
      <div class="transactionRow">
        <div class="transactionRow__label">From</div>
        <div class="transactionRow__value">{{transaction.sender}}</div>
      </div>
      <div class="transactionRow">
        <div class="transactionRow__label">To</div>
        <div class="transactionRow__value">{{transaction.recipient}}</div>
      </div>
      <div class="transactionRow">
        <div class="transactionRow__label">Amount</div>
        <div class="transactionRow__value">{{ formatAmount(transaction.amount) }} XE</div>
      </div>
      <div class="transactionRow">
        <div class="transactionRow__label">Memo</div>
        <div class="transactionRow__value">
          <span :class="{'text-gray-400': !transaction.memo}">
            {{transaction.memo || 'None'}}
          </span>
        </div>
      </div>

      <!-- <div class="transactionRow">
        <div class="transactionRow__label">Block Hash</div>
        <div class="transactionRow__value">
          <router-link :to="{name: 'Block', params: {blockId: transaction.block.hash}}">
            {{transaction.block.hash}}
          </router-link>
        </div>
      </div> -->
      <div class="transactionRow">
        <div class="transactionRow__label">Confirmations</div>
        <div class="transactionRow__value">{{ transaction.confirmations }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  InformationCircleIcon
} from '@heroicons/vue/solid'
import Tooltip from '@/components/Tooltip'
const { formatXe } = require('@edge/wallet-utils')

export default {
  name: "TransactionOverview",
  components: {
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
