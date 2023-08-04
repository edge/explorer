<template>
  <div class="w-full relative">
    <h3>Coin Value</h3>
    <div class="time-toggle">
      <OverviewChartTimeToggle
        :period="chartPeriod"
        :onPeriodUpdate="updateChartPeriod"
      />
    </div>
    <div class="relative max-h-full tile">
      <div class="summary flex justify-between mb-12 gap-4">
        <OverviewTokenSummary
          v-if="coinValue"
          title="Current Value"
          :value="coinValue"
          currency="usd"
        />
        <OverviewTokenSummary
          v-if="marketCap"
          title="Market Cap"
          :value="marketCap"
          currency="usd"
        />
      </div>
      <OverviewTokenChart
        v-if="timeSeries.length"
        chartID="Total Revenue"
        :datasets="datasets"
        :timeSeries="timeSeries"
        :tooltipCallback="tooltipCallback"
        yLabel="Price in USD"
        y1Label="Price in ETH"
        :zoom="true"
      />
    </div>
  </div>
</template>

<script>
import OverviewChartTimeToggle from '@/components/OverviewChartTimeToggle.vue'
import OverviewTokenChart from '@/components/OverviewTokenChart.vue'
import OverviewTokenSummary from '@/components/OverviewTokenSummary.vue'
import moment from 'moment'
import superagent from 'superagent'

export default {
  name: 'OverviewCoinValue',
  components: {
    OverviewChartTimeToggle,
    OverviewTokenChart,
    OverviewTokenSummary
  },
  data() {
    return {
      chartPeriod: 'month',
      coinValue: null,
      marketCap: null,
      data: [],
      xLabel: 'Time',
    }
  },
  computed: {
    datasets() {
      if (!this.data) return []
      return [
        {
          backgroundColor: 'rgba(110,224,159)',
          borderColor: 'rgb(14, 204, 95)',
          data: this.data.map(r => r.usdPerXE),
          label: 'Coin Value (USD)',
          yAxisID: 'y'
        },
        {
          backgroundColor: 'rgb(137,136, 172)',
          borderColor: 'rgb(97, 96, 144)',
          data: this.data.map(r => r.ethPerXE),
          label: 'Coin Value (ETH)',
          yAxisID: 'y1'
        }
      ]
    },
    query() {
      if (this.chartPeriod === 'week') return '?count=7'
      if (this.chartPeriod === 'month') return '?count=30'
    },
    timeSeries() {
      if (!this.data) return []
      else return this.data.map(r => moment(new Date(r.date)).format(this.timeSeriesFormat))
    }
  },
  methods: {
    tooltipCallback(tooltipItem) {
      let currency
      if (tooltipItem.dataset.yAxisID === 'y') currency = 'USD'
      else if (tooltipItem.dataset.yAxisID === 'y1') currency = 'ETH'
      return tooltipItem.raw.toLocaleString(undefined, {
        maximumSignificantDigits: 8,
        minimumSignificantDigits: 4,
        maximumFractionDigits: 8,
        roundingPriority: 'lessPrecision'
      }) + ' ' + currency
    },
    updateChartPeriod(newPeriod) {
      this.chartPeriod = newPeriod
    },
    async updateCoinValue() {
      try {
        const response = await superagent.get(`${import.meta.env.VITE_INDEX_API_URL}/token/daily${this.query}`)
        this.coinValue = response.body[0].usdPerXE.toLocaleString(undefined, {
          maximumFractionDigits: 6,
          minimumFractionDigits: 6
        })
        this.data = response.body.reverse()
        if (this.chartPeriod === 'week') this.timeSeriesFormat = 'ddd'
        if (this.chartPeriod === 'month') this.timeSeriesFormat = 'll'
      } catch (error) {
        console.error(error)
      }
    },
    async updateMarketCap() {
      try {
        const response = await superagent.get(`${import.meta.env.VITE_INDEX_API_URL}/supply/circulating`)
        this.marketCap = response.body['Circulating Supply'] * this.data[this.data.length - 1].usdPerXE
      }
      catch (error) {
        console.error(error)
      }
    }
  },
  async mounted() {
    await this.updateCoinValue()
    this.updateMarketCap()
    this.intervalID = setInterval(async () => {
      await this.updateCoinValue()
      this.updateMarketCap()
    }, 60000)
  },
  unmounted() {
    clearInterval(this.intervalID)
  },
  watch: {
    async chartPeriod() {
      await this.updateCoinValue()
      this.updateMarketCap()
    }
  }
}
</script>

<style>
.tile {
  @apply flex-1 p-12 md:p-24 text-sm text-gray-300 bg-white rounded;
}
.time-toggle {
  @apply absolute right-0 -top-8;
}

@media screen and (max-width: 350px) {
  .time-toggle {
    @apply hidden;
  }
  .summary {
    @apply flex-col;
    color: rgb(3, 52, 76)
  }
}
</style>
