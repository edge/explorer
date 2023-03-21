<template>
  <div class="w-full">
    <h3>On Chain Revenue</h3>
    <div class="relative max-h-full tile">
      <div class="flex justify-between mb-12">
        <TokenValueConversion
          v-if="averageRevenue"
          :hideConversion="true"
          title="Average Daily Revenue"
          :value="averageRevenue"
          currency="xe"
        />
        <TokenValueConversion
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
        :datasets="datasets"
        yLabel="Daily XE"
      />
    </div>
  </div>
</template>

<script>
import OverviewTokenChart from '@/components/OverviewTokenChart'
import TokenValueConversion from '@/components/TokenValueConversion'
import moment from 'moment'
import superagent from 'superagent'

export default {
  name: 'OverviewRevenue',
  components: {
    OverviewTokenChart,
    TokenValueConversion
  },
  props: ['chartPeriod'],
  data() {
    return {
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
      else return this.data.map(r => {
        if (this.chartPeriod === 'week') return moment(r.start).format('ddd')
        if (this.chartPeriod === 'month') return moment(r.start).format('ll')
      })
    }
  },
  methods: {
    tooltipCallback(tooltipItem) {
      return tooltipItem.raw.toLocaleString() + ' XE'
    },
    async updateRevenue() {
      const response = await superagent.get(`${process.env.VUE_APP_INDEX_API_URL}/revenue${this.query}`)
      const { results } = response.body
      this.data = results.reverse()
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