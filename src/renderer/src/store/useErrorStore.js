import { create } from 'zustand'

const useErrorStore = create((set) => ({
  isToastVisible: false,
  toastMessage: '',
  errorText: {
    name: '',
    email: '',
    password: '',
    passwordCheck: ''
  },

  setVisible: (visible) => set({ isToastVisible: visible }),
  setToastMessage: (message) => set({ toastMessage: message }),
  setErrorText: (field, text) =>
    set((state) => ({
      errorText: { ...state.errorText, [field]: text }
    }))
}))

export default useErrorStore
