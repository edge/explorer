<template>
  <div class="flex flex-col h-full">
    <h3>{{ session ? "Node Location" : "Network Map"}}</h3>
    <div id="network_map"></div>
  </div>
</template>

<script>
import superagent from 'superagent'

const mapRefreshInterval = 20 * 1000

export default {
  name: "NetworkMap",
  data: function () {
    return {
      map: null,
      iMap: null,
      points: [],
      options: {
        backgroundColor: '#181818',
        datalessRegionColor: '#808080',
        defaultColor: '#0ecd61',
        displayMode: 'markers',
        magnifyingGlass: {enable: true, zoomFactor: 5},
        legend: 'none',
        tooltip: {trigger: 'none',},
        colorAxis: {colors: ['#555', '#0ecd61'], values: [0, 1]},
        sizeAxis: {minSize: 5, maxSize: 5}
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
          nodeTable.push([node.node.geo.lat, node.node.geo.lng, online, type])
        })
      }
      else {
        await this.updatePoints()
        this.points.forEach(p => {
          nodeTable.push([p.lat, p.lng, 1, 0])
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
      google.charts.setOnLoadCallback(this.drawMap.bind(this))
    },
    isOnline(node) {
      return Date.now() - node.lastActive < 60000
    },
    isValidGeoData(node) {
      let isValid = true
      if (node.node.geo.lat > 90 || node.node.geo.lat < -90) isValid = false
      if (node.node.geo.lng > 180 || node.node.geo.lng < -180) isValid = false
      return isValid
    },
    async updatePoints() {
      this.loading = true
      const result = await superagent.get(`${process.env.VUE_APP_INDEX_API_URL}/sessions/map?limit=500`)
      this.points = result.body.results
      this.loaded = true
      this.loading = false
    },
  }
}
</script>

<style scoped>
</style>
