import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import BookmarkItem from '../BookmarkItem'
import '@testing-library/jest-dom'

describe('BookmarkItem 컴포넌트', () => {
  const bookmark = {
    guid: '1',
    name: 'Folder 1',
    children: [
      {
        guid: '2',
        name: 'Child 1',
        children: []
      },
      {
        guid: '3',
        name: 'Child 2',
        children: []
      }
    ]
  }

  const handleCheckboxChange = vi.fn()
  const handleFolderClick = vi.fn()
  const selectedBookmarks = []

  it('폴더와 자식 북마크가 렌더링되어야 합니다.', () => {
    render(
      <BookmarkItem
        bookmark={bookmark}
        handleCheckboxChange={handleCheckboxChange}
        selectedBookmarks={selectedBookmarks}
        handleFolderClick={handleFolderClick}
      />
    )

    expect(screen.getByText('Folder 1')).toBeInTheDocument()
    expect(screen.getByText('Child 1')).toBeInTheDocument()
    expect(screen.getByText('Child 2')).toBeInTheDocument()
  })

  it('체크박스를 클릭하면 handleCheckboxChange가 호출되어야 합니다.', () => {
    render(
      <BookmarkItem
        bookmark={bookmark}
        handleCheckboxChange={handleCheckboxChange}
        selectedBookmarks={selectedBookmarks}
        handleFolderClick={handleFolderClick}
      />
    )

    const checkbox = screen.getByLabelText('Folder 1')
    fireEvent.click(checkbox)

    expect(handleCheckboxChange).toHaveBeenCalledWith(bookmark)
  })

  it('폴더를 클릭하면 handleFolderClick가 호출되어야 합니다.', () => {
    render(
      <BookmarkItem
        bookmark={bookmark}
        handleCheckboxChange={handleCheckboxChange}
        selectedBookmarks={selectedBookmarks}
        handleFolderClick={handleFolderClick}
      />
    )

    const folderLabel = screen.getByText('Folder 1')
    fireEvent.click(folderLabel)

    expect(handleFolderClick).toHaveBeenCalledWith(bookmark)
  })

  it('북마크가 선택되었을 때 체크박스가 체크되어야 합니다.', () => {
    const selectedBookmarks = [{ guid: '2' }]

    render(
      <BookmarkItem
        bookmark={bookmark}
        handleCheckboxChange={handleCheckboxChange}
        selectedBookmarks={selectedBookmarks}
        handleFolderClick={handleFolderClick}
      />
    )

    const checkbox = screen.getByLabelText('Child 1')
    expect(checkbox).toBeChecked()
  })
})
