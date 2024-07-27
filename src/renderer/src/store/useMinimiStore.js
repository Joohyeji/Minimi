import { create } from 'zustand'
import { SETTING_CARD_LISTS } from '../constants/constants'

const useMinimiStore = create((set) => ({
  settingCardLists: SETTING_CARD_LISTS,
  settingInputLists: [],

  markerPosition: null,
  placeName: '',

  minimiName: '',
  minimiVolume: null,
  minimiBrightness: null,
  wallpaper: null,
  executables: null,
  bookmarks: null,

  prevClosestMinimi: null,
  closestMinimi: null,

  initSettingInputLists: () => set({ settingInputLists: [] }),
  initSettingCardLists: () => set({ settingCardLists: SETTING_CARD_LISTS }),
  addSettingInputLists: (setting) =>
    set((state) => {
      if (!state.settingInputLists.includes(setting)) {
        return { settingInputLists: [...state.settingInputLists, setting] }
      }
      return state
    }),
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
  setWallpaper: (file) => set({ wallpaper: file }),
  setExecutables: (path) => {
    const normalizedPath = Array.isArray(path) && path.length === 0 ? null : path
    set({ executables: normalizedPath })
  },
  setBookmarks: (bookmarks) => set({ bookmarks: bookmarks }),

  resetMinimiData: () =>
    set({
      markerPosition: null,
      minimiName: '',
      placeName: '',
      minimiVolume: null,
      minimiBrightness: null,
      wallpaper: null,
      executables: null,
      bookmarks: null
    }),
  setPrevClosestMinimi: (minimi) => set({ prevClosestMinimi: minimi }),
  setClosestMinimi: (minimi) => set({ closestMinimi: minimi })
}))

export default useMinimiStore
