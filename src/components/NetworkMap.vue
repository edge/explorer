<template>
  <div class="flex flex-col h-full">
    <h3>Network Map</h3>
    <div class="map-container">
      <div class="wrapper">
        <img ref="mapImage" src="/assets/world.svg" alt="">
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
    pointRadius() {
      if (this.mapWidth > 450) return 5
      if (this.mapWidth > 350) return 4
      else return 3
    },
    mapHeight() {
      return this.$refs.mapImage.clientHeight
    },
    mapWidth() {
      return this.$refs.mapImage.clientWidth
    }
  },
  methods: {
    async drawPoints() {
      this.points.forEach(p => {
        console.log('drawing point', p.lat, p.lng)
      })
    },
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
  border-radius: 5px;
}

@screen lg {
  .map-container {
    height: 535px;
    width: auto;
    display: flex;
    align-items: center;
    padding: 35px;
  }

  .wrapper {
    position: relative;
    width: 100%;
  }

  img {
    object-fit: contain;
    max-height: 100%;
  }
}
</style>
