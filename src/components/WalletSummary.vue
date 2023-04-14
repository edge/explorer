<template>
  <div class="flex flex-col h-full">
    <h3>Wallet Summary</h3>
    <div class="relative max-h-full tile md:pr-50" v-html="generateWalletSummary()">
    </div>
  </div>
</template>

<script>
import { xeStringFromMicroXe } from '@edge/wallet-utils'

export default {
  name: "WalletSummary",
  props: {
    wallet: {
      type: Object
    }
  },
  methods: {
    formatAmount(amount) {
      return xeStringFromMicroXe(amount, true)
    },
    generateWalletSummary() {
      if (this.wallet) {
        let summary = `The wallet with address <span class="emphasis word-break">${this.wallet.address}</span> has a balance of <span class="emphasis">${this.formatAmount(this.wallet.balance)}</span> XE. `
        summary += `It has <span class="emphasis">${this.wallet.txCount.toLocaleString()}</span> ${this.wallet.txCount === 1 ? 'transaction' : 'transactions'} associated with it. `
        if (this.wallet.staked) {
          summary += `It has <span class="emphasis">${this.wallet.stakeCount}</span> ${this.wallet.stakeCount === 1 ? 'stake' : 'stakes'} with a total value of <span class="emphasis">${this.formatAmount(this.wallet.staked)}</span> XE. `
        }
        summary += `The nonce is <span class="emphasis">${this.wallet.nonce}</span>. `

        let enhancedSummary = ''
        if (this.wallet.trusted && this.wallet.name) enhancedSummary += `It is a <span class="emphasis">named</span> and <span class="emphasis">trusted</span> wallet. `
        else if (this.wallet.trusted) enhancedSummary += `It is a <span class="emphasis">trusted</span> wallet. `
        else if (this.wallet.name) enhancedSummary += `It is a <span class="emphasis">named</span> wallet. `

        if (this.wallet.description) enhancedSummary += `${this.wallet.description}`

        return enhancedSummary.length ? `${summary}<br><br>${enhancedSummary}` : summary
      }
    }
  }
}
</script>

<!-- See https://medium.com/@brockreece/scoped-styles-with-v-html-c0f6d2dc5d8e for >>> syntax -->
<style scoped>
  .tile {
    @apply flex-1 p-12 md:p-24 text-sm text-gray-300 bg-white rounded break-words break-words;
  }
  .tile >>> span.emphasis {
    @apply text-gray-900 font-medium font-mono;
  }
  button {
    @apply leading-none text-sm2 border-b border-black border-opacity-25 hover:border-green hover:border-opacity-25 hover:text-green align-middle;
  }
</style>
