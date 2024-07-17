import { useNavigate } from 'react-router-dom'

import SettingInput from './SettingInput'
import prev_icon from '../../assets/img/previous_icon.png'

function CreateMinimi() {
  const navigate = useNavigate()

  const handlePrevBtnClick = () => {
    navigate(-1)
  }
  return (
    <div className="flex">
      <div className="w-3/5">
        <div className="flex items-center -mt-5">
          <button onClick={handlePrevBtnClick} className="mr-6">
            <img src={prev_icon} />
          </button>
          <h1 className="text-5xl font-bold ">Make new Minimi</h1>
        </div>
        <section className="mt-5 w-full flex flex-col gap-5 pb-5 overflow-auto h-[680px]">
          <SettingInput />
          <SettingInput />
          <SettingInput />
          <SettingInput />
          <SettingInput />
          <SettingInput />
          <SettingInput />
          <SettingInput />
        </section>
        <button className="fix absolute bottom-7 w-[150px] bg-black text-white px-5 py-3 rounded-full text-lg font-bold hover:bg-neutral-700">
          DONE .
        </button>
      </div>
      <div className="ml-5 h-[900px] w-2/5 bg-gray-200 -mt-20"></div>
    </div>
  )
}

export default CreateMinimi
