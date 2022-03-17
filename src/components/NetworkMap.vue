<template>
  <div class="flex flex-col h-full">
    <h3>Network Map</h3>
    <div class="map-container">
      <div class="wrapper">
        <img ref="mapImage" src="/assets/mercator-map.png" alt="">
        <canvas ref="mapCanvas"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NetworkMap",
  data: function () {
    return {
      mapLngLeft: -180,
      mapLngRight: 180,
      mapLatBottom: -57,
    }
  },
  props: ['points'],
  computed: {
    mapHeight() {
      return this.$refs.mapImage.clientHeight
    },
    mapWidth() {
      return this.$refs.mapImage.clientWidth
    },
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

      return {x, y}
    },
    async drawPoints() {
      const canvas = this.$refs.mapCanvas
      const ctx = canvas.getContext('2d')
      ctx.canvas.width = this.mapWidth
      ctx.canvas.height = this.mapHeight
      ctx.fillStyle = '#0ecc5f'
      ctx.strokeStyle = '#5cbd64'

      this.points.forEach(p => {
        let {x, y} = this.convertGeoToXy(p.lat, p.lng)
        ctx.beginPath()
        ctx.arc(x, y, 5, 0, 2 * Math.PI)
        ctx.fill()
        ctx.stroke()
      })
    }
  },
  watch: {
    points() {
      this.drawPoints()
    }
  }
}
</script>

<style scoped>
.map-container {
  position: relative;
  width: 100%;
  height: auto;
  border-radius: 5px;
  background-color: white;
}

img {
  width: 100%;
  height: auto;
}

canvas {
  position: absolute;
  top: 0;
  left: 0;
}

@screen lg {
  .map-container {
    height: 414px;
    width: auto;
    display: flex;
    align-items: center;
  }

  .wrapper {
    position: relative;
    width: 100%;
  }

  img {
    object-fit: contain;
    max-height: 414px;
  }
}
</style>
