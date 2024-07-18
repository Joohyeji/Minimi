import { signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '../../firebase'

import googleIcon from '../../assets/img/google_icon.png'

function GoogleBtn() {
  const handleGoogleBtnClick = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
    } catch (err) {
      console.log('Error during Google Sign-In:', err)
    }
  }

  return (
    <button
      onClick={handleGoogleBtnClick}
      className="flex justify-center border rounded-2xl py-3 px-5 w-5/12 min-w-96 text-gray-700 h-12 items-center hover:bg-gray-100"
    >
      <div className="w-5 mx-4">
        <img src={googleIcon}></img>
      </div>
      <p className="font-medium">Continue with Google</p>
    </button>
  )
}

export default GoogleBtn
