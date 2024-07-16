import { useNavigate } from 'react-router-dom'
import logoutIcon from '../../assets/img/logout_icon.png'

function UserInfo() {
  const navigate = useNavigate()

  const handleLogOutClick = () => {
    navigate('/')
  }

  return (
    <div className="flex items-center">
      <span className="text-xl mr-8">
        Hello, <b className="tracking-wider">Hyeji</b>
      </span>
      <button onClick={handleLogOutClick}>
        <img className="cursor-pointer" src={logoutIcon} />
      </button>
    </div>
  )
}

export default UserInfo
