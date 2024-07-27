import PropTypes from 'prop-types'

const BookmarkItem = ({ bookmark, handleCheckboxChange, selectedBookmarks, handleFolderClick }) => {
  const isFolder = bookmark.children && bookmark.children.length > 0

  const isChecked = isFolder
    ? bookmark.children.every((child) => selectedBookmarks.some((b) => b.guid === child.guid))
    : selectedBookmarks.some((b) => b.guid === bookmark.guid)

  return (
    <div className="ml-4">
      <label
        className={`flex align-center block px-4 py-2 hover:bg-gray-100 text-sm font-normal relative ${
          isFolder ? 'cursor-pointer' : ''
        }`}
        onClick={() => isFolder && handleFolderClick(bookmark)}
      >
        <input
          type="checkbox"
          value={bookmark.guid}
          onChange={() => handleCheckboxChange(bookmark)}
          checked={isChecked}
          className="cursor-pointer mr-3 bg-gray-300 accent-black"
        />
        {bookmark.name}
        {isFolder && (
          <svg
            width="20"
            height="20"
            viewBox="0 0 50 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="fill-minimi-green absolute right-3"
          >
            <path d="M6.25 39.5833V10.4166H19.9917L24.1583 14.5833H43.75V39.5833H6.25Z" />
          </svg>
        )}
      </label>
      {isFolder &&
        bookmark.children.map((child) => (
          <BookmarkItem
            key={child.guid}
            bookmark={child}
            handleCheckboxChange={handleCheckboxChange}
            selectedBookmarks={selectedBookmarks}
            handleFolderClick={handleFolderClick}
          />
        ))}
    </div>
  )
}

BookmarkItem.propTypes = {
  bookmark: PropTypes.shape({
    guid: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    children: PropTypes.arrayOf(
      PropTypes.shape({
        guid: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        children: PropTypes.array
      })
    )
  }).isRequired,
  handleCheckboxChange: PropTypes.func.isRequired,
  selectedBookmarks: PropTypes.arrayOf(
    PropTypes.shape({
      guid: PropTypes.string.isRequired
    })
  ).isRequired,
  handleFolderClick: PropTypes.func.isRequired
}

export default BookmarkItem
