import { useNavigate } from 'react-router-dom'
import useErrorStore from '../../store/useErrorStore'
import useMinimiStore from '../../store/useMinimiStore'
import updateComputerSetting from '../../utils/updateComputerSetting'

const Modal = () => {
  const navigate = useNavigate()

  const { isModalOpen, setIsModalOpen } = useErrorStore()
  const {
    closestMinimi,
    currentComputerSetting,
    setCurrentComputerSetting,
    setPrevClosestMinimi,
    setClosestMinimi,
    previewMinimi
  } = useMinimiStore()

  const handleNoBtnClick = () => {
    if (closestMinimi) {
      const { brightness, volume, wallpaper, executables, bookmarks } = closestMinimi
      updateComputerSetting(brightness, volume, wallpaper, executables, bookmarks)
    } else {
      const { brightness, volume, wallpaper } = currentComputerSetting

      updateComputerSetting(brightness, volume, wallpaper)
    }
    setCurrentComputerSetting(null)

    setIsModalOpen(false)
  }

  const handleApplyBtnClick = () => {
    setPrevClosestMinimi(previewMinimi)
    setClosestMinimi(previewMinimi)
    setIsModalOpen(false)
    navigate('/dashboard/explore')
  }

  return (
    <div className="relative">
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <p>이 Minimi로 설정하시겠습니까?</p>
            <div className="flex w-full justify-end gap-5">
              <button
                onClick={handleNoBtnClick}
                className="mt-4 bg-white text-red-500 px-4 py-2 rounded-md hover:bg-gray-100"
              >
                No
              </button>
              <button
                onClick={handleApplyBtnClick}
                className="mt-4 bg-black text-white px-4 py-2 rounded-md hover:bg-neutral-700"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Modal
