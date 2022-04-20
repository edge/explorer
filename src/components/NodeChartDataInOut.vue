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
            backgroundColor: 'rgb(255, 0, 0)',
            borderColor: 'rgb(255, 0, 0)',
            data: this.dataOut,
            fill: true,
            label: 'Data Out',
            pointRadius: this.pointRadius
          },
          {
            backgroundColor: 'rgb(14, 204, 95)',
            borderColor: 'rgb(14, 204, 95)',
            data: this.dataIn,
            fill: true,
            label: 'Data In',
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
            title: {
              display: true,
              text: this.yLabel
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
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            interaction: {
              mode: 'index',
              intersect: false,
            }
          },
          hover: {
            mode: 'index',
            intersect: false
          }
        }
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
    },
    yLabel: {
      type: String,
      default: 'Data (KB)'
    }
  }
}
</script>

<style scoped>
</style>
