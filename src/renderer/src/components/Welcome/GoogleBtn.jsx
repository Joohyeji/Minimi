import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithRedirect, getRedirectResult } from 'firebase/auth'
import { auth, googleProvider } from '../../firebase'

import googleIcon from '../../assets/img/google_icon.png'

function GoogleBtn() {
  const navigate = useNavigate()

  const handleGoogleBtnClick = async () => {
    try {
      await signInWithRedirect(auth, googleProvider)
    } catch (err) {
      console.log('Error during Google Sign-In:', err)
    }
  }

  useEffect(() => {
    const fetchRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth)
        if (result) {
          console.log('Google Sign-In successful:', result.user)
          navigate('/dashboard/minimi')
        } else {
          console.log('No redirect result available.', result)
        }
      } catch (err) {
        console.log('Error getting redirect result:', err)
      }
    }

    fetchRedirectResult()
  }, [navigate])

  return (
    <button
      onClick={handleGoogleBtnClick}
      className="flex justify-center border rounded-2xl py-3 px-5 w-5/12 min-w-96 text-gray-700 h-12 items-center hover:bg-gray-100"
    >
      <div className="w-5 mx-4">
        <img src={googleIcon} alt="Google icon" />
      </div>
      <p className="font-medium">Continue with Google</p>
    </button>
  )
}

export default GoogleBtn
