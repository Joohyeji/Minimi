import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import UserInfo from '../UserInfo'
import { useNavigate } from 'react-router-dom'
import { auth } from '../../../firebase'

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn()
}))

vi.mock('../../../firebase', () => ({
  auth: {
    signOut: vi.fn()
  }
}))

vi.mock('../../../store/useErrorStore', () => ({
  __esModule: true,
  default: () => ({
    setToastMessage: vi.fn(),
    setVisible: vi.fn()
  })
}))

vi.mock('../../../store/useAuthStore', () => ({
  __esModule: true,
  default: () => ({
    clearUser: vi.fn()
  })
}))

vi.mock('../../store/useTimerStore', () => ({
  __esModule: true,
  default: () => ({
    setTimer: vi.fn(),
    initTimer: vi.fn(),
    isTimerRunning: false,
    setIsTimerRunning: vi.fn(),
    isSettingToggle: true,
    setSettingToggle: vi.fn()
  })
}))

describe('UserInfo Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('컴포넌트가 올바르게 렌더링됩니다.', () => {
    render(<UserInfo userName="Joohyeji" />)
    const logOutButton = screen.getByTestId('logout-button')
    expect(logOutButton).toBeInTheDocument()
    expect(screen.getByText('Hello,')).toBeInTheDocument()
    expect(screen.getByText('Joohyeji')).toBeInTheDocument()
  })

  it('로그아웃 버튼 클릭 시 로그아웃 함수가 호출됩니다.', async () => {
    const mockNavigate = vi.fn()
    useNavigate.mockReturnValue(mockNavigate)

    render(<UserInfo userName="Joohyeji" />)

    const logOutButton = screen.getByTestId('logout-button')
    fireEvent.click(logOutButton)

    await waitFor(() => {
      expect(auth.signOut).toHaveBeenCalled()
      expect(mockNavigate).toHaveBeenCalledWith('/')
    })
  })

  it('로그아웃 함수 호출 시 에러가 발생하면 적절히 처리됩니다.', async () => {
    const mockNavigate = vi.fn()
    const mockSignOut = vi.fn().mockRejectedValue(new Error('Logout failed'))
    useNavigate.mockReturnValue(mockNavigate)
    auth.signOut = mockSignOut

    render(<UserInfo userName="Joohyeji" />)

    const logOutButton = screen.getByTestId('logout-button')
    fireEvent.click(logOutButton)

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled()
      expect(mockNavigate).not.toHaveBeenCalled()
    })
  })
})
