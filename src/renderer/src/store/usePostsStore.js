import { create } from 'zustand'

const usePostsStore = create((set) => ({
  minimiPosts: [],
  otherMinimiPosts: [],
  searchQuery: '',

  setMinimiPosts: (posts) => set({ minimiPosts: posts }),
  setOtherMinimiPosts: (posts) => set({ otherMinimiPosts: posts }),
  setSearchQuery: (query) => set({ searchQuery: query })
}))

export default usePostsStore
