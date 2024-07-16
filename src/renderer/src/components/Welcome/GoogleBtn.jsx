import googleIcon from '../../assets/img/google_icon.png'

function GoogleBtn() {
  return (
    <button className="flex justify-center border rounded-2xl py-3 px-5 w-5/12 min-w-96 text-gray-700 h-12 items-center hover:bg-gray-100">
      <div className="w-5 mx-4">
        <img src={googleIcon}></img>
      </div>
      <p className="font-medium">Continue with Google</p>
    </button>
  )
}

export default GoogleBtn
