import { create } from 'zustand'

const useReadMinimiStore = create((set) => ({
  existingMinimiData: null,

  setExistingMinimiData: (minimiData) => set({ existingMinimiData: minimiData })
}))

export default useReadMinimiStore
