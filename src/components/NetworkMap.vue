<template>
  <div class="flex flex-col h-full">
    <h3>Network Map</h3>
    <div class="map-container">
      <div class="wrapper">
        <img ref="mapImage" src="/assets/world-robinson.svg" alt="">
        <svg ref="mapMarkers" id="mapMarkers"></svg>
      </div>
    </div>
  </div>
</template>

<script>
// The network map uses a Robinson projection map image with slight cropping at the top and bottom of the map - https://simplemaps.com/resources/svg-world
// co-ordinates are calculated with the following formulas:
// x = 0.8474 RX (lng - lng0)
// y = 1.3523 RY
// - R is radius of globe at scale of the map, where equator length is 0.8487 of map width
// - X and Y are coefficient values determined by Robinson at known latitudes, with intermediate values calculated by interpolation
// (I have used linear interpolation for simplicity, at slight cost of accuracy)
// the formula and coefficients can be found here: https://en.wikipedia.org/wiki/Robinson_projection#Formulation

// known X and Y coefficients for latitudes at 5 degree intervals
const latArray = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90]
const XValues = [1, 0.9986, 0.9954, 0.9900, 0.9822, 0.9730, 0.9600, 0.9427, 0.9216, 0.8962, 0.8679, 0.8350, 0.7986, 0.7597, 0.7186, 0.6732, 0.6213, 0.5722, 0.5322]
const YValues = [0, 0.0620, 0.1240, 0.1860, 0.2480, 0.3100, 0.3720, 0.4340, 0.4958, 0.5571, 0.6176, 0.6769, 0.7346, 0.7903, 0.8435, 0.8936, 0.9394, 0.9761, 1]

export default {
  name: "NetworkMap",
  data: function() {
    return {
      // known lontitude offset of map in degrees
      lngOffset: -3
    }
  },
  props: ['points'],
  methods: {
    convertLatLngToXy(lat, lng, mapWidth, topOffset = 0, leftOffset = 0) {
      // disallow invalid latitude or longtitude
      if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return

      // h and w are full height and width of the Robinson map without any cropping - the correct ratio is 1.97165551906973
      const w = mapWidth
      const h = w / 1.97165551906973

      const { X, Y } = this.getXYCoefficients(lat)

      // R = radius of the globe at scale of map
      const R = mapWidth / 2 / Math.PI / 0.8487

      // longtitude of central point of map in radians
      const lngRad = (lng + this.lngOffset) * Math.PI / 180

      // x and y co-ordinates ((0,0) at the top-left corner / (mapWidth,mapHeight) at bottom right corner)
      // 1.02 multiplier of x value is a "fudge" value as the points don't quite match up
      const x = (w / 2) + (0.8487 * R * X * lngRad * 1.02) + leftOffset
      const y = (h / 2) - (1.3523 * R * Y) - topOffset

      return { x, y }
    },
    getXYCoefficients(lat) {
      const absoluteLat = Math.abs(lat)
      // determine if lattitude is positive or negative
      const sign = lat < 0 ? -1 : 1

      // disallow invalid latitude
      if (absoluteLat > 90) return

      // if x is multiple of 5, return known X and Y values
      const i = latArray.indexOf(absoluteLat)
      if (i >= 0) {
        const X =  XValues[i]
        let Y = YValues[i] * sign
        return { X, Y }
      }

      // if x is not multiple of 5, perform linear interpolation between two closest known points
      const lowerLat = Math.floor(absoluteLat / 5) * 5
      const iLower = latArray.indexOf(lowerLat)
      const upperLat = Math.ceil(absoluteLat / 5) * 5
      const iUpper = latArray.indexOf(upperLat)
      const X = this.linearInterpolation(absoluteLat, lowerLat, upperLat, XValues[iLower], XValues[iUpper])
      let Y = this.linearInterpolation(absoluteLat, lowerLat, upperLat, YValues[iLower], YValues[iUpper]) * sign
      return { X, Y }
    },
    linearInterpolation(x, x0, x1, y0, y1) {
      return y0 + ((y1 - y0) * ((x - x0) / (x1 - x0)))
    },
    updateMarkers() {
      // height and width of the map image in the browser
      const mapWidth = this.$refs.mapImage.clientWidth
      const mapHeight = this.$refs.mapImage.clientHeight
      // radius of the marker - set at 5px when map at full width (at 1180px width)
      const markerRadius = 5 / 1180 * mapWidth
      // topOffset is number of pixels cropped from top of map when map, calculated as being 5 pixels when map at full height of 515
      const topOffset = 5 / 515 * mapHeight

      // clear SVG and then re-draw markers
      const markersSvg = this.$refs.mapMarkers
      markersSvg.innerHTML = ''
      this.points.forEach(p => {
        const { x, y } = this.convertLatLngToXy(p.lat, p.lng, mapWidth, topOffset)

        // create marker
        const marker = document.createElementNS("http://www.w3.org/2000/svg", 'circle')

        // set position and size
        marker.setAttribute("cx", x)
        marker.setAttribute("cy", y)
        marker.setAttribute("r", markerRadius)

        // set colour
        marker.style.stroke = "#5cbd64"
        marker.style["stroke-width"] = "1"
        marker.style.fill = "#0ecc5f"

        // add marker to SVG
        markersSvg.appendChild(marker)
      })
    },
    onResize() {
      if (this.resizeTimeout) clearTimeout(this.resizeTimeout)
      this.resizeTimeout = setTimeout(() => {
        this.updateMarkers()
      }, 30)
    }
  },
  mounted() {
    window.addEventListener('resize', this.onResize);
  },
  unmounted() {
    window.removeEventListener('resize', this.onResize);
  },
  watch: {
    points() {
      this.updateMarkers()
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
  /* box-sizing: border-box;
  border-bottom: solid 80px red;
  border-top: solid 10px red; */
}

#mapMarkers {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

@screen lg {
  .map-container {
    height: 535px;
    width: auto;
    display: flex;
    align-items: center;
    justify-content: center;
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
