<template>
  <div class="flex flex-col h-full">
    <h3>Block Overview</h3>
    <div class="flex flex-col flex-1 space-y-2">
      <div class="blockRow">
        <div class="blockRow__label">Timestamp</div>
        <div class="blockRow__value flex items-center" :class="block.height === 0 ? 'date' : ''">
          {{ new Date(block.timestamp).toLocaleString() }}
          <Tooltip
            v-if="block.height === 0"
            class="ml-3 icon-grey" position="top" :wide="true"
            text="This timestamp was mistakenly specified in the genesis transaction in seconds, instead of milliseconds by XE architect Adam K Dean. The actual date was 01/01/2021, 00:00:00">
            <InformationCircleIcon class="ml-1 button__icon w-16" />
          </Tooltip>
        </div>
      </div>
      <div class="blockRow">
        <div class="blockRow__label">Height</div>
        <div class="blockRow__value">
          <router-link v-if="$route.params.blockId != block.height" :to="{name: 'Block', params: {blockId: block.height}}">
            {{ block.height }}
          </router-link>
          <span v-else>{{ block.height }}</span>
        </div>
      </div>
      <div class="blockRow">
        <div class="blockRow__label">Block Hash</div>
        <div class="blockRow__value">
          <router-link v-if="$route.params.blockId != block.hash" :to="{name: 'Block', params: {blockId: block.hash}}">
            {{ block.hash }}
          </router-link>
          <span v-else>{{ block.hash }}</span>
        </div>
        <div class="blockRow__clipboard">
          <button
            class="flex-shrink-0 w-24 ml-24 text-green on-clicked-effect"
            @click.prevent="copyToClipboard(block.hash)"
          >
            <ClipboardCopyIcon/>
          </button>
        </div>
      </div>
      <div class="blockRow">
        <div class="blockRow__label">Parent Hash</div>
        <div class="blockRow__value">
          <router-link :to="{name: 'Block', params: {blockId: block.parent}}">
            {{ block.parent }}
          </router-link>
        </div>
        <div class="blockRow__clipboard">
          <button
            class="flex-shrink-0 w-24 ml-24 text-green on-clicked-effect"
            @click.prevent="copyToClipboard(block.parent)"
          >
            <ClipboardCopyIcon/>
          </button>
        </div>
      </div>
      <div class="blockRow">
        <div class="blockRow__label">Data Hash</div>
        <div class="blockRow__value">{{ block.dataHash }}</div>
        <div class="blockRow__clipboard">
          <button
            class="flex-shrink-0 w-24 ml-24 text-green on-clicked-effect"
            @click.prevent="copyToClipboard(block.dataHash)"
          >
            <ClipboardCopyIcon/>
          </button>
        </div>
      </div>
      <div class="blockRow">
        <div class="blockRow__label">Ledger Hash</div>
        <div class="blockRow__value">{{ block.ledgerHash }}</div>
        <div class="blockRow__clipboard">
          <button
            class="flex-shrink-0 w-24 ml-24 text-green on-clicked-effect"
            @click.prevent="copyToClipboard(block.ledgerHash)"
          >
            <ClipboardCopyIcon/>
          </button>
        </div>
      </div>
      <div class="blockRow">
        <div class="blockRow__label">Transactions</div>
        <div class="blockRow__value">{{ block.txCount }}</div>
      </div>
      <div class="blockRow">
        <div class="blockRow__label">Total $EDGE</div>
        <div class="blockRow__value">{{ totalXe }} $EDGE</div>
      </div>
      <div class="blockRow">
        <div class="blockRow__label">Nonce</div>
        <div class="blockRow__value">{{ block.nonce }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import * as xe from '@edge/xe-utils'
import { ClipboardCopyIcon } from '@heroicons/vue/outline'
import { InformationCircleIcon } from '@heroicons/vue/solid'
import Tooltip from '@/components/Tooltip.vue'

export default {
  name: "BlockOverview",
  components: {
    ClipboardCopyIcon,
    InformationCircleIcon,
    Tooltip
  },
  props: {
    block: {
      type: Object
    }
  },
  computed: {
    totalXe() {
      return xe.xe.formatMxe(this.block.total, true)
    }
  },
  methods: {
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
.blockRow {
  @apply px-12 md:px-24 py-12 text-sm bg-white rounded w-full grid grid-cols-12 items-center;
}
.blockRow__label {
  @apply col-span-4 md:col-span-3;
}
.blockRow__value {
  @apply font-mono col-span-6 md:col-span-8 text-gray-300 truncate;
}
.blockRow__value.date {
  overflow: unset;
  text-overflow: unset;
  white-space: unset
}
.blockRow__value a {
  @apply leading-none border-b border-black border-opacity-25 hover:border-green hover:border-opacity-25 hover:text-green align-middle;
}
.blockRow__clipboard {
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
