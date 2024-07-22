import { create } from 'zustand'

const useAuthStore = create((set) => ({
  user: null,
  isLoggedIn: false,
  nowLocation: null,

  setUser: (newUser) => set({ user: newUser, isLoggedIn: !!newUser }),
  clearUser: () => set({ user: null, isLoggedIn: false }),
  setNowLocation: (location) => set({ nowLocation: location })
}))

export default useAuthStore
