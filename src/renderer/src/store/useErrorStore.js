import { create } from 'zustand'

const useErrorStore = create((set) => ({
  statusMessage: '',
  errorText: {
    name: '',
    email: '',
    password: '',
    passwordCheck: ''
  },

  setStatusMessage: (message) => set({ statusMessage: message }),
  setErrorText: (field, text) =>
    set((state) => ({
      errorText: { ...state.errorText, [field]: text }
    }))
}))

export default useErrorStore
