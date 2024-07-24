import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useMinimiStore from '../../store/useMinimiStore'
import useErrorStore from '../../store/useErrorStore'
import useDeleteMinimiStore from '../../store/useDeleteMinimiStore'

import checkIcon from '../../assets/img/check_icon.svg'

function MinimiCard({ user, id, address, title, brightness, volume, wallpaper, executables }) {
  const navigate = useNavigate()

  const { prevClosestMinimi, setPrevClosestMinimi, closestMinimi } = useMinimiStore()
  const { setVisible, setToastMessage } = useErrorStore()
  const { isToggle } = useDeleteMinimiStore()

  const changeBrightness = async (level) => {
    await window.api.setBrightness(level)
  }

  const changeVolume = async (level) => {
    if (level === 0) {
      await window.api.setMuted(true)
    } else {
      await window.api.setMuted(false)
    }
    await window.api.setVolume(level)
  }

  const setWallpaper = async (imageUrl) => {
    await window.api.setWallpaper(imageUrl)
  }

  const runExecutables = async (paths) => {
    await window.api.runExecutables(paths)
  }

  useEffect(() => {
    const updateComputerSetting = async () => {
      if (brightness !== null) {
        await changeBrightness(brightness * 0.01)
      }
      if (volume !== null) {
        await changeVolume(volume)
      }
      if (wallpaper !== null) {
        await setWallpaper(wallpaper)
      }
      if (executables !== null) {
        await runExecutables(executables)
      }
    }

    if (id === closestMinimi?.id) {
      if (closestMinimi?.id !== prevClosestMinimi?.id) {
        updateComputerSetting()
        setToastMessage(`${title} 세팅으로 적용되었습니다.`)
        setVisible(true)
      }
      setPrevClosestMinimi(closestMinimi)
    }
  }, [closestMinimi])

  const handleCardClick = () => {
    if (isToggle) {
      return
    }
    navigate(`/createminimi/${id}`)
  }

  return (
    <article
      onClick={handleCardClick}
      style={{
        backgroundImage: wallpaper ? `url(${wallpaper})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat'
      }}
      className="group flex flex-col justify-between h-[230px] border border-slate-50 rounded-3xl relative shadow-lg hover:shadow-md cursor-pointer overflow-hidden"
    >
      <div className="flex flex-row-reverse mt-2 text-neutral-500 font-medium px-5">
        {id === closestMinimi?.id && (
          <div className="w-10">
            <img src={checkIcon} />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1 bg-white/90 p-5 relative group-hover:bg-white max-h-[170px]">
        <div className="flex justify-between">
          <p className="font-black text-lg truncate">{title}</p>
        </div>
        <p className="font-semibold text-md">{user}</p>
        <p className="font-medium text-sm text-neutral-500 line-clamp-2">{address}</p>
      </div>
    </article>
  )
}

MinimiCard.propTypes = {
  user: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  address: PropTypes.string,
  brightness: PropTypes.string,
  volume: PropTypes.string,
  wallpaper: PropTypes.string,
  executables: PropTypes.array
}

export default MinimiCard
