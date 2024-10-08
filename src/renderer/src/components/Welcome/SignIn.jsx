import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, USER_COLLECTION } from '../../firebase'
import { validateName, validatePassword } from '../../utils/validation'
import useErrorStore from '../../store/useErrorStore'

import GoogleBtn from './GoogleBtn'
import Input from './Input'
import ErrorText from '../Common/ErrorText'
import Loading from '../Common/Loading'

function SignIn() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordCheck, setPasswordCheck] = useState('')
  const navigate = useNavigate()

  const { isLoading, setLoading, setVisible, setToastMessage, setErrorText, errorText } =
    useErrorStore()

  const handleNameChange = (e) => {
    const value = e.target.value
    setName(value)

    if (!validateName(value)) {
      setErrorText('name', '닉네임은 20자 이하이며, 공백이 존재하지 않아야합니다.')
    } else {
      setErrorText('name', '')
    }
  }

  const handleEmailChange = (e) => {
    const value = e.target.value
    setEmail(value)

    setErrorText('email', '')
  }

  const handlePasswordChange = (e) => {
    const value = e.target.value
    setPassword(value)

    if (!validatePassword(value)) {
      setErrorText('password', '비밀번호에 공백을 포함할 수 없습니다.')
    } else {
      setErrorText('password', '')
    }
  }

  const handlePasswordCheckChange = (e) => {
    const value = e.target.value
    setPasswordCheck(value)

    if (value !== password) {
      setErrorText('passwordCheck', '비밀번호가 일치하지 않습니다.')
    } else {
      setErrorText('passwordCheck', '')
    }
  }

  const handleSubmitSignIn = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)

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

      setToastMessage('회원가입되었습니다.')
      setVisible(true)

      navigate('/')
    } catch (err) {
      switch (err.code) {
        case 'auth/invalid-email':
          setErrorText('email', '이메일을 확인해주세요.')
          break
        case 'auth/weak-password':
          setErrorText('password', '비밀번호는 6자 이상이어야합니다.')
          break
        case 'auth/email-already-in-use':
          setErrorText('email', '이미 등록된 이메일입니다.')
          break
        default:
          setToastMessage('오류가 발생했습니다.')
          setVisible(true)
          break
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setErrorText('name', '')
    setErrorText('email', '')
    setErrorText('password', '')
    setErrorText('passwordCheck', '')
  }, [])

  const isSubmitDisabled =
    !!errorText.name || !!errorText.email || !!errorText.password || !!errorText.passwordCheck

  return (
    <div className="flex flex-col justify-between justify-center w-full h-full items-center gap-6 px-24 pb-20">
      <h1 className="text-5xl font-black">Create new Account</h1>
      {isLoading && <Loading />}
      {/* <GoogleBtn /> */}
      <p className="text-neutral-500"> </p>
      <form
        onSubmit={handleSubmitSignIn}
        className="w-5/12 min-w-96 flex flex-col justify-between justify-center gap-4"
      >
        <Input type="text" placeholder="Enter name" value={name} onChange={handleNameChange} />
        <ErrorText message={errorText.name} />
        <Input
          type="email"
          placeholder="Enter email address"
          value={email}
          onChange={handleEmailChange}
        />
        <ErrorText message={errorText.email} />
        <Input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={handlePasswordChange}
        />
        <ErrorText message={errorText.password} />
        <Input
          type="password"
          placeholder="Confirm password"
          value={passwordCheck}
          onChange={handlePasswordCheckChange}
        />
        <ErrorText message={errorText.passwordCheck} />
        <button
          type="submit"
          className="block h-12 min-w-96 rounded-xl bg-black text-white shadow-lg mt-10 font-bold hover:bg-neutral-700 disabled:bg-neutral-700 disabled:cursor-not-allowed"
          disabled={isSubmitDisabled}
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
