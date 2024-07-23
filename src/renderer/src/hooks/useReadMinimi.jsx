import { useEffect } from 'react'
import useMinimiStore from '../store/useMinimiStore'
import useReadMinimiStore from '../store/useReadMinimiStore'

const useReadMinimi = () => {
  const { existingMinimiData } = useReadMinimiStore()
  const {
    setMarkerPosition,
    setPlaceName,
    setMinimiName,
    setMinimiBrightness,
    setMinimiVolume,
    setWallpaper
  } = useMinimiStore()

  useEffect(() => {
    if (existingMinimiData) {
      const updates = {
        location: setMarkerPosition,
        address: setPlaceName,
        title: setMinimiName,
        brightness: setMinimiBrightness,
        volume: setMinimiVolume,
        wallpaper: setWallpaper
      }

      Object.entries(existingMinimiData).forEach(([key, value]) => {
        if (value != null && updates[key]) {
          updates[key](value)
        }
      })
    }
  }, [existingMinimiData])
}

export default useReadMinimi
