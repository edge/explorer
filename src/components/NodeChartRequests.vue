<template>
  <div class="flex flex-col h-full">
    <h3>Requests</h3>
    <div class="relative max-h-full tile md:pr-50">
      <Line
        :chart-options="chartOptions"
        :chart-data="chartData"
        :chart-id="chartId"
        :dataset-id-key="datasetIdKey"
        :plugins="plugins"
        :width="width"
        :height="height"
      />
    </div>
  </div>
</template>

<script>
import { Line } from 'vue-chartjs'
import Chart from 'chart.js/auto';

// ChartJS.register(
//   Title,
//   Tooltip,
//   Legend,
//   LineElement,
//   LinearScale,
//   PointElement,
//   CategoryScale
// )

const now = new Date()
const nowHour = now.getHours()
const requestsData = []

const hourLabels = []
for (let i = 23; i >=0; i--) {
  let h = nowHour - i
  if (h < 0) h = 24 + h
  if (h < 10) h = '0' + h
  hourLabels.push(`${h}:00`)

  const availPc = Math.random() * 15
  requestsData.push(availPc)
}

export default {
  name: "NodeChartAvailability",
  components: { Line },
  props: {
    chartId: {
      type: String,
      default: 'bar-chart'
    },
    datasetIdKey: {
      type: String,
      default: 'label'
    },
    width: {
      type: Number,
      default: 400
    },
    height: {
      type: Number,
      default: 200
    },
  },
  data() {
    return {
      chartData: {
        labels: hourLabels,
        datasets: [ 
          { 
            label: 'Requests',
            data: requestsData,
            borderColor: 'rgb(14, 204, 95)',
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
            grid: {display: false},
            title: {
              display: true, 
              text: 'Requests'
            }
          },
          x: {
            grid: {display: false},
            title: {
              display: true, 
              text: 'Time (hour)'
            }
          }
        },
        plugins: {
          legend: {
            display: false
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
