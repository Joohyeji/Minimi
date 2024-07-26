import { create } from 'zustand'
import { POLL_INTERVAL } from '../constants/constants'

const useTimerStore = create((set) => ({
  timer: POLL_INTERVAL,
  isTimerRunning: false,
  isSettingToggle: false,

  setTimer: (time) => set({ timer: time }),
  initTimer: () => set({ timer: POLL_INTERVAL }),
  setIsTimerRunning: (value) => set({ isTimerRunning: value }),
  setSettingToggle: () => set((state) => ({ isSettingToggle: !state.isSettingToggle }))
}))

export default useTimerStore
