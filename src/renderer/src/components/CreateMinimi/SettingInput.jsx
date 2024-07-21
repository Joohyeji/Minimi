import PropTypes from 'prop-types'
import { useEffect } from 'react'

import ErrorText from '../Common/ErrorText'
import useErrorStore from '../../store/useErrorStore'
import useMinimiStore from '../../store/useMinimiStore'

import x_icon from '../../assets/img/x_icon.png'

function SettingInput({ setting }) {
  const {
    setMinimiName,
    removeFromInputLists,
    addSettingCardLists,
    minimiBrightness,
    setMinimiBrightness,
    minimiVolume,
    setMinimiVolume
  } = useMinimiStore()
  const { errorText } = useErrorStore()

  const handleChangeInput = (e) => {
    const minimiName = e.target.value
    setMinimiName(minimiName)
  }

  const handleChangeVolume = (e) => {
    const minimiVolume = e.target.value
    setMinimiVolume(minimiVolume)
  }
  const handleChangeBrightness = (e) => {
    const minimiBrightness = e.target.value
    setMinimiBrightness(minimiBrightness)
  }

  const handleXBtnClick = () => {
    removeFromInputLists(setting)
    addSettingCardLists(setting)
  }

  useEffect(() => {
    const getBrightness = async () => {
      const currentBrightness = await window.api.getBrightness()
      if (currentBrightness !== null) {
        setMinimiBrightness(currentBrightness * 100)
      }
    }

    getBrightness()
  }, [])

  const renderInput = () => {
    switch (setting) {
      case 'Brightness':
        return (
          <>
            <input
              type="range"
              min="0"
              max="100"
              className="w-full h-1 mt-3 bg-black rounded-lg appearance-none cursor-pointer range-sm dark:bg-gray-700 range-thumb"
              onChange={handleChangeBrightness}
              value={minimiBrightness}
            />
            <p className="text-sm font-light ml-2 mt-1">{minimiBrightness}</p>
          </>
        )
      case 'Volume':
        return (
          <>
            <input
              type="range"
              min="0"
              max="100"
              className="w-full h-1 mt-3 bg-black rounded-lg appearance-none cursor-pointer range-sm dark:bg-gray-700 range-thumb"
              onChange={handleChangeVolume}
            />
            <p className="text-sm font-light ml-2 mt-1">{minimiVolume}</p>
          </>
        )
      case 'WallPaper':
        return (
          <input
            type="text"
            placeholder="Enter wallpaper URL"
            className="w-full border-b-2 outline-none font-bold focus:border-black"
            onChange={handleChangeInput}
          />
        )
      default:
        return (
          <input
            type="text"
            placeholder="Write this minimi's name"
            className="w-full border-b-2 outline-none font-bold focus:border-black"
            onChange={handleChangeInput}
          />
        )
    }
  }

  return (
    <div>
      <div className="flex items-center gap-10">
        <div className="flex flex-col justify-center w-10/12 bg-white drop-shadow-md border border-slate-50 rounded-full p-3 px-10 text-neutral-900 font-bold  text-2xl gap-5">
          <div className="flex">
            <span className="text-lg pr-3">{setting}</span>
            {renderInput()}
          </div>
          {!setting && <ErrorText message={errorText.minimiName} />}
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
