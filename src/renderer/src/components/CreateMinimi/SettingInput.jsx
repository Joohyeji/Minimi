import ErrorText from '../Common/ErrorText'

function SettingInput() {
  return (
    <>
      <div className="flex w-10/12 bg-white drop-shadow-md border border-slate-50 rounded-full p-5 px-10 text-neutral-900 font-bold  text-2xl gap-5">
        <div>
          <span></span>
        </div>
        <input
          type="text"
          placeholder="write this minimi's name"
          className="w-full border-b-2 outline-none font-black  focus:border-black"
        />
      </div>
      {/* <ErrorText /> */}
    </>
  )
}

export default SettingInput
