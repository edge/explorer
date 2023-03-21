<template>
  <div class="w-full">
    <h3>Coin Value</h3>
    <div class="relative max-h-full tile">
      <div class="flex justify-between mb-12">
        <TokenValueConversion
          title="Coin Value"
          :value="0.0341"
          currency="usd"
        />
        <TokenValueConversion
          title="Market Cap"
          :value="3406525"
          currency="usd"
        />
      </div>
      <OverviewTokenChart
        chartID="Total Revenue"
        :datasets="datasets"
        :timeSeries="timeSeries"
        :tooltipCallback="tooltipCallback"
        yLabel="Price in BTC"
        y1Label="Price in ETH"
      />
    </div>
  </div>
</template>

<script>
import OverviewTokenChart from '@/components/OverviewTokenChart'
import TokenValueConversion from '@/components/TokenValueConversion'

export default {
  name: 'OverviewChartCoinValue',
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
          data: [0.000285, 0.000284, 0.000281, 0.000280, 0.000282, 0.000295, 0.000295, 0.000295, 0.000292, 0.000290, 0.000291, 0.000291, 0.000292, 0.000292, 0.000287, 0.000281, 0.000272, 0.000261, 0.000262, 0.000263, 0.000264, 0.000270, 0.000272, 0.000280],
          // fill: true,
          label: 'Coin Value (BTC)',
          pointRadius: this.pointRadius,
          yAxisID: 'y'
        },
        {
          backgroundColor: 'rgb(255,138,138)',
          borderColor: 'rgb(220, 60, 60)',
          data: [0.000185/15.55, 0.000187/15.55, 0.000181/15.55, 0.000172/15.55, 0.000161/15.55, 0.000162/15.55, 0.000163/15.55, 0.000164/15.55, 0.000170/15.55, 0.000172/15.55, 0.000180/15.55, 0.000184/15.55, 0.000181/15.55, 0.000180/15.55, 0.000182/15.55, 0.000195/15.55, 0.000195/15.55, 0.000195/15.55, 0.000192/15.55, 0.000190/15.55, 0.000191/15.55, 0.000191/15.55, 0.000192/15.55, 0.000192/15.55],
          // fill: true,
          label: 'Coin Value (ETH)',
          pointRadius: this.pointRadius,
          yAxisID: 'y1'
        }
      ],
      pointRadius: 5,
      xLabel: 'Time',
    }
  },
  methods: {
    tooltipCallback(tooltipItem) {
      let currency
      if (tooltipItem.dataset.yAxisID === 'y') currency = 'BTC'
      else if (tooltipItem.dataset.yAxisID === 'y1') currency = 'ETH'
      return tooltipItem.raw.toLocaleString(undefined, {
        maximumSignificantDigits: 8,
        minimumSignificantDigits: 4,
        maximumFractionDigits: 8,
        roundingPriority: 'lessPrecision'
      }) + ' ' + currency
    }
  }
}
</script>

<style>
.tile {
  @apply flex-1 p-12 md:p-24 text-sm text-gray-300 bg-white rounded;
}
</style>