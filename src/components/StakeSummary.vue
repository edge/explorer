<template>
  <div class="flex flex-col h-full">
    <h3>Stake Summary</h3>
    <div class="tile">
      This stake was created on <span class="emphasis">{{new Date(stake.created).toLocaleString().split(',')[0]}}</span> at <span class="emphasis">{{new Date(stake.created).toLocaleString().split(',')[1]}}</span>.
      It was first confirmed in block <span class="emphasis">{{stake.block.height}}</span>.
      It belongs to the wallet <span class="emphasis">{{tx.recipient}}</span>.
      It was last modified on <span class="emphasis">{{new Date(tx.timestamp).toLocaleString().split(',')[0]}}</span> at <span class="emphasis">{{new Date(tx.timestamp).toLocaleString().split(',')[1]}}</span>.
      It is a <span class="emphasis">{{stake.type.slice(0, 1).toUpperCase() + stake.type.slice(1)}}</span> stake.

      <span v-if="stake.device && stake.deviceAssigned">
        It is currently assigned to the device <span class="emphasis">{{stake.device}}</span>.
      </span>

      <span v-if="stake.released">
        It was <span class="emphasis">released</span> on <span class="emphasis">{{new Date(stake.released).toLocaleString().split(',')[0]}}</span> at <span class="emphasis">{{new Date(stake.released).toLocaleString().split(',')[1]}}</span>.
      </span>
      <span v-else-if="stake.unlockRequested">
        <span v-if="stake.unlockRequested + stake.unlockPeriod > Date.now()">
          It is currently <span class="emphasis">unlocking</span>. It will unlock on <span class="emphasis">{{new Date(stake.unlockRequested + stake.unlockPeriod).toLocaleString().split(',')[0]}}</span> at <span class="emphasis">{{new Date(stake.unlockRequested + stake.unlockPeriod).toLocaleString().split(',')[1]}}</span>.
        </span>
        <span v-else>
          It is <span class="emphasis">unlocked</span>.
        </span>
      </span>
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
  }
}
</script>

<style scoped>
  .tile {
    @apply flex-1 p-12 md:p-24 text-sm text-gray-300 bg-white rounded md:pr-50;
  }
  .tile span.emphasis {
    @apply text-gray-900 font-medium font-mono;
  }
</style>
