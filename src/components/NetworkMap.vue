<template>
  <div class="flex flex-col h-full">
    <h3>Network Map</h3>
    <div class="map-container">
      <div class="wrapper">
        <img ref="mapImage" src="/world-robinson.svg" alt="">
        <svg ref="mapMarkers" id="mapMarkers"></svg>
      </div>
      <!-- node type toggles -->
      <div class="type-toggle">
        <div class="toggle">
          <span>Stargates <span class="hidden sm:inline-block">({{ countType('stargate') }})</span></span>
          <label class="switch">
            <input type="checkbox" v-model="showStargate">
            <span class="slider"></span>
          </label>
        </div>
        <div class="toggle">
          <span>Gateways <span class="hidden sm:inline-block">({{ countType('gateway') }})</span></span>
          <label class="switch">
            <input type="checkbox" v-model="showGateway">
            <span class="slider"></span>
          </label>
        </div>
        <div class="toggle">
          <span>Hosts <span class="hidden sm:inline-block">({{ countType('host') }})</span></span>
          <label class="switch">
            <input type="checkbox" v-model="showHost">
            <span class="slider"></span>
          </label>
        </div>
        <div class="toggle">
          <span>Connections</span>
          <label class="switch">
            <input type="checkbox" v-model="showLines">
            <span class="slider"></span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// The network map uses a Robinson projection map image with slight cropping at the top and bottom of the map - https://simplemaps.com/resources/svg-world
// co-ordinates are calculated with the following formulas:
// x = 0.8474 RX (lng - lng0)
// y = 1.3520 RY
// - R is radius of globe at scale of the map, where equator length is 0.8487 of map width
// - X and Y are coefficient values determined by Robinson at known latitudes, with intermediate values calculated by interpolation
// (I have used linear interpolation for simplicity, at slight cost of accuracy)
// the formula and coefficients can be found here: https://en.wikipedia.org/wiki/Robinson_projection#Formulation

// known X and Y coefficients for latitudes at 5 degree intervals
const latArray = [
  0, 5,      10,     15,     20,     25,     30,     35,     40,     45,     50,     55,     60,     65,     70,     75,     80,     85,     90
]
const XValues = [
  1, 0.9986, 0.9954, 0.9900, 0.9822, 0.9730, 0.9600, 0.9427, 0.9212, 0.8962, 0.8679, 0.8350, 0.7986, 0.7597, 0.7186, 0.6732, 0.6213, 0.5722, 0.5322
]
const YValues = [
  0, 0.0620, 0.1240, 0.1860, 0.2480, 0.3100, 0.3720, 0.4340, 0.4958, 0.5571, 0.6176, 0.6769, 0.7346, 0.7903, 0.8435, 0.8936, 0.9394, 0.9761, 1
]

export default {
  name: "NetworkMap",
  data: function() {
    return {
      // known longitude offset of map in degrees
      lngOffset: -3,
      showGateway: true,
      showHost: true,
      showLines: true,
      showStargate: true
    }
  },
  props: ['points'],
  computed: {
    gateways() {
      return this.points.filter(p => p.type === 'gateway')
    },
    showType() {
      return {
        gateway: this.showGateway,
        host: this.showHost,
        stargate: this.showStargate
      }
    },
    stargates() {
      return this.points.filter(p => p.type === 'stargate')
    }
  },
  methods: {
    // calculate the distance between two points on the map (using x and y, not lat and lng)
    calcDistance(p1, p2) {
      const dx = p2.x - p1.x
      const dy = p2.y - p1.y
      return Math.sqrt(dx * dx + dy * dy)
    },
    convertLatLngToXy(lat, lng, mapWidth, topOffset = 0, leftOffset = 0) {
      // disallow invalid latitude or longitude
      if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return

      // h and w are full height and width of the Robinson map without any cropping - the correct ratio is 1.97125551906973
      const w = mapWidth
      const h = w / 1.97125551906973

      const { X, Y } = this.getXYCoefficients(lat)

      // R = radius of the globe at scale of map
      const R = mapWidth / 2 / Math.PI / 0.8487

      // longitude of central point of map in radians
      const lngRad = (lng + this.lngOffset) * Math.PI / 180

      // x and y co-ordinates ((0,0) at the top-left corner / (mapWidth,mapHeight) at bottom right corner)
      // xFudge" is a "fudge" value worked out by trial and error to get the markers into the correct position
      const xFudge = 1.02
      const x = (w / 2) + (0.8487 * R * X * lngRad * xFudge) + leftOffset
      const y = (h / 2) - (1.3520 * R * Y) - topOffset

      return { x, y }
    },
    countType(type) {
      return this.points.filter(p => p.type === type).length
    },
    getXYCoefficients(lat) {
      const absoluteLat = Math.abs(lat)
      // determine if latitude is positive or negative
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
      const upperLat = lowerLat + 5
      const iLower = lowerLat / 5
      const iUpper = iLower + 1
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

      // clear SVG and then re-draw markers and line
      const mapSvg = this.$refs.mapMarkers
      mapSvg.innerHTML = ''

      let lines = []
      let markers = []
      this.points.forEach(p => {
        if (!this.showType[p.type]) return

        // get x and y of node for marker position on map
        const { x, y } = this.convertLatLngToXy(p.lat, p.lng, mapWidth, topOffset)

        // create marker
        const marker = document.createElementNS("http://www.w3.org/2000/svg", 'circle')

        // set position and size
        marker.setAttribute("cx", x)
        marker.setAttribute("cy", y)
        marker.setAttribute("r", markerRadius)

        // set styles
        marker.style.stroke = "#5cbd64"
        marker.style["stroke-width"] = "1"
        marker.style.fill = "#0ecc5f"

        markers.push(marker)

        // draw lines between node and it's parent (gateway for hosts, stargate for gateways)
        if (!this.showLines) return
        const parentNode =
          p.type === 'host' ? this.gateways.find(gw => gw.address === p.gateway) :
          p.type === 'gateway' ? this.stargates.find(sg => sg.address === p.stargate) :
          undefined

        if (parentNode) {
          // get x and y of node's parent gateway/stargate
          const to = this.convertLatLngToXy(parentNode.lat, parentNode.lng, mapWidth, topOffset)

          // for performance, don't render short lines (they will likely not be visible anyway)
          if (this.calcDistance({ x, y }, to) < 10) return

          // create line
          const line = document.createElementNS("http://www.w3.org/2000/svg", 'line')

          // set start and end point of line
          line.setAttribute("x1", x)
          line.setAttribute("y1", y)
          line.setAttribute("x2", to.x)
          line.setAttribute("y2", to.y)

          // set styles
          line.style.stroke = "#6EE09F"
          line.style["stroke-width"] = "1"
          line.style["stroke-dasharray"] = "2,4"
          line.style["stroke-dashoffset"] = "0"
          line.style.fill = "transparent"
          line.style.animation = "mapConnections 10s linear infinite"
          line.classList.add("hidden")
          line.classList.add("sm:block")

          lines.push(line)
        }
      })

      // add lines and markers to SVG
      // lines added first so that markers sit on top of them (z-index not possible with SVG elements)
      lines.forEach(line => mapSvg.appendChild(line))
      markers.forEach(marker => mapSvg.appendChild(marker))
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
    },
    showLines() {
      this.updateMarkers()
    },
    showType() {
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

/* node type toggles */
.type-toggle {
  @apply hidden sm:flex flex-col space-y-4 items-start absolute left-10 lg:left-20 bottom-8 lg:bottom-16 text-sm text-gray-600;
  font-size: 0.8125rem;
  width: 7.5rem;
}
.toggle {
  @apply flex justify-between items-center w-full space-x-4;
}
.switch {
  position: relative;
  display: inline-block;
  width: 32px;
  height: 20px;
  margin: 0;
}
/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
  border-radius: 20px;
}
.slider:before {
  position: absolute;
  content: "";
  height: 12px;
  width: 12px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
  border-radius: 50%;
}
input:checked + .slider {
  background-color: #0ecc5f;
}
input:focus + .slider {
  box-shadow: 0 0 1px #0ecc5f;
}
input:checked + .slider:before {
  -webkit-transform: translateX(12px);
  -ms-transform: translateX(12px);
  transform: translateX(12px);
}
</style>
