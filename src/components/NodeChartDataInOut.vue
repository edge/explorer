<template>
  <div class="flex flex-col h-full">
    <h3>Data In/Out</h3>
    <div class="relative max-h-full tile md:pr-50">
      <Line
        :chart-options="chartOptions"
        :chart-data="chartData"
        :chart-id="'NodeDataInOutChart'"
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
  name: "NodeChartDataInOut",
  components: { Line },
  data() {
    return {
      chartData: {
        labels: this.timeSeries,
        datasets: [
          {
            label: 'Data Out',
            data: this.dataOut,
            borderColor: 'rgb(255, 0, 0)',
            backgroundColor: 'rgba(255, 0, 0, 1)',
            fill: true
          },
          {
            label: 'Data In',
            data: this.dataIn,
            borderColor: 'rgb(14, 204, 95)',
            backgroundColor: 'rgba(14, 204, 95, 1)',
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
              text: 'Data (kb)'
            },
            stacked: true
          },
          x: {
            beginAtZero: true,
            grid: {display: false},
            title: {
              display: true,
              text: this.xLabel
            }
          }
        },
      }
    }
  },
  props: {
    dataIn: {
      type: Array,
      default: []
    },
    dataOut: {
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
      default: 100
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
