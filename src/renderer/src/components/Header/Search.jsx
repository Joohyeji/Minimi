import { useState } from 'react'
import usePostsStore from '../../store/usePostsStore'

function Search() {
  const { setSearchQuery } = usePostsStore()
  const [searchValue, setSearchValue] = useState('')

  const handleInputChange = (e) => {
    const value = e.target.value
    setSearchValue(value)
    setSearchQuery(value)
  }

  return (
    <form className="w-6/12">
      <input
        type="text"
        placeholder="Search..."
        value={searchValue}
        onChange={handleInputChange}
        className="flex-auto w-full bg-gray-100 rounded-full px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300 font-bold tracking-wider"
      />
    </form>
  )
}

export default Search
