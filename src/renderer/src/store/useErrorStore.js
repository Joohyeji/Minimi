import { create } from 'zustand'

const useErrorStore = create((set) => ({
  isLoading: false,
  isToastVisible: false,
  toastMessage: '',
  errorText: {
    name: '',
    email: '',
    password: '',
    passwordCheck: ''
  },

  setLoading: (loading) => set({ isLoading: loading }),
  setVisible: (visible) => set({ isToastVisible: visible }),
  setToastMessage: (message) => set({ toastMessage: message }),
  setErrorText: (field, text) =>
    set((state) => ({
      errorText: { ...state.errorText, [field]: text }
    }))
}))

export default useErrorStore
