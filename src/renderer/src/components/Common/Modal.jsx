import useErrorStore from '../../store/useErrorStore'

const Modal = () => {
  const { isModalOpen, setIsModalOpen } = useErrorStore()

  const handleNoBtnClick = () => {
    setIsModalOpen(false)
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
              <button className="mt-4 bg-black text-white px-4 py-2 rounded-md hover:bg-neutral-700">
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
