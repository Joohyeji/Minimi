import { create } from 'zustand'

const useReadMinimiStore = create((set) => ({
  existingMinimiData: null,
  executeOptions: [],

  setExistingMinimiData: (minimiData) => set({ existingMinimiData: minimiData }),
  setExecuteOptions: (options) => set({ executeOptions: options }),
  addExecuteOptions: (newOptions) => {
    set((state) => {
      const updatedOptions = [...state.executeOptions, ...newOptions]
      return { executeOptions: updatedOptions }
    })
  }
}))

export default useReadMinimiStore
