<template>
  <span class="labels">
    <span v-if="yLabel" class="axis-label left" :id="`${chartID}-label-${yLabel}`">{{yLabel}}</span>
    <span v-if="y1Label" class="axis-label" :id="`${chartID}-label-${y1Label}`">{{y1Label}}</span>
  </span>
  <Line
    :chart-options="chartOptions"
    :chart-data="chartData"
    :chart-id="chartID"
    :height="isSmView ? 250 : 200"
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
    'y1Label',
    'zoom'
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
            },
            min: this.zoom ? this.minYValue : undefined,
            max: this.zoom ? this.maxYValue : undefined
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
          beginAtZero: this.beginAtZero,
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
          },
          min: this.zoom ? this.minY1Value : undefined,
          max: this.zoom ? this.maxY1Value : undefined
        }
      }
      return options
    },
    isSmView() {
      return window.innerWidth < 640
    },
    maxYValue() {
      const maxY = this.getMax(this.datasets[0].data) * 1.1
      const decimalPlaces = this.getDecimalPlaces(maxY)
      return this.round(maxY, decimalPlaces)
    },
    maxY1Value() {
      const maxY = this.avgY1Value * this.maxYValue / this.avgYValue
      const decimalPlaces = this.getDecimalPlaces(maxY)
      return this.round(maxY, decimalPlaces)
    },
    minYValue() {
      const minY = this.getMin(this.datasets[0].data) * 0.7
      const decimalPlaces = this.getDecimalPlaces(minY)
      return this.round(minY, decimalPlaces, true)
    },
    minY1Value() {
      const minY = this.avgY1Value * this.minYValue / this.avgYValue
      const decimalPlaces = this.getDecimalPlaces(minY)
      return this.round(minY, decimalPlaces, true)
    },
    avgYValue() {
      return this.getAvg(this.datasets[0].data)
    },
    avgY1Value() {
      return this.datasets.some(d => d.yAxisID === 'y1') ? this.getAvg(this.datasets[1].data) : 1
    }
  },
  methods: {
    getAvg(data) {
      return data.reduce((total, d) => total += d, 0) / data.length
    },
    /*
      Get number of decimal places to use when rounding max/min values of y-axis.
      The returned value will always be 1 higher than the minimum significant digits.
      E.g. a number of 0.0001234 will return 5 decimal places.`
      The minimum returned value is 3 decimal places.
    */
    getDecimalPlaces(number) {
      let dec = 3
      let factor = Math.pow(10, dec)
      while (Math.round(factor * number) - 10 < 0) {
        dec++
        factor = Math.pow(10, dec)
      }
      return dec
    },
    getMax(data) {
      return Math.max(...data)
    },
    getMin(data) {
      return Math.min(...data)
    },
    /*
      Round a number to a given number of decimal places, to the nearest factor of 5.
      E.g. 0.0012413 rounded to 2dp would return 0.00125.
      If the third argument (down) is true, the value will be rounded down.
    */
    round(number, decimalPlaces, down) {
      const factor = Math.pow(10, decimalPlaces)
      const roundedNumber = down
        ? Math.floor(Math.floor(number * factor / 5) * 5) / factor
        : Math.ceil(Math.ceil(number * factor / 5) * 5) / factor
      return roundedNumber
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
