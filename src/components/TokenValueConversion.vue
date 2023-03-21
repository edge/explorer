<template>
  <div class="flex flex-col w-full">
    <span class="text-sm monospace">{{title}}</span>
    <span class="value">
      <span v-if="currency === 'usd'">$</span>
      {{formattedValue}}
      <span class="currency-unit" v-if="currency === 'xe'"> $XE</span>
    </span>
    <!-- <span v-if="!hideConversion" class="conversion-value">{{btcValue}} BTC</span>
    <span v-if="!hideConversion" class="conversion-value">{{ethValue}} ETH</span>
    <div v-if="hideConversion" class="hide-conversion"></div> -->
  </div>
</template>

<script>
export default {
  name: 'TokenValueConversion',
  props: ['currency', 'hideConversion', 'title', 'value'],
  data() {
    return {
      btcPerXE: 0.00006694237756459952 / 15.22,
      ethPerXE: 0.00006694237756459952,
      usdPerXE: 0.11560145296875564,
      numFormatter: {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }
    }
  },
  computed: {
    btcValue() {
      if (this.currency === 'usd') return (this.value * this.btcPerXE / this.usdPerXE).toLocaleString(undefined, this.numFormatter)
      else if (this.currency === 'xe') return (this.value * this.btcPerXE).toLocaleString(undefined, this.numFormatter)
    },
    ethValue() {
      if (this.currency === 'usd') return (this.value * this.ethPerXE / this.usdPerXE).toLocaleString(undefined, this.numFormatter)
      else if (this.currency === 'xe') return (this.value * this.ethPerXE).toLocaleString(undefined, this.numFormatter)
    },
    formattedValue() {
      if (this.currency === 'usd') return this.value.toLocaleString(undefined, this.numFormatter)
      else if (this.currency === 'xe') return this.value.toLocaleString(undefined, this.numFormatter)
    }
  }
}
</script>

<style>
.value {
  @apply text-2xl text-black py-4;
}

.value .currency-unit {
  @apply text-sm;
}

.conversion-value {
  @apply text-xs leading-tight;
}

.hide-conversion {
  height: 27.5px;
}
</style>