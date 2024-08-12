import { render, screen, fireEvent } from '@testing-library/react'
import { HashRouter } from 'react-router-dom'
import Welcome from '../Welcome'
import { vi } from 'vitest'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  HashRouter: ({ children }) => <>{children}</>
}))

describe('Welcome Component', () => {
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
})
