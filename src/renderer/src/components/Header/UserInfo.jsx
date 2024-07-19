import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { auth } from '../../firebase'
import useErrorStore from '../../store/useErrorStore'

import logoutIcon from '../../assets/img/logout_icon.png'

function UserInfo({ userName }) {
  const navigate = useNavigate()

  const { setToastMessage, setVisible } = useErrorStore()

  const handleLogOutClick = async () => {
    try {
      await auth.signOut()
      setToastMessage('You are logged Out')
      setVisible(true)
      navigate('/')
    } catch (err) {
      setToastMessage('Logout Failed')
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
