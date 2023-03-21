<template>
  <div class="w-full">
    <h3>On Chain Revenue</h3>
    <div class="relative max-h-full tile">
      <div class="flex justify-between mb-12">
        <TokenValueConversion
          :hideConversion="true"
          title="Average Daily Revenue"
          :value="12433"
          currency="xe"
        />
        <TokenValueConversion
          :hideConversion="true"
          title="Total Revenue"
          :value="406525"
          currency="xe"
        />
      </div>
      <OverviewTokenChart
        chartID="Total Revenue"
        :timeSeries="timeSeries"
        :datasets="datasets"
        yLabel="Total XE"
      />
    </div>
  </div>
</template>

<script>
import OverviewTokenChart from '@/components/OverviewTokenChart'
import TokenValueConversion from '@/components/TokenValueConversion'

export default {
  name: 'OverviewChartRevenue',
  components: {
    OverviewTokenChart,
    TokenValueConversion
  },
  data() {
    return {
      timeSeries: ["1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM","6:00 PM","7:00 PM","8:00 PM","9:00 PM","10:00 PM","11:00 PM","12:00 AM","1:00 AM","2:00 AM","3:00 AM","4:00 AM","5:00 AM","6:00 AM","7:00 AM","8:00 AM","9:00 AM","10:00 AM","11:00 AM","12:00 PM"],
      datasets: [
        {
          backgroundColor: 'rgba(110,224,159)',
          borderColor: 'rgb(14, 204, 95)',
          data: [406525, 401656, 419623, 418324, 417221, 403352, 390161, 379216, 351651, 315613, 380621, 406525, 406524, 406527, 419223, 436525, 446525, 466525, 496525, 506525, 516525, 501620, 511651, 511651],
          fill: true,
          label: 'Total Revenue (XE)',
          pointRadius: this.pointRadius
        }
      ],
      pointRadius: 5,
      xLabel: 'Time',
    }
  },
  methods: {
    tooltipCallback(tooltipItem) {
      return tooltipItem.raw.toLocaleString() + ' XE'
    }
  }
}
</script>

<style>
.tile {
  @apply flex-1 p-12 md:p-24 text-sm text-gray-300 bg-white rounded;
}
</style>