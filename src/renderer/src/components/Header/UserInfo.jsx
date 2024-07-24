import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { auth } from '../../firebase'
import useErrorStore from '../../store/useErrorStore'
import useAuthStore from '../../store/useAuthStore'

function UserInfo({ userName }) {
  const navigate = useNavigate()

  const { setToastMessage, setVisible } = useErrorStore()
  const { clearUser } = useAuthStore()

  const handleLogOutClick = async () => {
    try {
      await auth.signOut()
      clearUser()
      setToastMessage('로그아웃되었습니다.')
      setVisible(true)
      navigate('/')
    } catch (err) {
      setToastMessage('로그아웃 중 오류가 발생했습니다.')
      setVisible(true)
    }
  }

  return (
    <div className="flex items-center">
      <span className="text-xl mr-8">
        Hello, <b className="tracking-wider">{userName}</b>
      </span>
      <button onClick={handleLogOutClick}>
        <svg
          width="30"
          height="30"
          viewBox="0 0 35 35"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="fill-neutral-500 hover:fill-black"
        >
          <path d="M3.88889 35C2.81944 35 1.90426 34.6195 1.14333 33.8586C0.382407 33.0977 0.0012963 32.1819 0 31.1111V3.88889C0 2.81944 0.381111 1.90426 1.14333 1.14333C1.90556 0.382407 2.82074 0.0012963 3.88889 0H17.5V3.88889H3.88889V31.1111H17.5V35H3.88889ZM25.2778 27.2222L22.6042 24.4028L27.5625 19.4444H11.6667V15.5556H27.5625L22.6042 10.5972L25.2778 7.77778L35 17.5L25.2778 27.2222Z" />
        </svg>
      </button>
    </div>
  )
}

UserInfo.propTypes = {
  userName: PropTypes.string
}

export default UserInfo
