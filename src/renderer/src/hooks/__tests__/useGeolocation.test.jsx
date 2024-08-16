import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import useGeolocation from '../useGeolocation'
import useAuthStore from '../../store/useAuthStore'
import useTimerStore from '../../store/useTimerStore'

vi.mock('../../store/useAuthStore', () => ({
  __esModule: true,
  default: vi.fn(() => ({
    setNowLocation: vi.fn()
  }))
}))

vi.mock('../../store/useErrorStore', () => ({
  __esModule: true,
  default: vi.fn(() => ({
    setVisible: vi.fn(),
    setToastMessage: vi.fn()
  }))
}))

vi.mock('../../store/useTimerStore', () => ({
  __esModule: true,
  default: vi.fn(() => ({
    timer: 5000,
    isTimerRunning: false,
    isSettingToggle: false
  }))
}))

global.navigator.geolocation = {
  getCurrentPosition: vi.fn()
}

describe('useGeolocation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('isSettingToggle이 true라면 실행되지않습니다.', () => {
    useTimerStore.mockReturnValue({
      timer: 5000,
      isTimerRunning: false,
      isSettingToggle: true
    })

    const mockSetNowLocation = vi.fn()
    useAuthStore.mockReturnValue({
      setNowLocation: mockSetNowLocation
    })

    const geolocationSpy = vi.spyOn(global.navigator.geolocation, 'getCurrentPosition')

    renderHook(() => useGeolocation())

    expect(geolocationSpy).not.toHaveBeenCalled()
  })

  it('isTimerRunning이 true라면 실행되지않습니다.', () => {
    useTimerStore.mockReturnValue({
      timer: 5000,
      isTimerRunning: true,
      isSettingToggle: false
    })

    const mockSetNowLocation = vi.fn()
    useAuthStore.mockReturnValue({
      setNowLocation: mockSetNowLocation
    })

    const geolocationSpy = vi.spyOn(global.navigator.geolocation, 'getCurrentPosition')

    renderHook(() => useGeolocation())

    expect(geolocationSpy).not.toHaveBeenCalled()
  })

  it('isSettingToggle과  isTimerRunning이 false일 때 실행됩니다.', () => {
    useTimerStore.mockReturnValue({
      timer: 5000,
      isTimerRunning: false,
      isSettingToggle: false
    })

    const mockSetNowLocation = vi.fn()
    useAuthStore.mockReturnValue({
      setNowLocation: mockSetNowLocation
    })

    const geolocationSpy = vi.spyOn(global.navigator.geolocation, 'getCurrentPosition')

    renderHook(() => useGeolocation())

    expect(geolocationSpy).toHaveBeenCalled()
  })
})
