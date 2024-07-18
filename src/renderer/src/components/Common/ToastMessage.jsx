import { useEffect } from 'react'
import useErrorStore from '../../store/useErrorStore'

function ToastMessage() {
  const { toastMessage, isToastVisible, setVisible } = useErrorStore()

  useEffect(() => {
    if (isToastVisible) {
      setTimeout(() => {
        setVisible(false)
      }, 2000)
    }
  }, [isToastVisible, setVisible])

  return (
    <div
      className={`fixed bottom-7 left-1/2 transform -translate-x-1/2 w-2/4 px-10 bg-black/75 text-minimi-green p-1 rounded shadow-lg ${isToastVisible ? 'opacity-100' : 'opacity-0'} transition-opacity`}
    >
      <p className="text-center">{toastMessage}</p>
    </div>
  )
}

export default ToastMessage
