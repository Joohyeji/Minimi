import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, it, vi, expect } from 'vitest'
import DeleteButton from '../DeleteButton'
import { deleteDoc } from 'firebase/firestore'

vi.mock('firebase/firestore', () => ({
  deleteDoc: vi.fn(),
  doc: vi.fn(),
  getFirestore: vi.fn(),
  collection: vi.fn()
}))

vi.mock('../../../store/useDeleteMinimiStore', () => ({
  default: () => ({
    isToggle: true,
    setToggle: vi.fn(),
    selectedIds: ['1', '2'],
    clearSelectedIds: vi.fn()
  })
}))

vi.mock('../../../store/useErrorStore', () => ({
  default: () => ({
    setVisible: vi.fn(),
    setToastMessage: vi.fn()
  })
}))

describe.only('DeleteButton 컴포넌트', () => {
  it('선택된 Minimi가 삭제되고, 성공 메시지가 표시되어야 합니다.', async () => {
    const onFetchMock = vi.fn()

    render(<DeleteButton uid="user123" onFetch={onFetchMock} />)

    const button = screen.getByTestId('delete-button')
    fireEvent.click(button)

    await waitFor(() => {
      expect(deleteDoc).toHaveBeenCalledTimes(2)
      expect(onFetchMock).toHaveBeenCalledWith('user123')
    })

    expect(screen.getByText(/Delete 2 Minimies/i)).toBeInTheDocument()
  })
})
