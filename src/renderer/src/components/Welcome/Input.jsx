import ErrorText from '../Common/ErrorText'

function Input() {
  return (
    <div>
      <input
        type="text"
        placeholder="Enter email address"
        className="w-full h-12 bg-gray-100 rounded-xl px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300"
      />
      {/* <ErrorText /> */}
    </div>
  )
}

export default Input
