import { useEffect } from 'react'
import useErrorStore from '../store/useErrorStore'
import useAuthStore from '../store/useAuthStore'
import { POLL_INTERVAL } from '../constants/constants'

const useGeoLocation = () => {
  const { setNowLocation } = useAuthStore()
  const { setVisible, setToastMessage } = useErrorStore()

  useEffect(() => {
    const fetchLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setNowLocation({ lat: latitude, lng: longitude })

          console.log('현재 위치가 업데이트되었습니다', latitude, longitude)
        },
        (error) => {
          setToastMessage(`현재 위치 가져오기에 실패했습니다. ${error}`)
          setVisible(true)
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      )
    }

    fetchLocation()

    const intervalId = setInterval(fetchLocation, POLL_INTERVAL)

    return () => {
      clearInterval(intervalId)
    }
  }, [])
}

export default useGeoLocation
