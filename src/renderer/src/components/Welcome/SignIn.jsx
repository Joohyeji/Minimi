import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../firebase'

import GoogleBtn from './GoogleBtn'
import Input from './Input'
import ErrorText from '../Common/ErrorText'

function SignIn() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordCheck, setPasswordCheck] = useState('')
  const navigate = useNavigate()

  const handleSubmitSignIn = async (e) => {
    e.preventDefault()

    if (password !== passwordCheck) {
      alert('Passwords do not match')
      return
    }

    try {
      const createdUser = await createUserWithEmailAndPassword(auth, email, password)
      console.log('회원가입 성공', createdUser)

      alert('회원가입에 성공하셨습니다. 로그인 해주세요.')
      navigate('/')
    } catch (err) {
      switch (err.code) {
        case 'auth/invalid-email':
          alert('이메일을 바르게 입력해주세요.')
          break
        case 'auth/weak-password':
          alert('비밀번호가 너무 쉬워요.')
          break
        case 'auth/email-already-in-use':
          alert('등록된 이메일 입니다.')
          break
        default:
          console.log('회원가입 실패', err)
          break
      }
    }
  }

  return (
    <div className="flex flex-col justify-between justify-center w-full h-full items-center gap-10 px-24">
      <h1 className="text-5xl font-black">Create new Account</h1>
      <GoogleBtn />
      <p className="text-neutral-500">or</p>
      <form
        onSubmit={handleSubmitSignIn}
        className="w-5/12 min-w-96 flex flex-col justify-between justify-center gap-4"
      >
        <Input
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
        <Input
          type="password"
          placeholder="Confirm password"
          value={passwordCheck}
          onChange={(e) => setPasswordCheck(e.target.value)}
        />
        <button
          type="submit"
          className="block h-12 min-w-96 rounded-xl bg-black text-white shadow-lg mt-10 font-bold hover:bg-neutral-700"
        >
          Sign in
        </button>
      </form>
      <div className="flex gap-5">
        <span className="text-neutral-500 font-light">Already have an account?</span>
        <Link
          to="/"
          className="text-gray-500 font-bold cursor-pointer decoration-solid hover:underline"
        >
          Log In
        </Link>
      </div>
    </div>
  )
}

export default SignIn
