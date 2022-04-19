<template>
  <div class="flex justify-end">
    <div class="toggle-wrapper">
      <div class="toggle" @click="onClick('day')" :class="isSelected('day') && 'selected'">24 hours</div>
      <div class="toggle" @click="onClick('week')" :class="isSelected('week') && 'selected'">7 days</div>
      <div class="toggle" @click="onClick('month')" :class="isSelected('month') && 'selected'">30 days</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NodeChartTimeToggle",
  data() {
    return {
      
    }
  },
  props: {
    onPeriodUpdate: {
      type: Function
    },
    period: {
      type: String,
      default: 'day'
    }
  },
  methods: {
    isSelected(period) {
      return this.period === period
    },
    onClick(newPeriod) {
      this.onPeriodUpdate(newPeriod)
    }
  }
}
</script>

<style scoped>
.toggle-wrapper {
  @apply flex items-center mb-15 justify-end rounded;
  border: solid 1px rgb(14, 204, 95)
}

.toggle {
  @apply text-gray p-5 w-80 text-center;
  border: solid 1px rgb(14, 204, 95)
}

.toggle.selected {
  color: white;
  background-color: rgb(14, 204, 95);
}

</style>
