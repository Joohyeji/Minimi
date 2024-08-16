import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import '@testing-library/jest-dom'
import App from '../App'

vi.mock('../components/Header/Header', () => ({
  default: () => <div>Header</div>
}))
vi.mock('../components/Welcome/Welcome', () => ({
  default: () => <div>Welcome</div>
}))
vi.mock('../components/Welcome/SignIn', () => ({
  default: () => <div>SignIn</div>
}))
vi.mock('../components/Dashboard/Dashboard', () => ({
  default: () => <div>Dashboard</div>
}))
vi.mock('../components/Dashboard/MyMinimies', () => ({
  default: () => <div>MyMinimies</div>
}))
vi.mock('../components/Dashboard/ExploreMore', () => ({
  default: () => <div>ExploreMore</div>
}))
vi.mock('../components/CreateMinimi/CreateMinimi', () => ({
  default: () => <div>CreateMinimi</div>
}))
vi.mock('../components/CreateMinimi/ReadMinimiCard', () => ({
  default: () => <div>ReadMinimiCard</div>
}))
vi.mock('../components/Common/ToastMessage', () => ({
  default: () => <div>ToastMessage</div>
}))
vi.mock('../components/Common/Modal', () => ({
  default: () => <div>Modal</div>
}))

describe.only('App 컴포넌트', () => {
  it('헤더와 토스트 메시지가 렌더링되어야 합니다.', () => {
    render(<App />)

    expect(screen.getByText('Header')).toBeInTheDocument()
    expect(screen.getByText('ToastMessage')).toBeInTheDocument()
  })

  it('루트 경로("/")에서 Welcome 컴포넌트가 렌더링되어야 합니다.', () => {
    window.history.pushState({}, 'Home', '/')

    render(<App />)

    expect(screen.getByText('Welcome')).toBeInTheDocument()
  })

  it('/signin 경로에서 SignIn 컴포넌트가 렌더링되어야 합니다.', async () => {
    window.history.pushState({}, 'Sign In Page', '/#/signin')

    render(<App />)

    expect(screen.getByText('SignIn')).toBeInTheDocument()
  })

  it('/dashboard 경로에서 Dashboard 컴포넌트가 렌더링되어야 합니다.', () => {
    window.history.pushState({}, 'Dashboard Page', '/#/dashboard')

    render(<App />)

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('/createminimi 경로에서 CreateMinimi 컴포넌트가 렌더링되어야 합니다.', () => {
    window.history.pushState({}, 'Create Minimi Page', '/#/createminimi')

    render(<App />)

    expect(screen.getByText('CreateMinimi')).toBeInTheDocument()
  })
})
