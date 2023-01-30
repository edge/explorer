<template>
  <div class="flex flex-col h-full">
    <h3>Burn Overview</h3>

    <div class="flex flex-col flex-1 space-y-2">
      <div class="burnRow">
        <div class="burnRow__label">Timestamp</div>
        <div class="burnRow__value flex items-center">
          {{ new Date(burn.timestamp).toLocaleString() }}
        </div>
      </div>
      <div class="burnRow" v-if="isPending">
        <div class="burnRow__label">Status</div>
        <div class="burnRow__value pending">
          <span class="icon icon-grey mb-2"><ClockIcon/></span>
          <span class="ml-5 inline-block">Pending for {{ secondsPending }} seconds</span>
        </div>
      </div>
      <div class="burnRow">
        <div class="burnRow__label">Hash</div>
        <div class="burnRow__value">
            {{ burn.hash }}
        </div>
        <div class="burnRow__clipboard">
          <button
            class="flex-shrink-0 w-24 ml-24 text-green on-clicked-effect"
            @click.prevent="copyToClipboard(burn.hash)"
          >
            <ClipboardCopyIcon/>
          </button>
        </div>
      </div>
      <div class="burnRow">
        <div class="burnRow__label">Parent Tx</div>
        <div class="burnRow__value">
          <router-link :to="{name: 'Transaction', params: {txHash: burn.parentTx}}">
            {{ burn.parentTx }}
          </router-link>
        </div>
        <div class="burnRow__clipboard">
          <button
            class="flex-shrink-0 w-24 ml-24 text-green on-clicked-effect"
            @click.prevent="copyToClipboard(burn.parentTx)"
          >
            <ClipboardCopyIcon/>
          </button>
        </div>
      </div>
      <div class="burnRow">
        <div class="burnRow__label">From</div>
        <div class="burnRow__value">
          <router-link :to="{name: 'Wallet', params: {address: burn.sender}}">
            {{ burn.sender }}
          </router-link>
        </div>
      </div>
      <div class="burnRow">
        <div class="burnRow__label">To</div>
        <div class="burnRow__value">
          <router-link :to="{name: 'Wallet', params: {address: burn.recipient}}">
            {{ burn.recipient }}
          </router-link>
        </div>
      </div>
      <div class="burnRow">
        <div class="burnRow__label">Amount</div>
        <div class="burnRow__value">{{ formatAmount(burn.amount / 1e6) }} XE</div>
      </div>
      <div class="burnRow">
        <div class="burnRow__label">Description</div>
        <div class="burnRow__value">
          <span>{{ burn.description || 'Misc' }}</span>
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
  name: "BurnOverview",
  components: {
    ClipboardCopyIcon,
    CheckCircleIcon,
    ClockIcon,
    InformationCircleIcon,
    Tooltip
  },
  props: {
    burn: {
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
      const ms = Date.now() - this.burn.timestamp
      this.secondsPending = Math.floor(ms/1000)
    }
  },
  data: function() {
    return {
      secondsPending: 0,
      secondsPendingInterval: null
    }
  },
  computed: {
    isPending() {
      return this.burn.pending
    }
  },
  mounted() {
    if (this.burn.pending) {
      this.secondsPendingInterval = setInterval(this.updateSecondsPending, 1000)
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
.burnRow {
  @apply px-12 md:px-24 py-12 text-sm bg-white rounded w-full grid grid-cols-12 items-center;
}

.burnRow .icon {
  @apply w-18 inline-block align-middle;
}

.burnRow .icon-green {
  @apply text-green;
}

.burnRow .icon-grey {
  @apply text-gray-400;
}

.burnRow__label {
  @apply col-span-4 md:col-span-3;
}

.burnRow__value {
  @apply font-mono col-span-6 text-gray-300 md:col-span-8 truncate;
}
.burnRow__value.date {
  overflow: unset;
  text-overflow: unset;
  white-space: unset
}

.burnRow__value.pending {
  @apply text-gray-400;
}

.burnRow__value a {
  @apply text-gray-300 leading-none border-b border-black border-opacity-25 hover:border-green hover:border-opacity-25 hover:text-green align-middle;
}

.burnRow__clipboard {
  @apply font-mono col-span-2 text-gray-300 md:col-span-1;
}

.on-clicked-effect {
  transition: all 0.4s ease-in;
}

.on-clicked-effect:before {
  content: '';
  background-color: aliceblue;
  border-radius: 50%;
  display: block;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transform: scale(0.001, 0.001);
}

.on-clicked-effect:focus:not(:active) {
  position: relative;
  display: inline-block;
  outline: 0;
}

.on-clicked-effect:focus:not(:active):before {
  animation: clicked_animation 0.8s ease-out;
}

@keyframes clicked_animation {
  50% {
    transform: scale(1.5, 1.5);
    opacity: 0;
  }
  99% {
    transform: scale(0.001, 0.001);
    opacity: 0;
  }
  100% {
    transform: scale(0.001, 0.001);
    opacity: 1;
  }
}
</style>
