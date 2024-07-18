import { create } from 'zustand'

const useAuthStore = create((set) => ({
  user: null,
  isLoggedIn: false,

  setUser: (newUser) => set({ user: newUser, isLoggedIn: !!newUser }),
  clearUser: () => set({ user: null, isLoggedIn: false })
}))

export default useAuthStore
