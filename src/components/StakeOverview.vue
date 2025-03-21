<template>
  <div class="flex flex-col h-full">
    <h3>Stake Overview</h3>

    <div class="flex flex-col flex-1 space-y-2">
      <div class="stakeRow">
        <div class="stakeRow__label">ID</div>
        <div class="stakeRow__value">
          {{ stake.id }}
        </div>
        <div class="stakeRow__clipboard">
          <button
            class="flex-shrink-0 w-24 ml-24 text-green on-clicked-effect"
            @click.prevent="copyToClipboard(stake.id)"
          >
            <ClipboardCopyIcon/>
          </button>
        </div>
      </div>
      <div class="stakeRow">
        <div class="stakeRow__label">Hash</div>
        <div class="stakeRow__value">
          {{ stake.hash }}
        </div>
        <div class="stakeRow__clipboard">
          <button
            class="flex-shrink-0 w-24 ml-24 text-green on-clicked-effect"
            @click.prevent="copyToClipboard(stake.hash)"
          >
            <ClipboardCopyIcon/>
          </button>
        </div>
      </div>
      <div class="stakeRow" v-if="tx">
        <div class="stakeRow__label">Wallet</div>
        <div class="stakeRow__value">
          <router-link :to="{name: 'Wallet', params: {address: tx.recipient}}">
            {{ tx.recipient }}
          </router-link>
        </div>
      </div>
      <div class="stakeRow">
        <div class="stakeRow__label">Type</div>
        <div class="stakeRow__value">{{ stake.type.slice(0, 1).toUpperCase() + stake.type.slice(1) }}</div>
      </div>
      <div class="stakeRow" v-if="stake.device">
        <div class="stakeRow__label">Node</div>
        <div class="stakeRow__value">
          <router-link :to="{name: 'Node', params: {nodeAddress: stake.device}}">{{ stake.device }}</router-link>
        </div>
      </div>
      <div class="stakeRow">
        <div class="stakeRow__label">Amount</div>
        <div class="stakeRow__value">{{ formatAmount(stake.amount / 1e6) }} $EDGE</div>
      </div>
    </div>

  </div>
</template>

<script>
import * as xe from '@edge/xe-utils'
import { CheckCircleIcon, ClockIcon, ClipboardCopyIcon } from '@heroicons/vue/outline'
import { InformationCircleIcon } from '@heroicons/vue/solid'
import Tooltip from '@/components/Tooltip.vue'

export default {
  name: "StakeOverview",
  components: {
    CheckCircleIcon,
    ClockIcon,
    InformationCircleIcon,
    Tooltip,
    ClipboardCopyIcon
  },
  props: {
    tx: {
      type: Object
    },
    stake: {
      type: Object
    }
  },
  methods: {
    formatAmount(amount) {
      return xe.xe.format(amount, true)
    },
    copyToClipboard(input) {
      if (!!navigator.clipboard) {
        return navigator.clipboard.writeText(input)
      }
      window.alert('Clipboard unavailable. Please copy-paste manually.')
    }
  }
}
</script>

<style scoped>
.stakeRow {
  @apply px-12 md:px-24 py-12 text-sm bg-white rounded w-full grid grid-cols-12 items-center;
}

.stakeRow .icon-green {
  @apply text-green;
}

.stakeRow .icon-grey {
  @apply text-gray-400;
}

.stakeRow__label {
  @apply col-span-4 md:col-span-3;
}

.stakeRow__value {
  /* @apply font-mono col-span-8 text-gray-300 md:col-span-9 truncate; */
}

.stakeRow__value {
  @apply font-mono col-span-6 text-gray-300 md:col-span-8 truncate;
}

.stakeRow__value a {
  @apply leading-none border-b border-black border-opacity-25 hover:border-green hover:border-opacity-25 hover:text-green align-middle;
}

.stakeRow__clipboard {
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
