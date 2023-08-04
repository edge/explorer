<template>
  <div class="w-full relative">
    <h3>On Chain Revenue</h3>
    <div class="relative max-h-full tile">
      <div class="summary flex justify-between mb-12 gap-4">
        <OverviewTokenSummary
          v-if="averageRevenue"
          :hideConversion="true"
          title="Avg Monthly Revenue"
          :value="averageRevenue"
          currency="xe"
          tooltipText="Average over last 12 months"
        />
        <OverviewTokenSummary
          v-if="totalRevenue"
          :hideConversion="true"
          title="Total Revenue"
          :value="totalRevenue"
          currency="xe"
          tooltipText="Total all time revenue"
        />
      </div>
      <OverviewTokenChart
        v-if="timeSeries.length"
        chartID="Total Revenue"
        :beginAtZero="true"
        :timeSeries="timeSeries"
        :tooltipCallback="tooltipCallback"
        :datasets="datasets"
        yLabel="Monthly XE"
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
  name: 'OverviewRevenue',
  components: {
    OverviewChartTimeToggle,
    OverviewTokenChart,
    OverviewTokenSummary
  },
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
    timeSeries() {
      if (!this.data) return []
      else return this.data.map(r => moment(r.start).format('MMM YY'))
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
      const response = await superagent.get(`${import.meta.env.VITE_INDEX_API_URL}/revenue`)
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
  }
}
</style>
