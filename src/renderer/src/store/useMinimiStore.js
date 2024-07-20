import { create } from 'zustand'

const useMinimiStore = create((set) => ({
  nowLocation: { lat: '', lng: '' },
  markerPosition: null,
  placeName: '',
  minimiSetting: {
    uid: '',
    minimiId: '',
    setting: {
      name: '',
      location: { lat: '', lng: '' },
      volume: 0,
      brightness: 0
    }
  },

  setMarkerPosition: (markerPosition) => set({ markerPosition: markerPosition }),
  setPlaceName: (address) => set({ placeName: address })
}))

export default useMinimiStore
