declare const mapboxgl: any

function script({ token, theme, longitude, latitude, zoom }) {
  const element: HTMLElement = this

  function initMap() {
    mapboxgl.accessToken = token

    const map = new mapboxgl.Map({
      container: element,
      style: `mapbox://styles/${theme}`,
      center: [longitude, latitude],
      zoom,
      scrollZoom: false
    })

    new mapboxgl.Marker().setLngLat([longitude, latitude]).addTo(map)

    // Add zoom and rotation controls to the map.
    map.addControl(new mapboxgl.NavigationControl())
  }

  if (typeof mapboxgl == 'undefined') {
    const script = document.createElement('script')

    script.onload = initMap
    script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.1.1/mapbox-gl.js'
    document.body.appendChild(script)

    const style = document.createElement('link')

    style.href = 'https://api.mapbox.com/mapbox-gl-js/v2.1.1/mapbox-gl.css'
    style.rel = 'stylesheet'

    document.body.appendChild(style)
  } else {
    initMap()
  }
}

export default script
