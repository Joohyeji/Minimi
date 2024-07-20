import PropTypes from 'prop-types'

import ErrorText from '../Common/ErrorText'
import useErrorStore from '../../store/useErrorStore'
import useMinimiStore from '../../store/useMinimiStore'

import x_icon from '../../assets/img/x_icon.png'

function SettingInput({ setting }) {
  const { setMinimiName, removeFromInputLists, addSettingCardLists } = useMinimiStore()
  const { errorText } = useErrorStore()

  const handleChangeInput = (e) => {
    const minimiName = e.target.value
    setMinimiName(minimiName)
  }

  const handleXBtnClick = () => {
    removeFromInputLists(setting)
    addSettingCardLists(setting)
  }

  return (
    <div>
      <div className="flex items-center gap-10">
        <div className="flex flex-col w-10/12 bg-white drop-shadow-md border border-slate-50 rounded-full p-3 px-10 text-neutral-900 font-bold  text-2xl gap-5">
          <div className="flex">
            <span className="pr-3">{setting}</span>
            <input
              onChange={handleChangeInput}
              type="text"
              placeholder="Write this minimi's name"
              className="w-full border-b-2 outline-none font-bold  focus:border-black"
            />
          </div>
          <ErrorText message={errorText.minimiName} />
        </div>
        <button onClick={handleXBtnClick} className="h-10 hover:rotate-90">
          {setting ? <img src={x_icon} alt="x-button" className="h-full" /> : null}
        </button>
      </div>
    </div>
  )
}

SettingInput.propTypes = {
  setting: PropTypes.string
}

export default SettingInput
