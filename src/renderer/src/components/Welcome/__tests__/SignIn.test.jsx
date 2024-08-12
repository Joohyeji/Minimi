import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import SignIn from '../SignIn'

vi.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: vi.fn(),
  signInWithPopup: vi.fn(),
  updateProfile: vi.fn(),
  getAuth: vi.fn(() => ({})),
  GoogleAuthProvider: vi.fn()
}))

vi.mock('firebase/firestore', () => ({
  setDoc: vi.fn(),
  doc: vi.fn(),
  collection: vi.fn(),
  getFirestore: vi.fn()
}))

const mockSetVisible = vi.fn()
const mockSetToastMessage = vi.fn()
const mockSetErrorText = vi.fn()

vi.mock('../../../store/useErrorStore', () => ({
  default: () => ({
    setVisible: mockSetVisible,
    setToastMessage: mockSetToastMessage,
    setErrorText: mockSetErrorText,
    errorText: { name: '', email: '', password: '', passwordCheck: '' }
  })
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  Link: ({ children }) => <div>{children}</div>
}))

describe('SignIn Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('SignIn 컴포넌트가 렌더링됩니다.', () => {
    render(<SignIn />)
    expect(screen.getByText('Create new Account')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter email address')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter password')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Confirm password')).toBeInTheDocument()
  })

  it('setErrorText가 호출되는지 확인합니다.', async () => {
    render(<SignIn />)

    fireEvent.change(screen.getByPlaceholderText('Enter name'), {
      target: { value: 'testnamewithaverylongnamethatexceedsthelimit' }
    })
    fireEvent.change(screen.getByPlaceholderText('Enter email address'), {
      target: { value: 'test@test.com' }
    })
    fireEvent.change(screen.getByPlaceholderText('Enter password'), {
      target: { value: 'password123' }
    })
    fireEvent.change(screen.getByPlaceholderText('Confirm password'), {
      target: { value: 'password123' }
    })

    fireEvent.click(screen.getByText('Sign in'))

    await waitFor(() => {
      expect(mockSetErrorText).toHaveBeenCalled()
    })
  })

  it('닉네임이 20자를 넘을 경우 에러 메세지를 표시합니다.', async () => {
    render(<SignIn />)

    fireEvent.change(screen.getByPlaceholderText('Enter name'), {
      target: { value: 'testnamewithaverylongnamethatexceedsthelimit' }
    })
    fireEvent.change(screen.getByPlaceholderText('Enter email address'), {
      target: { value: 'test@test.com' }
    })
    fireEvent.change(screen.getByPlaceholderText('Enter password'), {
      target: { value: 'password123' }
    })
    fireEvent.change(screen.getByPlaceholderText('Confirm password'), {
      target: { value: 'password123' }
    })

    fireEvent.click(screen.getByText('Sign in'))

    await waitFor(() => {
      expect(mockSetErrorText).toHaveBeenCalledWith(
        'name',
        '닉네임은 20자 이하이며, 공백이 존재하지 않아야합니다.'
      )
    })
  })

  it('비밀번호 등록 정보가 같지 않을 경우 에러 메세지를 등록합니다.', async () => {
    render(<SignIn />)

    fireEvent.change(screen.getByPlaceholderText('Enter name'), {
      target: { value: 'testname' }
    })
    fireEvent.change(screen.getByPlaceholderText('Enter email address'), {
      target: { value: 'test@test.com' }
    })
    fireEvent.change(screen.getByPlaceholderText('Enter password'), {
      target: { value: 'password123' }
    })
    fireEvent.change(screen.getByPlaceholderText('Confirm password'), {
      target: { value: 'password456' }
    })

    fireEvent.click(screen.getByText('Sign in'))

    await waitFor(() => {
      expect(mockSetErrorText).toHaveBeenCalledWith(
        'passwordCheck',
        '비밀번호가 일치하지 않습니다.'
      )
    })
  })

  it('비밀번호에 공백이 있을 경우 에러 메세지를 표시합니다.', async () => {
    render(<SignIn />)

    fireEvent.change(screen.getByPlaceholderText('Enter name'), { target: { value: 'testname' } })
    fireEvent.change(screen.getByPlaceholderText('Enter email address'), {
      target: { value: 'test@test.com' }
    })
    fireEvent.change(screen.getByPlaceholderText('Enter password'), {
      target: { value: 'password 123' }
    })
    fireEvent.change(screen.getByPlaceholderText('Confirm password'), {
      target: { value: 'password 123' }
    })

    fireEvent.click(screen.getByText('Sign in'))

    await waitFor(() => {
      expect(mockSetErrorText).toHaveBeenCalledWith(
        'password',
        '비밀번호에 공백을 포함할 수 없습니다.'
      )
    })
  })
})
