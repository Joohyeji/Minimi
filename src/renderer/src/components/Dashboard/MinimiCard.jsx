import PropTypes from 'prop-types'
import { useEffect } from 'react'
import useMinimiStore from '../../store/useMinimiStore'
import useErrorStore from '../../store/useErrorStore'

function MinimiCard({ id, address, title, brightness, volume }) {
  const { prevClosestMinimi, setPrevClosestMinimi, closestMinimi } = useMinimiStore()
  const { setVisible, setToastMessage } = useErrorStore()

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

  useEffect(() => {
    const updateComputerSetting = async () => {
      if (brightness !== null) {
        await changeBrightness(brightness * 0.01)
      }
      if (volume !== null) {
        await changeVolume(volume)
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

  return (
    <article className="h-[230px] border border-slate-50 rounded-3xl relative shadow-lg hover:shadow-md cursor-pointer overflow-hidden p-5">
      {id === closestMinimi?.id && (
        <div className="w-full absolute left-0 top-0 bg-minimi-green h-[20px]"></div>
      )}
      <div className="flex flex-row-reverse mt-2 text-neutral-500 font-medium">
        <p>nickname</p>
      </div>
      <div className="absolute bottom-5">
        <p className="font-black text-lg">{title}</p>
        <p className="font-medium text-sm text-neutral-500">{address}</p>
      </div>
    </article>
  )
}

MinimiCard.propTypes = {
  id: PropTypes.string.isRequired,
  address: PropTypes.string,
  title: PropTypes.string,
  brightness: PropTypes.string,
  volume: PropTypes.string
}

export default MinimiCard
