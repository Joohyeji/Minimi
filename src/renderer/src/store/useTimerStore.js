import { create } from 'zustand'
import { POLL_INTERVAL } from '../constants/constants'

const useTimerStore = create((set) => ({
  timer: POLL_INTERVAL,
  countDown: null,

  setTimer: (time) => set({ timer: time }),
  initTimer: () => set({ timer: POLL_INTERVAL }),
  setCountDown: (time) => set({ countDown: time })
}))

export default useTimerStore
