import { create } from 'zustand'

const usePostsStore = create((set) => ({
  minimiPosts: [],

  setMinimiPosts: (posts) => set({ minimiPosts: posts })
}))

export default usePostsStore
