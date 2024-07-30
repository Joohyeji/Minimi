import { useLocation } from 'react-router-dom'
import useAuthStore from '../../store/useAuthStore'

import Search from './Search'
import UserInfo from './UserInfo'
import homeLogo from '../../assets/img/home_logo.svg'

function Header() {
  const { user, isLoggedIn } = useAuthStore()
  const userName = isLoggedIn ? user.displayName : ''
  const location = useLocation()
  const isDashboard = location.pathname.includes('dashboard')

  return (
    <header className="px-12 h-20 flex justify-between items-center backdrop-blur-sm bg-white/30 sticky top-0 z-10">
      <img src={homeLogo} alt="logo" className="h-full" />
      {isLoggedIn && (
        <>
          {isDashboard && <Search />}
          <UserInfo userName={userName} />
        </>
      )}
    </header>
  )
}

export default Header
