import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, it, expect, vi } from 'vitest'
import MultiSelectDropdown from '../MultiSelectDropdown'
import useErrorStore from '../../../store/useErrorStore'
import useMinimiStore from '../../../store/useMinimiStore'
import useReadMinimiStore from '../../../store/useReadMinimiStore'

vi.mock('../../../store/useErrorStore')
vi.mock('../../../store/useMinimiStore')
vi.mock('../../../store/useReadMinimiStore')

describe('MultiSelectDropdown Component', () => {
  beforeEach(() => {
    useErrorStore.mockReturnValue({
      setToastMessage: vi.fn(),
      setVisible: vi.fn(),
      isLoading: false,
      setLoading: vi.fn()
    })
    useMinimiStore.mockReturnValue({
      executables: [],
      setExecutables: vi.fn(),
      baseBookmarks: [],
      setBookmarks: vi.fn()
    })
    useReadMinimiStore.mockReturnValue({
      executeOptions: [],
      addExecuteOptions: vi.fn()
    })
  })

  it('드롭다운 버튼을 렌더링합니다', () => {
    render(<MultiSelectDropdown type="executables" disabled={false} />)
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('Select files')
  })

  it('버튼을 클릭하면 드롭다운이 토글됩니다.', () => {
    render(<MultiSelectDropdown type="executables" disabled={false} />)
    const dropdownButton = screen.getByRole('button', { name: /select files/i })

    fireEvent.click(dropdownButton)
    const addButton = screen.getByRole('button', { name: /\+ add file/i })
    expect(addButton).toBeInTheDocument()

    fireEvent.click(dropdownButton)
    waitFor(() => {
      expect(addButton).not.toBeInTheDocument()
    })
  })
})
