import { create } from 'zustand'

const useDeleteMinimiStore = create((set) => ({
  isToggle: false,

  setToggle: () => set((state) => ({ isToggle: !state.isToggle }))
}))

export default useDeleteMinimiStore
