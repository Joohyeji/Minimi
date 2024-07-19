import { useEffect, useState, useRef } from 'react'
import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api'
import useErrorStore from '../../store/useErrorStore'

import Loading from '../Common/Loading'

function Map() {
  const [markerPosition, setMarkerPosition] = useState(null)
  const mapRef = useRef(null)

  const { setToastMessage, setVisible } = useErrorStore()

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY
  })

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setMarkerPosition({ lat: latitude, lng: longitude })
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setToastMessage(`사용자가 위치 정보 제공을 거부했습니다. ${error}`)
              break
            case error.POSITION_UNAVAILABLE:
              setToastMessage(`위치 정보를 사용할 수 없습니다. ${error}`)
              break
            case error.TIMEOUT:
              setToastMessage(`위치 정보 요청이 타임아웃되었습니다. ${error}`)
              break
            default:
              setToastMessage(`위치 정보 요청 중 오류가 발생했습니다. ${error}`)
              setVisible(true)
              break
          }
        }
      )
    } else {
      setToastMessage('Geolocation을 지원하지 않는 브라우저입니다.')
      setVisible(true)
    }
  }, [])

  const handleMapClick = (e) => {
    const { latLng } = e
    setMarkerPosition({
      lat: latLng.lat(),
      lng: latLng.lng()
    })
  }

  const handleMapLoad = (map) => {
    mapRef.current = map
    if (markerPosition) {
      const bounds = new window.google.maps.LatLngBounds()
      bounds.extend(markerPosition)
      map.fitBounds(bounds)
    }
  }

  const mapContainerStyle = {
    width: '100%',
    height: '100%'
  }

  const options = {
    mapTypeControl: false,
    disableDefaultUI: true,
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels'
      }
    ]
  }

  return (
    <>
      {isLoaded && markerPosition ? (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={markerPosition}
          zoom={15}
          onLoad={handleMapLoad}
          onClick={handleMapClick}
          options={options}
        >
          <MarkerF position={markerPosition} />
        </GoogleMap>
      ) : (
        <Loading />
      )}
    </>
  )
}

export default Map
