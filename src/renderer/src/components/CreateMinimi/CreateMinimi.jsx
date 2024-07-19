import { useNavigate } from 'react-router-dom'

import SettingInput from './SettingInput'
import SettingCard from './SettingCard'
import Map from './Map'
import prev_icon from '../../assets/img/previous_icon.png'

function CreateMinimi() {
  const navigate = useNavigate()

  const handlePrevBtnClick = () => {
    navigate(-1)
  }

  return (
    <div className="flex">
      <div className="w-3/5">
        <div className="flex items-center -mt-5 relative">
          <button onClick={handlePrevBtnClick} className="relative hover:translate-x-[-10px]">
            <img src={prev_icon} />
          </button>
          <h1 className="ml-6 text-4xl font-bold ">Make new Minimi</h1>
        </div>
        <section className="mt-5 w-full flex flex-col gap-5 p-2 pb-5 overflow-auto h-[680px]">
          <SettingInput />
          <div className="flex justify-center w-10/12 gap-8">
            <SettingCard />
            <SettingCard />
            <SettingCard />
            <SettingCard />
            <SettingCard />
          </div>
        </section>
        <button className="absolute bottom-7 w-[150px] bg-black text-white px-5 py-3 rounded-full text-lg font-bold hover:bg-neutral-700">
          DONE .
        </button>
      </div>
      <div className="ml-5 h-[900px] w-2/5 bg-gray-100 -mt-20 -mr-7">
        <Map />
      </div>
    </div>
  )
}

export default CreateMinimi
