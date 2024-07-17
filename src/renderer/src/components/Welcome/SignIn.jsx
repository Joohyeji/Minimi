import { useState } from 'react'
import { Link } from 'react-router-dom'
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

  const handleSubmit = async (e) => {
    e.preventDefault()
  }

  return (
    <div className="flex flex-col justify-between justify-center w-full h-full items-center gap-10 px-24">
      <h1 className="text-5xl font-black">Create new Account</h1>
      <GoogleBtn />
      <p className="text-neutral-500">or</p>
      <form
        onSubmit={handleSubmit}
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
