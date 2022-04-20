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
            backgroundColor: 'rgba(14, 204, 95, 0.6)',
            borderColor: '#0ecc5f',
            data: this.data,
            fill: true,
            label: 'Availability',
            pointRadius: this.pointRadius
          }
        ]
      },
      chartOptions: {
        responsive: true,
        cubicInterpolationMode: 'monotone',
        scales: {
          y: {
            beginAtZero: true,
            grid: {display: false},
            suggestedMax: 100,
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
          },
          tooltip: {
            interaction: {
              mode: 'index',
              intersect: false,
            }
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
    height: {
      type: Number,
      default: 200
    },
    pointRadius: {
      type: Number,
      defult: 5
    },
    timeSeries: {
      type: Array,
      default: []
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
