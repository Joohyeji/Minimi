import { create } from 'zustand'

const useDeleteMinimiStore = create((set) => ({
  isToggle: false,
  selectedIds: [],

  initToggle: (value) => set({ isToggle: value }),
  setToggle: () => set((state) => ({ isToggle: !state.isToggle })),
  addSelectedId: (id) =>
    set((state) => ({
      selectedIds: [...state.selectedIds, id]
    })),
  removeSelectedId: (id) =>
    set((state) => ({
      selectedIds: state.selectedIds.filter((selectedId) => selectedId !== id)
    })),
  clearSelectedIds: () => set({ selectedIds: [] })
}))

export default useDeleteMinimiStore
