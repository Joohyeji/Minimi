import { useNavigate } from 'react-router-dom'

import GoogleBtn from './GoogleBtn'
import Input from './Input'

function Welcome() {
  const navigate = useNavigate()

  const handleLogInClick = () => {
    navigate('/dashboard')
  }
  const handleJoinInClick = () => {
    navigate('/signin')
  }

  return (
    <div className="flex flex-col justify-between justify-center w-full h-full items-center gap-10 px-24">
      <h1 className="text-5xl font-black">Welcome to MNM</h1>
      <p className="text-center text-neutral-500 text-base font-normal">
        MNM 은 개인 맞춤형 PC 환경을 제공하는 서비스입니다. <br />
        자신만의 루틴을 세우고 편리한 기능을 제공받으세요!
      </p>
      <GoogleBtn />
      <p className="text-gray-500">or</p>
      <form className="w-5/12 min-w-96 flex flex-col justify-between justify-center gap-4">
        <Input />
        <Input />
        <div className="flex items-center">
          <input
            type="checkbox"
            id="keepLoggedIn"
            className="cursor-pointer mr-3 bg-gray-300 accent-black"
          />
          <label
            htmlFor="keepLoggedIn"
            className="cursor-pointer text-neutral-500 font-light tracking-wide text-sm"
          >
            keep me logged in
          </label>
        </div>
        <button
          onClick={handleLogInClick}
          className="block h-12 min-w-96 rounded-xl bg-black text-white shadow-lg font-bold hover:bg-neutral-700"
        >
          Log in
        </button>
        <button
          onClick={handleJoinInClick}
          className="block h-12 min-w-96 rounded-xl shadow-lg font-bold hover:bg-gray-50"
        >
          Join in
        </button>
      </form>
    </div>
  )
}

export default Welcome
