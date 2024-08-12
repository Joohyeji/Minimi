import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { HashRouter } from 'react-router-dom'
import Welcome from '../Welcome'
import { vi } from 'vitest'
import { signInWithEmailAndPassword } from 'firebase/auth'

vi.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: vi.fn(),
  getAuth: vi.fn(() => ({})),
  GoogleAuthProvider: vi.fn()
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  HashRouter: ({ children }) => <>{children}</>
}))

describe('Welcome Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('"Join in" 버튼 클릭하면 Sign In 페이지로 이동합니다.', () => {
    render(
      <HashRouter>
        <Welcome />
      </HashRouter>
    )

    const joinButton = screen.getByText('Join in')
    fireEvent.click(joinButton)
    expect(mockNavigate).toHaveBeenCalledWith('/signin')
  })

  it('로그인 성공 시 대시보드 페이지로 이동합니다.', async () => {
    signInWithEmailAndPassword.mockResolvedValueOnce({ user: {} })

    render(
      <HashRouter>
        <Welcome />
      </HashRouter>
    )

    fireEvent.change(screen.getByPlaceholderText('Enter email address'), {
      target: { value: 'test@test.test' }
    })
    fireEvent.change(screen.getByPlaceholderText('Enter password'), {
      target: { value: 'testtest' }
    })
    fireEvent.click(screen.getByText('Log in'))

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard/myminimies')
    })
  })

  it('로그인 실패 시 대시보드 페이지로 이동하지 않습니다.', async () => {
    signInWithEmailAndPassword.mockRejectedValueOnce({ code: 'auth/invalid-email' })

    render(
      <HashRouter>
        <Welcome />
      </HashRouter>
    )

    fireEvent.change(screen.getByPlaceholderText('Enter email address'), {
      target: { value: 'invalidemail' }
    })
    fireEvent.change(screen.getByPlaceholderText('Enter password'), {
      target: { value: 'password' }
    })
    fireEvent.click(screen.getByText('Log in'))

    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalledWith('/dashboard/myminimies')
    })
  })
})
