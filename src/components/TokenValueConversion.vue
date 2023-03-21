<template>
  <div class="flex flex-col w-full">
    <span class="text-sm monospace">{{title}}</span>
    <span class="value">
      <span v-if="currency === 'usd'">$</span>
      {{formattedValue}}
      <span class="currency-unit" v-if="currency === 'xe'"> $XE</span>
    </span>
  </div>
</template>

<script>
export default {
  name: 'TokenValueConversion',
  props: ['currency', 'hideConversion', 'title', 'value'],
  data() {
    return {
      numFormatter: {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }
    }
  },
  computed: {
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