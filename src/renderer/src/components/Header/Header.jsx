import homeLogo from '../../assets/img/home_logo.svg'
import Search from './Search'
import UserInfo from './UserInfo'

function Header() {
  return (
    <header className="h-20 flex justify-between items-center backdrop-blur-sm bg-white/30">
      <img src={homeLogo} alt="logo" className="h-3/4" />
      {/* <Search /> */}
      {/* <UserInfo /> */}
    </header>
  )
}

export default Header
