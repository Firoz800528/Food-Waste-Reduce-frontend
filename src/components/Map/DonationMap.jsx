import 'mapbox-gl/dist/mapbox-gl.css'
import mapboxgl from 'mapbox-gl'
import { useEffect, useRef } from 'react'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN

const DonationMap = ({ lng, lat }) => {
  const mapContainer = useRef(null)

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: 12
    })

    new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map)
  }, [lng, lat])

  return <div ref={mapContainer} className="w-full h-64 rounded-lg shadow" />
}

export default DonationMap
