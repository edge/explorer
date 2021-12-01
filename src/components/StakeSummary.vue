<template>
  <div class="flex flex-col h-full">
    <h3>Stake Summary</h3>
    <div class="relative max-h-full tile md:pr-50" v-html="generateStakeSummary()">
    </div>
  </div>
</template>

<script>
export default {
  name: "StakeSummary",
  props: {
    tx: {
      type: Object
    },
    stake: {
      type: Object
    }
  },
  methods: {
    generateStakeSummary() {
      const stake = this.stake
      const tx = this.tx

      let summary = `This stake was created on <span class="emphasis">${new Date(stake.created).toLocaleString().split(',')[0]}</span> at <span class="emphasis">${new Date(stake.created).toLocaleString().split(',')[1]}</span>. `
      summary += `It was first confirmed in block <span class="emphasis">${stake.block.height}</span>. `
      summary += `It was last modified on <span class="emphasis">${new Date(tx.timestamp).toLocaleString().split(',')[0]}</span> at <span class="emphasis">${new Date(tx.timestamp).toLocaleString().split(',')[1]}</span>. `
      summary += `It ${stake.released ? 'belonged' : 'belongs'} to the wallet <span class="emphasis">${tx.recipient}</span>. `
      summary += `It ${stake.released ? 'was' : 'is'} a <span class="emphasis">${stake.type.slice(0, 1).toUpperCase() + stake.type.slice(1)}</span> stake. `

      let enhancedSummary = ''
      if (stake.released) enhancedSummary += `It was <span class="emphasis">released</span> on <span class="emphasis">${new Date(stake.released).toLocaleString().split(',')[0]}</span> at <span class="emphasis">${new Date(stake.released).toLocaleString().split(',')[1]}</span>. `
      else if (stake.unlockRequested) {
        if (stake.unlockRequested + stake.unlockPeriod > Date.now()) enhancedSummary += `It is currently <span class="emphasis">unlocking</span>. It will unlock on <span class="emphasis">${new Date(stake.unlockRequested + stake.unlockPeriod).toLocaleString().split(',')[0]}</span> at <span class="emphasis">${new Date(stake.unlockRequested + stake.unlockPeriod).toLocaleString().split(',')[1]}</span>. `
        else enhancedSummary += `It is <span class="emphasis">unlocked</span>. `
      }
      else if (stake.device && stake.deviceAssigned) enhancedSummary += `It is currently assigned to <span class="emphasis">${stake.device}</span>. `

      return enhancedSummary.length ? `${summary}<br><br>${enhancedSummary}` : summary
    }
  }
}
</script>

<!-- See https://medium.com/@brockreece/scoped-styles-with-v-html-c0f6d2dc5d8e for >>> syntax -->
<style scoped>
  .tile {
    @apply flex-1 p-12 md:p-24 text-sm text-gray-300 bg-white rounded;
  }
  .tile >>> span.emphasis {
    @apply text-gray-900 font-medium font-mono;
  }
  button {
    @apply leading-none text-sm2 border-b border-black border-opacity-25 hover:border-green hover:border-opacity-25 hover:text-green align-middle;
  }
</style>
