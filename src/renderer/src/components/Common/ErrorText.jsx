import PropTypes from 'prop-types'

function ErrorText({ message }) {
  return <p className="-mt-3 px-3 text-red-500 text-sm font-light">{message}</p>
}

ErrorText.propTypes = {
  message: PropTypes.string
}

export default ErrorText
