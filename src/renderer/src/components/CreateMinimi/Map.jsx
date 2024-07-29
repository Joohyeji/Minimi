import PropTypes from 'prop-types'
import { useEffect, useRef } from 'react'
import { GoogleMap, useJsApiLoader, MarkerF, Circle } from '@react-google-maps/api'
import useErrorStore from '../../store/useErrorStore'
import useMinimiStore from '../../store/useMinimiStore'
import useAuthStore from '../../store/useAuthStore'

import Loading from '../Common/Loading'
import markerIcon from '../../../src/assets/img/marker_icon.svg'
import { GOOGLE_MAPS_LIBRARIES, PIN_SIZE, RADIUS } from '../../constants/constants'

function Map({ isSettingMap, isOtherMinimi }) {
  const mapRef = useRef(null)

  const { nowLocation, setNowLocation } = useAuthStore()
  const { setToastMessage, setVisible } = useErrorStore()
  const { markerPosition, setMarkerPosition, setPlaceName } = useMinimiStore()

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    libraries: GOOGLE_MAPS_LIBRARIES
  })

  const circleOptions = {
    strokeColor: '#000000',
    strokeOpacity: 0.8,
    strokeWeight: 1,
    fillColor: '#B3F289',
    fillOpacity: 0.35,
    radius: RADIUS
  }

  const fetchPlaceName = (position) => {
    if (isLoaded && window.google && window.google.maps) {
      const geocoder = new window.google.maps.Geocoder()
      geocoder.geocode({ location: position }, (results, status) => {
        if (status === 'OK' && results[0]) {
          setPlaceName(results[0].formatted_address)
        } else {
          setPlaceName('')
        }
      })
    } else {
      console.error('Google Maps API가 로드되지 않았습니다.')
    }
  }

  useEffect(() => {
    if (isLoaded) {
      setMarkerPosition(nowLocation)
      fetchPlaceName(nowLocation)
    }
  }, [isLoaded])

  const handleMapClick = (e) => {
    const { latLng } = e
    const newPosition = {
      lat: latLng.lat(),
      lng: latLng.lng()
    }
    setMarkerPosition(newPosition)
    fetchPlaceName(newPosition)

    if (isSettingMap) {
      setNowLocation(newPosition)
    }

    setToastMessage('이 위치로 변경되었습니다.')
    setVisible(true)
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
          zoom={17}
          onLoad={handleMapLoad}
          onClick={isOtherMinimi ? null : handleMapClick}
          options={options}
        >
          <Circle center={markerPosition} options={circleOptions} />
          <MarkerF
            position={markerPosition}
            icon={{
              url: markerIcon,
              scaledSize: new window.google.maps.Size(PIN_SIZE, PIN_SIZE)
            }}
          />
        </GoogleMap>
      ) : (
        <Loading />
      )}
    </>
  )
}

Map.propTypes = {
  isSettingMap: PropTypes.bool,
  isOtherMinimi: PropTypes.bool
}

export default Map
