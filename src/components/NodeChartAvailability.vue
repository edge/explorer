<template>
  <div class="flex flex-col h-full">
    <h3>Availability</h3>
    <div class="relative max-h-full tile md:pr-50">
      <Line
        :chart-options="chartOptions"
        :chart-data="chartData"
        :chart-id="'NodeAvailabilityChart'"
        :width="width"
        :height="height"
      />
    </div>
  </div>
</template>

<script>
import { Line } from 'vue-chartjs'
import Chart from 'chart.js/auto';

export default {
  name: "NodeChartAvailability",
  components: { Line },
  data() {
    return {
      chartData: {
        labels: this.timeSeries,
        datasets: [
          {
            label: 'Availability',
            data: this.data,
            borderColor: '#0ecc5f',
            backgroundColor: 'rgba(14, 204, 95, 0.6)',
            fill: true
          }
        ]
      },
      chartOptions: {
        responsive: true,
        cubicInterpolationMode: 'monotone',
        scales: {
          y: {
            beginAtZero: true,
            suggestedMax: 100,
            grid: {display: false},
            title: {
              display: true,
              text: 'Availability (%)'
            }
          },
          x: {
            grid: {display: false},
            title: {
              display: true,
              text: this.xLabel
            },
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    }
  },
  props: {
    data: {
      type: Array,
      default: []
    },
    timeSeries: {
      type: Array,
      default: []
    },
    width: {
      type: Number,
      default: 400
    },
    height: {
      type: Number,
      default: 200
    },
    xLabel: {
      type: String,
      default: 'Time (hour)'
    }
  }
}
</script>

<style scoped>
</style>
