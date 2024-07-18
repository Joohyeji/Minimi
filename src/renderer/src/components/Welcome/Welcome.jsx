import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../firebase'

import GoogleBtn from './GoogleBtn'
import Input from './Input'

function Welcome() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogInSubmit = async (e) => {
    e.preventDefault()

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      console.log('로그인 성공', user)

      navigate('/dashboard/myminimies')
    } catch (err) {
      switch (err.code) {
        case 'auth/user-not-found':
          alert('사용자를 찾을 수 없습니다.')
          break
        case 'auth/wrong-password':
          alert('잘못된 비밀번호입니다.')
          break
        case 'auth/invalid-email':
          alert('이메일을 바르게 입력해주세요.')
          break
        default:
          console.log('로그인 실패', err)
          break
      }
    }
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
      <form
        onSubmit={handleLogInSubmit}
        className="w-5/12 min-w-96 flex flex-col justify-between justify-center gap-4"
      >
        <Input
          type="email"
          placeholder="Enter email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
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
        <button className="block h-12 min-w-96 rounded-xl bg-black text-white shadow-lg font-bold hover:bg-neutral-700">
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
