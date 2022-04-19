<template>
  <div class="flex flex-col h-full">
    <h3>Data In/Out</h3>
    <div class="relative max-h-full tile md:pr-50">
      <Line
        :chart-options="chartOptions"
        :chart-data="chartData"
        :chart-id="chartId"
        :dataset-id-key="datasetIdKey"
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
  props: {
    chartId: {
      type: String,
      default: 'line-chart'
    },
    datasetIdKey: {
      type: String,
      default: 'label'
    },
    dataIn: {
      type: Array,
      default: []
    },
    dataOut: {
      type: Array,
      default: []
    },
    timeSteps: {
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
  },
  data() {
    return {
      chartData: {
        labels: this.timeSteps,
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
            ticks: {
              stepSize: 1
            },
            stacked: true
          },
          x: {
            beginAtZero: true,
            grid: {display: false},
            title: {
              display: true, 
              text: 'Time (hour)'
            }
          }
        },
        plugins: {
          legend: {
          }
        }
      }
    }
  }
}
</script>

<style scoped>
  .tile {
    @apply flex-1 p-12 md:p-24 text-sm text-gray-300 bg-white rounded;
  }
  .tile span.emphasis {
    @apply text-gray-900 font-medium font-mono;
  }
  button {
    @apply leading-none text-sm2 border-b border-black border-opacity-25 hover:border-green hover:border-opacity-25 hover:text-green align-middle;
  }
</style>
