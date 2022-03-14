<template>
  <div class="flex flex-col h-full">
    <h3>{{ session ? "Node Location" : "Network Map"}}</h3>
    <div id="network_map"></div>
  </div>
</template>

<script>
import * as index from '@edge/index-utils'

const mapRefreshInterval = 20 * 1000

// FOR TESTING
function getRandomLatLng(min, max) {
  return Math.random() * (max - min) + min
}

export default {
  name: "NetworkMap",
  data: function () {
    return {
      map: null,
      iMap: null,
      sessions: null,
      options: {
        backgroundColor: '#181818',
        datalessRegionColor: '#808080',
        defaultColor: '#0ecd61',
        displayMode: 'markers',
        magnifyingGlass: {enable: true, zoomFactor: 5},
        legend: 'none',
        tooltip: {trigger: 'none',},
        colorAxis: {colors: ['#555', '#0ecd61'], values: [0, 1]},
        sizeAxis: {minSize: 5, maxSize: 9}
      }
    }
  },
  props: [
    'session'
  ],
  mounted() {
    this.loadMap()
    if (!this.session) {
      // initiate polling
      this.iMap = setInterval(() => {
        this.loadMap()
      }, mapRefreshInterval)
    }
  },
  unmounted() {
    if (!this.session) {
      clearInterval(this.iMap)
    }
  },
  methods: {
    async drawMap() {
      await this.updateNodes()
      // colours are set by online: 0 = offline / 1 = online
      // size is set by type: 0 = host / 1 = gateway / 2 = stargate
      const nodeTable = [['lat', 'lng', 'online', 'type']]
      if (this.session) {
        const nodes = [this.session]
        if (this.session.gateway) nodes.push(this.session.gateway)
        if (this.session.stargate) nodes.push(this.session.stargate)
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
        this.sessions.forEach(node => {
          const online = this.isOnline(node) ? 1 : 0
          const type = node.node.type === 'host' ? 0 : node.node.type === 'gateway' ? 1 : 2

          if (process.env.VUE_APP_INDEX_API_URL.includes('test')) {
            // randomly generate world co-ordinates for testnet nodes
            const ranLat = getRandomLatLng(-50, 83)
            const ranLng = getRandomLatLng(-180, 180)
            nodeTable.push([ranLat, ranLng, online, type])
          } else {
            nodeTable.push([node.node.geo.lat, node.node.geo.lng, online, type])
          }
        })
      }

      const data = google.visualization.arrayToDataTable(nodeTable)
      if (this.map === null) this.map = new google.visualization.GeoChart(document.getElementById('network_map'))

      // focus on country if viewing single node
      const options = {...this.options}
      if (this.session) options.region = this.session.node.geo.countryCode

      this.map.draw(data, options)
    },
    loadMap() {
      google.charts.load('current', {
        'packages':['geochart'],
      })
      google.charts.setOnLoadCallback(this.drawMap)
    },
    isOnline(node) {
      return Date.now() - node.lastActive < 60000
    },
    async updateNodes() {
      this.loading = true
      // the sort query sent to index needs to include "-created", but this is hidden from user in browser url
      const sessions = await index.session.sessions(process.env.VUE_APP_INDEX_API_URL, { limit: 100 })
      this.sessions = sessions.results
      this.loaded = true
      this.loading = false
    },
  }
}
</script>

<style scoped>
</style>
