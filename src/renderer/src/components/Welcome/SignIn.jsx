import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, USER_COLLECTION } from '../../firebase'
import { validateName, validatePassword } from '../../utils/validation'
import useErrorStore from '../../store/useErrorStore'

import GoogleBtn from './GoogleBtn'
import Input from './Input'
import ErrorText from '../Common/ErrorText'

function SignIn() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordCheck, setPasswordCheck] = useState('')
  const navigate = useNavigate()

  const setErrorText = useErrorStore((state) => state.setErrorText)
  const errorText = useErrorStore((state) => state.errorText)

  const handleSubmitSignIn = async (e) => {
    e.preventDefault()

    setErrorText('name', '')
    setErrorText('email', '')
    setErrorText('password', '')
    setErrorText('passwordCheck', '')

    if (!validateName(name)) {
      setErrorText('name', 'Nicknames can be no more than 20 letters and numbers with no spaces')
      return
    }

    if (!validatePassword(password)) {
      setErrorText('password', 'Passwords cannot contain spaces')
      return
    }

    if (password !== passwordCheck) {
      setErrorText('passwordCheck', 'Passwords do not match')
      return
    }

    try {
      const createdUser = await createUserWithEmailAndPassword(auth, email, password)

      await updateProfile(auth.currentUser, {
        displayName: name
      })
      await setDoc(doc(USER_COLLECTION, createdUser.user.uid), {
        uid: createdUser.user.uid,
        name,
        email,
        password
      })

      alert('회원가입에 성공하셨습니다. 로그인 해주세요.')

      navigate('/')
    } catch (err) {
      switch (err.code) {
        case 'auth/invalid-email':
          setErrorText('email', 'Enter your email correctly')
          break
        case 'auth/weak-password':
          setErrorText('password', 'Password must be at least 6 characters long')
          break
        case 'auth/email-already-in-use':
          setErrorText('email', 'Email already registered')
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
        <ErrorText message={errorText.name} />
        <Input
          type="email"
          placeholder="Enter email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <ErrorText message={errorText.email} />
        <Input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <ErrorText message={errorText.password} />
        <Input
          type="password"
          placeholder="Confirm password"
          value={passwordCheck}
          onChange={(e) => setPasswordCheck(e.target.value)}
        />
        <ErrorText message={errorText.passwordCheck} />
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
