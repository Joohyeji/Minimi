import PropTypes from 'prop-types'
import { useEffect, useState, useRef } from 'react'
import useErrorStore from '../../store/useErrorStore'
import useMinimiStore from '../../store/useMinimiStore'
import useReadMinimiStore from '../../store/useReadMinimiStore'
import Loading from '../Common/Loading'
import BookmarkItem from './BookmarkItem'
import { MAX_SELECT_AUTORUN } from '../../constants/constants'

const MultiSelectDropdown = ({ type, disabled }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState([])
  const [selectedBookmarks, setSelectedBookmarks] = useState([])

  const { setToastMessage, setVisible, isLoading, setLoading } = useErrorStore()
  const { executables, setExecutables, baseBookmarks, setBookmarks } = useMinimiStore()
  const { executeOptions, addExecuteOptions } = useReadMinimiStore()

  const dropdownRef = useRef(null)
  const fileInputRef = useRef(null)

  const buttonText =
    type === 'bookmarks'
      ? 'Select Bookmarks'
      : selectedOptions.length > 0
        ? `${selectedOptions.length} selected`
        : 'Select files'

  const handleToggle = () => setIsOpen(!isOpen)

  const handleCheckboxChange = (bookmark) => {
    if (type === 'bookmarks') {
      setSelectedBookmarks((prev) => {
        if (isBookmarkSelected(bookmark.guid)) {
          return prev.filter((b) => b.guid !== bookmark.guid)
        } else {
          return [...prev, bookmark]
        }
      })
    } else {
      const value = bookmark
      setSelectedOptions((prev) => {
        if (prev.includes(value)) {
          return prev.filter((v) => v !== value)
        } else {
          if (prev.length < MAX_SELECT_AUTORUN) {
            return [...prev, value]
          } else {
            setToastMessage(`${MAX_SELECT_AUTORUN}개 까지만 선택할 수 있습니다.`)
            setVisible(true)
            return prev
          }
        }
      })
    }
  }

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files)
    const newOptions = files.map((file) => ({
      value: file.path,
      label: file.name
    }))
    addExecuteOptions(newOptions)
  }
  const handleAddFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFolderClick = (folder) => {
    setSelectedBookmarks((prev) => {
      const areAllChildrenSelected = folder.children.every((child) =>
        prev.some((b) => b.guid === child.guid)
      )

      if (areAllChildrenSelected) {
        return prev.filter((b) => !folder.children.some((child) => child.guid === b.guid))
      } else {
        return [...prev, ...folder.children.filter((child) => !isBookmarkSelected(child.guid))]
      }
    })
  }

  const flattenBookmarks = (bookmarks) => {
    const flatList = []
    const traverse = (bookmark) => {
      flatList.push(bookmark)
      if (bookmark.children) {
        bookmark.children.forEach(traverse)
      }
    }
    bookmarks.forEach(traverse)
    return flatList
  }

  const isBookmarkSelected = (guid) => selectedBookmarks.some((b) => b.guid === guid)

  const handleOutsideClick = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    if (executables && executables.length > 0) {
      setSelectedOptions(executables)
    }
  }, [executables])

  useEffect(() => {
    setExecutables(selectedOptions)
  }, [selectedOptions, setExecutables])

  useEffect(() => {
    setLoading(true)
    if (executeOptions.length > 0) {
      setLoading(false)
    }
  }, [executeOptions])

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  useEffect(() => {
    if (type) {
      if (baseBookmarks && baseBookmarks.length > 0) {
        setSelectedBookmarks(flattenBookmarks(baseBookmarks))
      }
    }
  }, [baseBookmarks])

  useEffect(() => {
    setBookmarks(selectedBookmarks)
  }, [selectedBookmarks])

  return (
    <div className="relative inline-block w-full" ref={dropdownRef}>
      <button
        onClick={disabled ? null : handleToggle}
        className="text-base font-medium leading-7 border rounded bg-black text-white px-2 cursor-pointer hover:bg-neutral-700 truncate flex items-center justify-between w-full"
        disabled={disabled}
      >
        {buttonText}
        <span className={`ml-2 ${isOpen ? 'rotate-180' : 'rotate-0'} transition-transform`}>
          &#9662;
        </span>
      </button>
      {isOpen && (
        <div className="bg-white border border-gray-300 shadow-lg mt-1 rounded-md w-full max-h-[200px] overflow-y-auto">
          {!isLoading ? (
            <>
              {type !== 'bookmarks' ? (
                <>
                  <button
                    onClick={handleAddFileClick}
                    className="w-full block px-4 py-1 bg-gray-100 font-medium hover:bg-black hover:text-white text-sm font-normal sticky top-0"
                  >
                    + Add File
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {executeOptions.map((option) => (
                    <label
                      key={option.value}
                      className="flex align-center block px-4 py-2 hover:bg-gray-100 text-sm font-normal"
                    >
                      <input
                        type="checkbox"
                        value={option.value}
                        onChange={(e) => handleCheckboxChange(e.target.value)}
                        checked={selectedOptions.includes(option.value)}
                        className="cursor-pointer mr-3 bg-gray-300 accent-black"
                      />
                      {option.label}
                    </label>
                  ))}
                </>
              ) : (
                baseBookmarks &&
                baseBookmarks.map((bookmark) => (
                  <BookmarkItem
                    key={bookmark.guid}
                    bookmark={bookmark}
                    handleCheckboxChange={handleCheckboxChange}
                    selectedBookmarks={selectedBookmarks}
                    handleFolderClick={handleFolderClick}
                  />
                ))
              )}
            </>
          ) : (
            <Loading />
          )}
        </div>
      )}
    </div>
  )
}

MultiSelectDropdown.propTypes = {
  type: PropTypes.string,
  disabled: PropTypes.bool
}

export default MultiSelectDropdown
