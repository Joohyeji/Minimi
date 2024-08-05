import { useEffect } from 'react'
import useErrorStore from '../store/useErrorStore'
import useAuthStore from '../store/useAuthStore'
import useTimerStore from '../store/useTimerStore'

const useGeoLocation = () => {
  const { setNowLocation } = useAuthStore()
  const { setVisible, setToastMessage } = useErrorStore()
  const { timer, isTimerRunning, isSettingToggle } = useTimerStore()

  useEffect(() => {
    if (!isSettingToggle && !isTimerRunning) {
      const fetchLocation = () => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords
            setNowLocation({ lat: latitude, lng: longitude })
          },
          (error) => {
            setToastMessage(`현재 위치 가져오기에 실패했습니다. ${error.message}`)
            setVisible(true)
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        )
      }

      fetchLocation()

      const intervalId = setInterval(fetchLocation, timer)

      return () => {
        clearInterval(intervalId)
      }
    }
  }, [isTimerRunning, isSettingToggle, timer, setNowLocation, setToastMessage, setVisible])
}

export default useGeoLocation
