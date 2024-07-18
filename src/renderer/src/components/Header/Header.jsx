import useAuthStore from '../../store/useAuthStore'

import homeLogo from '../../assets/img/home_logo.svg'
import Search from './Search'
import UserInfo from './UserInfo'

function Header() {
  const { user, isLoggedIn } = useAuthStore()
  const userName = isLoggedIn ? user.displayName : ''

  return (
    <header className="h-20 flex justify-between items-center backdrop-blur-sm bg-white/30 sticky top-0 z-10">
      <img src={homeLogo} alt="logo" className="h-full" />
      {isLoggedIn && (
        <>
          <Search />
          <UserInfo userName={userName} />
        </>
      )}
    </header>
  )
}

export default Header
