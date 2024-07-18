import ErrorText from '../Common/ErrorText'

import x_icon from '../../assets/img/x_icon.png'

function SettingInput() {
  return (
    <div>
      <div className="flex items-center gap-10">
        <div className="flex w-10/12 bg-white drop-shadow-md border border-slate-50 rounded-full p-3 px-10 text-neutral-900 font-bold  text-2xl gap-5">
          <span></span>
          <input
            type="text"
            placeholder="Write this minimi's name"
            className="w-full border-b-2 outline-none font-bold  focus:border-black"
          />
        </div>
        <button className="h-10 hover:rotate-90">
          <img src={x_icon} alt="x-button" className="h-full" />
        </button>
      </div>
      {/* <ErrorText /> */}
    </div>
  )
}

export default SettingInput
