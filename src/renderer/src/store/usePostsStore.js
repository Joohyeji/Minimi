import { create } from 'zustand'

const usePostsStore = create((set) => ({
  minimiPosts: [],
  otherMinimiPosts: [],

  setMinimiPosts: (posts) => set({ minimiPosts: posts }),
  setOtherMinimiPosts: (posts) => set({ otherMinimiPosts: posts })
}))

export default usePostsStore
