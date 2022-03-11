<template>
  <div class="flex flex-col h-full">
    <h3>{{ node ? "Node Location" : "Network Map"}}</h3>
    <div id="network_map"></div>
  </div>
</template>

<script>
import * as index from '@edge/index-utils'

const mapRefreshInterval = 60 * 1000

// FOR TESTING
function getRandomLatLng(min, max) {
  return Math.random() * (max - min) + min
}

export default {
  name: "NetworkMap",
  data: function () {
    return {
      mapInterval: null,
      nodes: null,
      options: {
        backgroundColor: '#181818',
        datalessRegionColor: '#808080',
        defaultColor: '#0ecd61',
        displayMode: 'markers',
        magnifyingGlass: {enable: true, zoomFactor: 5},
        legend: 'none',
        tooltip: {trigger: 'none',},
        colorAxis: {colors: ['#555', '#0ecd61']},
      }
    }
  },
  props: [
    'node'
  ],
  computed: {
    sizeAxis() {
      if (this.node) return {minSize: 6, maxSize: 8}
      return {minSize: 5, maxSize: 9}
    }
  },
  mounted() {
    this.loadMap()
    if (!this.node) {
      // initiate polling
      this.mapInterval = setInterval(() => {
        this.loadMap()
      }, mapRefreshInterval)
    }
  },
  umounted() {
    if (!this.node) {
      clearInterval(this.mapInterval)
    }
  },
  methods: {
    async drawMap() {
      await this.updateNodes()
      // colours are set by online: 0 = offline / 1 = online
      // size is set by type: 0 = host / 1 = gateway / 2 = stargate
      const nodeTable = [['lat', 'lng', 'online', 'type']]
      if (this.node) {
        const nodes = [this.node]
        if (this.node.gateway) nodes.push(this.node.gateway)
        if (this.node.stargate) nodes.push(this.node.stargate)
        nodes.forEach(node => {
          const online = this.isOnline(node) ? 1 : 0
          const type = node.node.type === 'host' ? 0 : node.node.type === 'gateway' ? 1 : 2

          if (process.env.VUE_APP_INDEX_API_URL.includes('test')) {
            // randomly generate UK co-ordinates for testnet nodes
            const ranLat = getRandomLatLng(51.5, 58.5)
            const ranLng = getRandomLatLng(-9.7, 1.7)
            nodeTable.push([ranLat, ranLng, online, type])
          } else {
            nodeTable.push([node.node.geo.lat, node.node.geo.lng, online, type])
          }
        })
      }
      else {
        this.nodes.forEach(node => {
          const online = this.isOnline(node) ? 1 : 0
          const type = node.node.type === 'host' ? 0 : node.node.type === 'gateway' ? 1 : 2

          if (process.env.VUE_APP_INDEX_API_URL.includes('test')) {
            // randomly generate world co-ordinates for testnet nodes
            // TESTING
            const ranLat = getRandomLatLng(51.5, 58.5)
            const ranLng = getRandomLatLng(-9.7, 1.7)
            // const ranLat = getRandomLatLng(90, -90)
            // const ranLng = getRandomLatLng(180, -180)
            nodeTable.push([ranLat, ranLng, online, type])
          } else {
            nodeTable.push([node.node.geo.lat, node.node.geo.lng, online, type])
          }
        })
      }

      const data = google.visualization.arrayToDataTable(nodeTable)
      const map = new google.visualization.GeoChart(document.getElementById('network_map'))
      const options = this.options
      options.sizeAxis = this.sizeAxis
      if (this.node) options.region = this.node.node.geo.countryCode
      // TESTING
      options.region = 'GB'
      map.draw(data, options)
    },
    loadMap() {
      google.charts.load('current', {
        'packages':['geochart'],
      })
      google.charts.setOnLoadCallback(this.drawMap)
    },
    isOnline(node) {
      if (this.node) return Date.now() - node.lastActive < 60000
      return Date.now() - node.lastSeen < 60000
    },
    async updateNodes() {
      this.loading = true
      // the sort query sent to index needs to include "-created", but this is hidden from user in browser url
      const sessions = await index.session.sessions(process.env.VUE_APP_INDEX_API_URL, { limit: 1000 })
      this.nodes = sessions.results
      this.loaded = true
      this.loading = false
    },
  }
}
</script>

<style scoped>
</style>
