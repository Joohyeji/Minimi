import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { auth } from '../../firebase'

import logoutIcon from '../../assets/img/logout_icon.png'

function UserInfo({ userName }) {
  const navigate = useNavigate()

  const handleLogOutClick = async () => {
    try {
      await auth.signOut()
      navigate('/')
    } catch (err) {
      alert('로그아웃에 실패했습니다.')
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
