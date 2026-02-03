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
          currency="edge"
          :tooltipText="avgTooltipText"
        />
        <OverviewTokenSummary
          v-if="totalRevenue"
          :hideConversion="true"
          title="Total Revenue"
          :value="totalRevenue"
          currency="edge"
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
        yLabel="Monthly $EDGE"
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
      confirmedCount: 0,
      pointRadius: 5,
      xLabel: 'Time',
    }
  },
  computed: {
    datasets() {
      if (!this.data) return []

      const confirmedData = this.data.map(r => r.amount / 1e6)
      const projectedMonths = this.getProjectedMonths()
      const allData = [...confirmedData]

      // Add projected values (use average for each projected month)
      projectedMonths.forEach(() => {
        allData.push(this.averageRevenue)
      })

      // Use segment styling for dashed projected portion
      const confirmedCount = this.confirmedCount

      return [
        {
          backgroundColor: 'rgba(110,224,159)',
          borderColor: 'rgb(14, 204, 95)',
          data: allData,
          fill: true,
          label: 'Total Revenue ($EDGE)',
          // Segment styling: dashed gray line for projected
          segment: {
            borderColor: ctx => ctx.p0DataIndex >= confirmedCount - 1 ? 'rgb(156, 163, 175)' : undefined,
            borderDash: ctx => ctx.p0DataIndex >= confirmedCount - 1 ? [5, 5] : undefined
          },
          // Point styling: solid green for confirmed, white/gray hollow for projected
          pointBackgroundColor: ctx => ctx.dataIndex >= confirmedCount ? 'rgb(255, 255, 255)' : 'rgb(14, 204, 95)',
          pointBorderColor: ctx => ctx.dataIndex >= confirmedCount ? 'rgb(156, 163, 175)' : 'rgb(14, 204, 95)',
          pointRadius: 5,
          pointBorderWidth: 2
        }
      ]
    },
    timeSeries() {
      if (!this.data) return []
      const confirmedLabels = this.data.map(r => moment(r.start).format('MMM YY'))
      const projectedLabels = this.getProjectedMonths().map(m => moment(m).format('MMM YY'))
      return [...confirmedLabels, ...projectedLabels]
    },
    avgTooltipText() {
      if (!this.data) return 'Average monthly revenue'
      const count = this.data.length
      return `Average over last ${count} month${count !== 1 ? 's' : ''}`
    }
  },
  methods: {
    tooltipCallback(tooltipItem) {
      const isProjected = tooltipItem.dataIndex >= this.confirmedCount
      const value = tooltipItem.raw.toLocaleString(undefined, {
        minimumFractionDigits: 6,
        maximumFractionDigits: 6
      })
      return isProjected ? `${value} $EDGE (Projected)` : `${value} $EDGE`
    },
    getProjectedMonths() {
      if (!this.data || this.data.length === 0) return []

      const lastDataPoint = this.data[this.data.length - 1]
      const projected = []
      const now = moment()
      const currentMonth = now.clone().startOf('month')
      const lastDataMonth = moment(lastDataPoint.start).startOf('month')

      let nextMonth = lastDataMonth.clone().add(1, 'month')
      // Safety limit, project only past months (not current month)
      const maxIterations = 12
      let iterations = 0
      while (nextMonth.isBefore(currentMonth) && iterations < maxIterations) {
        projected.push(nextMonth.clone().toDate())
        nextMonth.add(1, 'month')
        iterations++
      }

      return projected
    },
    updateChartPeriod(newPeriod) {
      this.chartPeriod = newPeriod
    },
    async updateRevenue() {
      const response = await superagent.get(`${import.meta.env.VITE_INDEX_API_URL}/revenue`)
      const { results } = response.body
      this.data = results.reverse()
      this.confirmedCount = this.data.length
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
