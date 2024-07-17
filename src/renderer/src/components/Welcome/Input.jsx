import PropTypes from 'prop-types'

function Input({ type, placeholder, onChange }) {
  return (
    <div>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full h-12 bg-gray-100 rounded-xl px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300"
        onChange={onChange}
        required
      />
    </div>
  )
}

Input.propTypes = {
  type: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func
}

export default Input
