<template>
  <div class="flex flex-col h-full">
    <h3>Transaction Summary</h3>
    <div class="tile" v-if="isPending">
      This transaction was sent on <span class="emphasis">{{new Date(transaction.timestamp).toLocaleString().split(',')[0]}}</span> at <span class="emphasis">{{new Date(transaction.timestamp).toLocaleString().split(',')[1]}}</span>. It is currently pending.
    </div>
    <div class="tile" v-if="transaction.block">
      This transaction was sent on <span class="emphasis">{{new Date(transaction.timestamp).toLocaleString().split(',')[0]}}</span> at <span class="emphasis">{{new Date(transaction.timestamp).toLocaleString().split(',')[1]}}</span>. It was first confirmed in block <span class="emphasis">{{ transaction.block.height }}</span>.
      A total of <span class="emphasis">{{formatAmount(transaction.amount)}} $EDGE</span> was sent.
      <span v-if="!transaction.memo">
        It did not contain a memo.
      </span>
      <span v-else>
        The transaction had a memo that read <span class="emphasis">{{transaction.memo}}</span>.
      </span>
    </div>
  </div>
</template>

<script>
import * as xe from '@edge/xe-utils'

export default {
  name: "TransactionSummary",
  props: {
    transaction: {
      type: Object
    }
  },
  computed: {
    isPending() {
      return this.transaction.pending
    }
  },
  methods: {
    formatAmount(amount) {
      return xe.xe.format(amount, true)
    }
  }
}
</script>

<style scoped>
  .tile {
    @apply flex-1 p-12 md:p-24 text-sm text-gray-300 bg-white rounded md:pr-50 break-words;
  }
  .tile span.emphasis {
    @apply text-gray-900 font-medium font-mono;
  }
</style>
