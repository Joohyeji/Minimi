import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'

import useErrorStore from '../../store/useErrorStore'
import useMinimiStore from '../../store/useMinimiStore'

import ErrorText from '../Common/ErrorText'
import MultiSelectDropdown from '../Common/MultiSelectDropdown'
import x_icon from '../../assets/img/x_icon.png'

function SettingInput({ setting }) {
  const {
    minimiName,
    setMinimiName,
    removeFromInputLists,
    addSettingCardLists,
    minimiBrightness,
    setMinimiBrightness,
    minimiVolume,
    setMinimiVolume,
    wallpaper,
    setWallpaper,
    setExecutables
  } = useMinimiStore()
  const { errorText } = useErrorStore()

  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleInputChange = (e) => {
    setMinimiName(e.target.value)
  }

  const handleBrightnessChange = (e) => {
    setMinimiBrightness(e.target.value)
  }

  const handleVolumeChange = (e) => {
    setMinimiVolume(e.target.value)
  }

  const handleWallpaperChange = (e) => {
    setWallpaper(e.target.files[0])
  }

  const handleXBtnClick = () => {
    removeFromInputLists(setting)
    addSettingCardLists(setting)

    if (setting === 'Brightness') {
      setMinimiBrightness(null)
    }

    if (setting === 'Volume') {
      setMinimiVolume(null)
    }

    if (setting === 'Wallpaper') {
      setWallpaper(null)
    }

    if (setting === 'Auto Run') {
      setExecutables(null)
    }
  }

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
              onChange={handleBrightnessChange}
              value={minimiBrightness || 50}
            />
            <p className="text-sm font-light mr-2 mt-1">{minimiBrightness}</p>
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
              onChange={handleVolumeChange}
              value={minimiVolume || 50}
            />
            <p className="text-sm font-light mr-2 mt-1">{minimiVolume}</p>
          </>
        )
      case 'Wallpaper':
        return (
          <div className="w-full flex flex-col">
            <div className="flex w-full justify-between relative">
              <p className="text-sm font-medium leading-7 text-neutral-500 underline decoration-solid max-w-[300px] truncate">
                {wallpaper ? wallpaper.name || wallpaper : null}
              </p>
              <label
                htmlFor="inputFile"
                className="block text-base font-medium leading-7 border rounded bg-black text-white px-2 cursor-pointer hover:bg-neutral-700 truncate w-[145px]"
              >
                Choose Wallpaper
              </label>
              <input
                id="inputFile"
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                className="hidden"
                onChange={handleWallpaperChange}
              />
            </div>
          </div>
        )
      case 'Auto Run':
        return <MultiSelectDropdown />
      default:
        return (
          <input
            type="text"
            placeholder="Write this minimi's name"
            value={minimiName || ''}
            className="w-full border-b-2 outline-none font-bold focus:border-black"
            onChange={handleInputChange}
          />
        )
    }
  }

  return (
    <div
      className={`transition-opacity duration-500 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="flex items-center gap-10">
        <div className="flex flex-col justify-center w-10/12 bg-white drop-shadow-md border border-slate-50 rounded-lg p-3 px-10 text-neutral-900 font-bold text-2xl gap-5">
          <div className="flex justify-between">
            {setting && <span className="text-lg w-[150px]">{setting}</span>}
            <div className="flex flex-row-reverse w-full">{renderInput()}</div>
          </div>
          {!setting && <ErrorText message={errorText.minimiName} />}
        </div>
        <button onClick={handleXBtnClick} className="right-20 top-2 h-full hover:rotate-90">
          {setting ? <img src={x_icon} alt="x-button" className="w-[30px]" /> : null}
        </button>
      </div>
    </div>
  )
}

SettingInput.propTypes = {
  setting: PropTypes.string
}

export default SettingInput
