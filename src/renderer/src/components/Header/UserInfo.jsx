import logoutIcon from '../../assets/img/logout_icon.png'

function UserInfo() {
  return (
    <div className="flex items-center">
      <span className="text-xl">
        Hello, <b className="tracking-wider">Hyeji</b>
      </span>
      <img className="ml-8 cursor-pointer" src={logoutIcon} />
    </div>
  )
}

export default UserInfo
