import { create } from 'zustand'

const useMinimiStore = create((set) => ({
  nowLocation: { lat: '', lng: '' },
  markerPosition: null,
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

  setMarkerPosition: (markerPosition) => set({ markerPosition: markerPosition })
}))

export default useMinimiStore
