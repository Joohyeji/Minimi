import { Link } from 'react-router-dom'

import GoogleBtn from './GoogleBtn'
import Input from './Input'

function SignIn() {
  return (
    <div className="flex flex-col justify-between justify-center w-full h-full items-center mt-10 gap-10 px-24">
      <h1 className="text-5xl font-black">Create new Account</h1>
      <GoogleBtn />
      <p className="text-gray-500">or</p>
      <form className="w-5/12 min-w-96 flex flex-col justify-between justify-center gap-4">
        <Input />
        <Input />
        <Input />
        <Input />
        <button className="block h-12 min-w-96 rounded-xl bg-black text-white shadow-lg mt-10 font-bold hover:bg-neutral-700">
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
