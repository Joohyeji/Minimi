import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { auth } from '../../firebase'
import useErrorStore from '../../store/useErrorStore'
import useAuthStore from '../../store/useAuthStore'

import logoutIcon from '../../assets/img/logout_icon.png'

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
        <img className="cursor-pointer" src={logoutIcon} />
      </button>
    </div>
  )
}

UserInfo.propTypes = {
  userName: PropTypes.string
}

export default UserInfo
