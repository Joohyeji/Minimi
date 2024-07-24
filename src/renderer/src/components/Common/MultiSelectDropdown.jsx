import PropTypes from 'prop-types'
import { useEffect, useState, useRef } from 'react'

import useErrorStore from '../../store/useErrorStore'
import { MAX_SELECT_AUTORUN } from '../../constants/constants'

const MultiSelectDropdown = ({ options }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState([])
  const { setToastMessage, setVisible } = useErrorStore()
  const dropdownRef = useRef(null)

  const handleToggle = () => setIsOpen(!isOpen)

  const handleCheckboxChange = (e) => {
    const value = e.target.value
    if (selectedOptions.includes(value)) {
      setSelectedOptions((prev) => prev.filter((v) => v !== value))
    } else {
      if (selectedOptions.length < MAX_SELECT_AUTORUN) {
        setSelectedOptions((prev) => [...prev, value])
      } else {
        setToastMessage(`${MAX_SELECT_AUTORUN}개 까지만 선택할 수 있습니다.`)
        setVisible(true)
      }
    }
  }

  const handleOutsideClick = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  return (
    <div className="relative inline-block w-full" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className="text-base font-medium leading-7 border rounded bg-black text-white px-2 cursor-pointer hover:bg-neutral-700 truncate flex items-center justify-between w-full"
      >
        {selectedOptions.length > 0 ? `${selectedOptions.length} selected` : 'Select files'}
        <span className={`ml-2 ${isOpen ? 'rotate-180' : 'rotate-0'} transition-transform`}>
          &#9662;
        </span>
      </button>
      {isOpen && (
        <div className="bg-white border border-gray-300 shadow-lg mt-1 rounded-md w-full max-h- overflow-y-auto">
          {options.map((option) => (
            <label
              key={option.value}
              className="block px-4 py-2 hover:bg-gray-100 text-sm font-normal"
            >
              <input
                type="checkbox"
                value={option.value}
                onChange={handleCheckboxChange}
                checked={selectedOptions.includes(option.value)}
                className="cursor-pointer mr-3 bg-gray-300 accent-black"
              />
              {option.label}
              hover:bg-gray-100 text-sm font-normal
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

MultiSelectDropdown.propTypes = {
  options: PropTypes.array
}

export default MultiSelectDropdown
