import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import useMinimiStore from '../../store/useMinimiStore'
import useErrorStore from '../../store/useErrorStore'
import useDeleteMinimiStore from '../../store/useDeleteMinimiStore'
import updateComputerSetting from '../../utils/updateComputerSetting'
import checkIcon from '../../assets/img/check_icon.svg'

function MinimiCard({
  isOtherMinimi,
  user,
  id,
  address,
  title,
  brightness,
  volume,
  wallpaper,
  executables,
  bookmarks
}) {
  const navigate = useNavigate()

  const { prevClosestMinimi, setPrevClosestMinimi, closestMinimi } = useMinimiStore()
  const { setVisible, setToastMessage } = useErrorStore()
  const { isToggle, addSelectedId, removeSelectedId } = useDeleteMinimiStore()

  const [isSelected, setSelected] = useState(false)

  useEffect(() => {
    if (id === closestMinimi?.id) {
      if (closestMinimi?.id !== prevClosestMinimi?.id) {
        updateComputerSetting(brightness, volume, wallpaper, executables, bookmarks)
        setToastMessage(`${title} 세팅으로 적용되었습니다.`)
        setVisible(true)
      }
      setPrevClosestMinimi(closestMinimi)
    }
  }, [closestMinimi])

  const handleCardClick = () => {
    if (isOtherMinimi) {
      navigate(`/readminimi/${id}`)
      return
    }
    navigate(`/createminimi/${id}`)
  }

  const handleDeleteClick = async () => {
    if (!isSelected) {
      setSelected(true)
      addSelectedId(id)
    } else {
      setSelected(false)
      removeSelectedId(id)
    }
  }

  return (
    <div
      onClick={isToggle ? handleDeleteClick : handleCardClick}
      className={`${isToggle ? 'animate-wiggle' : ''}`}
    >
      {isToggle ? (
        <svg
          className="fill-red-500 absolute -top-3 z-10 w-6 cursor-pointer"
          width="30"
          height="30"
          viewBox="0 0 30 30"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15 1.5625C7.57875 1.5625 1.5625 7.57875 1.5625 15C1.5625 22.4212 7.57875 28.4375 15 28.4375C22.4212 28.4375 28.4375 22.4212 28.4375 15C28.4375 7.57875 22.4212 1.5625 15 1.5625ZM10 14.0625C9.75136 14.0625 9.5129 14.1613 9.33709 14.3371C9.16127 14.5129 9.0625 14.7514 9.0625 15C9.0625 15.2486 9.16127 15.4871 9.33709 15.6629C9.5129 15.8387 9.75136 15.9375 10 15.9375H20C20.2486 15.9375 20.4871 15.8387 20.6629 15.6629C20.8387 15.4871 20.9375 15.2486 20.9375 15C20.9375 14.7514 20.8387 14.5129 20.6629 14.3371C20.4871 14.1613 20.2486 14.0625 20 14.0625H10Z"
          />
        </svg>
      ) : null}
      <article
        style={{
          backgroundImage: wallpaper ? `url(${wallpaper})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat'
        }}
        className={`group flex flex-col justify-between h-[230px] rounded-3xl relative shadow-lg hover:shadow-md cursor-pointer overflow-hidden  ${isSelected ? 'shadow-md shadow-inner border border-red-500' : 'border border-slate-50 '}`}
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
    </div>
  )
}

MinimiCard.propTypes = {
  user: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  address: PropTypes.string,
  brightness: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  volume: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  wallpaper: PropTypes.string,
  executables: PropTypes.array,
  bookmarks: PropTypes.object,
  isOtherMinimi: PropTypes.bool
}

export default MinimiCard
