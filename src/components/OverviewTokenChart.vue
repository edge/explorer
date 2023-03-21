<template>
  <span class="labels">
    <span v-if="yLabel" class="axis-label left" :id="`${chartID}-label-${yLabel}`">{{yLabel}}</span>
    <span v-if="y1Label" class="axis-label" :id="`${chartID}-label-${y1Label}`">{{y1Label}}</span>
  </span>
  <Line
    :chart-options="chartOptions"
    :chart-data="chartData"
    :chart-id="chartID"
    :height="height"
  />
</template>

<script>
import { Line } from 'vue-chartjs'
import Chart from 'chart.js/auto'

export default {
  name: 'OverviewTokenChart',
  components: {
    Line
  },
  props: [
    'beginAtZero',
    'chartID',
    'datasets',
    'timeSeries',
    'tooltipCallback',
    'yLabel',
    'y1Label'
  ],
  data() {
    return {
      height: 200
    }
  },
  computed: {
    chartData() {
      return  {
        labels: this.timeSeries,
        datasets: this.datasets
      }
    },
    chartOptions() {
      const options = {
        responsive: true,
        cubicInterpolationMode: 'monotone',
        scales: {
          y: {
            beginAtZero: this.beginAtZero,
            grid: {display: false},
            ticks: {
              font: {
                size: 10
              },
              callback: function(label) {
                return label.toLocaleString(undefined, {
                  maximumSignificantDigits: 8,
                  minimumSignificantDigits: 4,
                  maximumFractionDigits: 8,
                  roundingPriority: 'lessPrecision'
                })
              }
            }
          },
          x: {
            grid: {display: false},
            ticks: {
              font: {
                size: 10
              },
              minRotation: 45,
              maxRotaion: 45
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
              callbacks: {
                label: this.tooltipCallback
              }
            }
          }
        }
      }
      if (this.datasets.some(d => d.yAxisID === 'y1')) {
        options.scales.y1 = {
          grid: {display: false},
          position: 'right',
          ticks: {
            font: {
              size: 10
            },
            callback: function(label) {
              return label.toLocaleString(undefined, {
                maximumSignificantDigits: 8,
                minimumSignificantDigits: 4,
                maximumFractionDigits: 8,
                roundingPriority: 'lessPrecision'
              })
            }
          }
        }
      }
      return options
    }
  },
  mounted() {
    const yLabel = document.getElementById(`${this.chartID}-label-${this.yLabel}`)
    const y1Label = document.getElementById(`${this.chartID}-label-${this.y1Label}`)

    yLabel.style.backgroundColor = this.datasets[0].backgroundColor
    if (y1Label) y1Label.style.backgroundColor = this.datasets[1].backgroundColor
  }
}
</script>

<style>
.labels {
  @apply flex justify-between mb-4;
}
.axis-label {
  @apply text-xs text-black p-1 leading-tight rounded-sm;
}
</style>