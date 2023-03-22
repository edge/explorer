<template>
  <div class="w-full mb-25 relative">
    <h3>On Chain Revenue</h3>
    <div class="absolute right-0 -top-8">
      <OverviewChartTimeToggle
        :period="chartPeriod"
        :onPeriodUpdate="updateChartPeriod"
      />
    </div>
    <div class="relative max-h-full tile">
      <div class="flex justify-between mb-12 space-x-4">
        <OverviewTokenSummary
          v-if="averageRevenue"
          :hideConversion="true"
          title="Average Daily Revenue"
          :value="averageRevenue"
          currency="xe"
          tooltipText="Average over chart period"
        />
        <OverviewTokenSummary
          v-if="totalRevenue"
          :hideConversion="true"
          title="Total Revenue"
          :value="totalRevenue"
          currency="xe"
        />
      </div>
      <OverviewTokenChart
        v-if="timeSeries.length"
        chartID="Total Revenue"
        :beginAtZero="true"
        :timeSeries="timeSeries"
        :tooltipCallback="tooltipCallback"
        :datasets="datasets"
        yLabel="Daily XE"
      />
    </div>
  </div>
</template>

<script>
import OverviewChartTimeToggle from '@/components/OverviewChartTimeToggle'
import OverviewTokenChart from '@/components/OverviewTokenChart'
import OverviewTokenSummary from '@/components/OverviewTokenSummary'
import moment from 'moment'
import superagent from 'superagent'

export default {
  name: 'OverviewRevenue',
  components: {
    OverviewChartTimeToggle,
    OverviewTokenChart,
    OverviewTokenSummary
  },
  data() {
    return {
      chartPeriod: 'month',
      averageRevenue: null,
      totalRevenue: null,
      data: null,
      pointRadius: 5,
      xLabel: 'Time',
    }
  },
  computed: {
    datasets() {
      if (!this.data) return []
      const data = this.data.map(r => r.amount / 1e6)
      return [
        {
          backgroundColor: 'rgba(110,224,159)',
          borderColor: 'rgb(14, 204, 95)',
          data,
          fill: true,
          label: 'Total Revenue (XE)'
        }
      ]
    },
    query() {
      if (this.chartPeriod === 'week') return '?count=7'
      if (this.chartPeriod === 'month') return '?count=30'
    },
    timeSeries() {
      if (!this.data) return []
      else return this.data.map(r => moment(r.start).format(this.timeSeriesFormat))
    }
  },
  methods: {
    tooltipCallback(tooltipItem) {
      return tooltipItem.raw.toLocaleString(undefined, {
        minimumFractionDigits: 6,
        maximumFractionDigits: 6
      }) + ' XE'
    },
    updateChartPeriod(newPeriod) {
      this.chartPeriod = newPeriod
    },
    async updateRevenue() {
      const response = await superagent.get(`${process.env.VUE_APP_INDEX_API_URL}/revenue${this.query}`)
      const { results } = response.body
      this.data = results.reverse()
      if (this.chartPeriod === 'week') this.timeSeriesFormat = 'ddd'
      if (this.chartPeriod === 'month') this.timeSeriesFormat = 'll'
      this.averageRevenue = results.reduce((total, day) => total += day.amount, 0) / results.length / 1e6
      this.totalRevenue = response.body.metadata.allTimeRevenue / 1e6
    }
  },
  mounted() {
    this.updateRevenue()
    this.intervalID = setInterval(() => {
      this.updateRevenue()
    }, 60000)
  },
  unmounted() {
    clearInterval(this.intervalID)
  },
  watch: {
    chartPeriod() {
      this.updateRevenue()
    }
  }
}
</script>

<style>
.tile {
  @apply flex-1 p-12 md:p-24 text-sm text-gray-300 bg-white rounded;
}
</style>