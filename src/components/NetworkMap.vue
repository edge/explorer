<template>
  <div class="flex flex-col h-full">
    <h3>{{ session ? "Node Location" : "Network Map"}}</h3>
    <div class="map-container">
      <img ref="mapImage" src="/assets/mercator-map.png" alt="">
      <canvas ref="mapCanvas"></canvas>
    </div>
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
      mapLngLeft: -179,
      mapLngRight: 180,
      mapLatBottom: -54.7,
      points: [],
    }
  },
  props: [
    'session'
  ],
  computed: {
    height() {
      const screenWidth = window.screen.width
      return screenWidth > 1023 ? 382 : undefined
    },
    mapElement() {
      return this.$refs.mapImage
    },
    mapHeight() {
      return this.$refs.mapImage.clientHeight
    },
    mapWidth() {
      return this.$refs.mapImage.clientWidth
    },
    canvasElement() {
      return this.$refs.mapCanvas
    },
  },
  mounted() {
    this.drawPoints()
    if (!this.session) {
      // initiate polling
      this.iMap = setInterval(() => {
        this.drawPoints()
      }, mapRefreshInterval)
    }
  },
  unmounted() {
    if (!this.session) {
      clearInterval(this.iMap)
    }
  },
  methods: {
    convertGeoToXy(lat, lng) {
      const mapLatBottomRad = this.mapLatBottom * Math.PI / 180
      const latitudeRad = lat * Math.PI / 180
      const mapLngDelta = (this.mapLngRight - this.mapLngLeft)

      const worldMapWidth = ((this.mapWidth / mapLngDelta) * 360) / (2 * Math.PI)
      const mapOffsetY = (worldMapWidth / 2 * Math.log((1 + Math.sin(mapLatBottomRad)) / (1 - Math.sin(mapLatBottomRad))))

      const x = (lng - this.mapLngLeft) * (this.mapWidth / mapLngDelta)
      const y = this.mapHeight - ((worldMapWidth / 2 * Math.log((1 + Math.sin(latitudeRad)) / (1 - Math.sin(latitudeRad)))) - mapOffsetY)

      return {x, y} // the pixel x,y value of this point on the map image
    },
    async drawPoints() {
      await this.updatePoints()

      const ctx = this.canvasElement.getContext('2d')
      ctx.canvas.width = this.mapWidth
      ctx.canvas.height = this.mapHeight
      ctx.fillStyle = 'rgb(0, 165, 0)'
      ctx.strokeStyle = 'rgb(0, 0, 0)'

      this.points.forEach(p => {
        const {x, y} = this.convertGeoToXy(p.lat, p.lng)
        ctx.beginPath()
        ctx.arc(x, y, 5, 0, 2 * Math.PI)
        ctx.fill()
        ctx.stroke()
      })

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
.map-container {
  position: relative;
  border-radius: 5px;
  overflow: hidden;
}

img {
  height: 382px;
  width: auto;
}

canvas {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
