import { create } from 'zustand'

const useReadMinimiStore = create((set) => ({
  existingMinimiData: null,
  executeOptions: [],

  setExistingMinimiData: (minimiData) => set({ existingMinimiData: minimiData }),
  setExecuteOptions: (options) => set({ executeOptions: options })
}))

export default useReadMinimiStore
