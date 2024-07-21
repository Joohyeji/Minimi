import { create } from 'zustand'
import { SETTING_CARD_LISTS } from '../constants/constants'

const useMinimiStore = create((set) => ({
  settingCardLists: SETTING_CARD_LISTS,
  settingInputLists: [],

  nowLocation: { lat: '', lng: '' },
  markerPosition: null,
  placeName: '',

  minimiName: '',
  minimiVolume: null,
  minimiBrightness: null,

  initSettingInputLists: () => set({ settingInputLists: [] }),
  initSettingCardLists: () => set({ settingCardLists: SETTING_CARD_LISTS }),
  addSettingInputLists: (list) =>
    set((state) => ({
      settingInputLists: [...state.settingInputLists, list]
    })),
  removeFromInputLists: (list) =>
    set((state) => ({
      settingInputLists: state.settingInputLists.filter((item) => item !== list)
    })),
  addSettingCardLists: (cardText) =>
    set((state) => ({ settingCardLists: [...state.settingCardLists, cardText] })),
  removeFromSettingCardLists: (cardText) =>
    set((state) => ({
      settingCardLists: state.settingCardLists.filter((item) => item !== cardText)
    })),

  setMarkerPosition: (markerPosition) => set({ markerPosition: markerPosition }),
  setPlaceName: (address) => set({ placeName: address }),
  setMinimiName: (name) => set({ minimiName: name }),
  setMinimiVolume: (volume) => set({ minimiVolume: volume }),
  setMinimiBrightness: (brightness) => set({ minimiBrightness: brightness }),
  resetMinimiData: () =>
    set({
      markerPosition: null,
      minimiName: '',
      placeName: '',
      minimiVolume: null,
      minimiBrightness: null
    })
}))

export default useMinimiStore
