import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import Search from '../Search'

const mockSetSearchQuery = vi.fn()

vi.mock('../../../store/usePostsStore', () => ({
  __esModule: true,
  default: () => ({
    setSearchQuery: mockSetSearchQuery
  })
}))

describe('Search Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('Search 컴포넌트가 올바르게 렌더링됩니다.', () => {
    render(<Search />)
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
  })

  it('입력값 변경 시 상태가 업데이트되고 setSearchQuery가 호출됩니다.', async () => {
    render(<Search />)

    const input = screen.getByPlaceholderText('Search...')
    fireEvent.change(input, { target: { value: 'test' } })

    expect(input.value).toBe('test')

    await waitFor(() => {
      expect(mockSetSearchQuery).toHaveBeenCalledWith('test')
    })
  })
})
