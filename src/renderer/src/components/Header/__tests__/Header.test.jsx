import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { HashRouter } from 'react-router-dom'
import { vi } from 'vitest'
import Header from '../Header'
import homeLogo from '../../../assets/img/home_logo.svg'

vi.mock('../../../store/useAuthStore', () => ({
  __esModule: true,
  default: () => ({
    user: { displayName: 'Joohyeji' },
    isLoggedIn: true
  })
}))

vi.mock('react-router-dom', () => {
  const actual = vi.importActual('react-router-dom')
  return {
    ...actual,
    HashRouter: ({ children }) => <>{children}</>,
    useLocation: () => ({ pathname: '/dashboard' })
  }
})
describe('Header Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('로그인 상태가 아닐 때 UserInfo 컴포넌트는 렌더링되지 않습니다.', () => {
    vi.mock('../../../store/useAuthStore', () => ({
      __esModule: true,
      default: () => ({
        user: { displayName: 'Joohyeji' },
        isLoggedIn: false
      })
    }))

    render(
      <HashRouter>
        <Header />
      </HashRouter>
    )

    const logo = screen.getByAltText('logo')
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('src', homeLogo)

    expect(screen.queryByText('Joohyeji')).toBeNull()
  })
})
