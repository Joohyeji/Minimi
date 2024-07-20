import { useEffect, useRef } from 'react'
import { GoogleMap, useJsApiLoader, MarkerF, Circle } from '@react-google-maps/api'
import useErrorStore from '../../store/useErrorStore'
import useMinimiStore from '../../store/useMinimiStore'
import Loading from '../Common/Loading'
import markerIcon from '../../../src/assets/img/marker_icon.svg'

function Map() {
  const mapRef = useRef(null)

  const { setToastMessage, setVisible } = useErrorStore()
  const { markerPosition, setMarkerPosition } = useMinimiStore()

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY
  })

  const circleOptions = {
    strokeColor: '#000000',
    strokeOpacity: 0.8,
    strokeWeight: 1,
    fillColor: '#92fc4c',
    fillOpacity: 0.35,
    radius: 5
  }

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          const newPosition = { lat: latitude, lng: longitude }
          setMarkerPosition(newPosition)
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
  }, [setToastMessage, setVisible])

  const handleMapClick = (e) => {
    const { latLng } = e
    const newPosition = {
      lat: latLng.lat(),
      lng: latLng.lng()
    }
    setMarkerPosition(newPosition)
  }

  const handleMapLoad = (map) => {
    mapRef.current = map
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
          <Circle center={markerPosition} options={circleOptions} />
          <MarkerF
            position={markerPosition}
            icon={{
              url: markerIcon,
              scaledSize: new window.google.maps.Size(40, 40)
            }}
          />
        </GoogleMap>
      ) : (
        <Loading />
      )}
    </>
  )
}

export default Map
