import PropTypes from 'prop-types'
import { doc, deleteDoc } from 'firebase/firestore'
import { MINIMIES_COLLECTION } from '../../firebase'

import useDeleteMinimiStore from '../../store/useDeleteMinimiStore'
import useErrorStore from '../../store/useErrorStore'

function DeleteButton({ uid, onFetch }) {
  const { isToggle, setToggle, selectedIds, clearSelectedIds } = useDeleteMinimiStore()
  const { setVisible, setToastMessage } = useErrorStore()

  const deleteButtonClick = async () => {
    setToggle()
    clearSelectedIds()

    if (selectedIds.length > 0) {
      try {
        const deletePromises = selectedIds.map((id) => deleteDoc(doc(MINIMIES_COLLECTION, id)))

        await Promise.all(deletePromises)

        setToastMessage('Minimi들이 성공적으로 삭제되었습니다.')
        setVisible(true)

        onFetch(uid)
      } catch (error) {
        setToastMessage('Minimi 삭제 중 오류가 발생했습니다.')
        setVisible(true)
      }
    }
  }

  return (
    <button
      onClick={deleteButtonClick}
      className={`flex items-center border rounded-full drop-shadow-md p-2 fixed bottom-7 right-7 transition-all ${
        isToggle ? 'bg-black shadow-inner' : 'border-slate-50 bg-white'
      } hover:drop-shadow-sm`}
      data-testid="delete-button"
    >
      <svg
        className={`h-[35px] ${isToggle ? 'fill-white' : 'fill-black'}`}
        width="50"
        height="50"
        viewBox="0 0 50 50"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M7.8125 12.5H4.6875C4.2731 12.5 3.87567 12.3353 3.58265 12.0423C3.28962 11.7493 3.125 11.3519 3.125 10.9375C3.125 10.5231 3.28962 10.1256 3.58265 9.8326C3.87567 9.53957 4.2731 9.37495 4.6875 9.37495H17.1875V4.68433C17.1875 4.26993 17.3521 3.8725 17.6451 3.57947C17.9382 3.28645 18.3356 3.12183 18.75 3.12183H31.25C31.6644 3.12183 32.0618 3.28645 32.3549 3.57947C32.6479 3.8725 32.8125 4.26993 32.8125 4.68433V9.37495H45.3125C45.7269 9.37495 46.1243 9.53957 46.4174 9.8326C46.7104 10.1256 46.875 10.5231 46.875 10.9375C46.875 11.3519 46.7104 11.7493 46.4174 12.0423C46.1243 12.3353 45.7269 12.5 45.3125 12.5H42.1875V45.3125C42.1875 45.7269 42.0229 46.1243 41.7299 46.4173C41.4368 46.7103 41.0394 46.875 40.625 46.875H9.375C8.9606 46.875 8.56317 46.7103 8.27015 46.4173C7.97712 46.1243 7.8125 45.7269 7.8125 45.3125V12.5ZM29.6875 9.37495V6.24995H20.3125V9.37495H29.6875ZM10.9375 43.75H39.0625V12.5H10.9375V43.75ZM20.3125 37.5C19.8981 37.5 19.5007 37.3353 19.2076 37.0423C18.9146 36.7493 18.75 36.3519 18.75 35.9375V20.3125C18.75 19.8981 18.9146 19.5006 19.2076 19.2076C19.5007 18.9146 19.8981 18.75 20.3125 18.75C20.7269 18.75 21.1243 18.9146 21.4174 19.2076C21.7104 19.5006 21.875 19.8981 21.875 20.3125V35.9375C21.875 36.3519 21.7104 36.7493 21.4174 37.0423C21.1243 37.3353 20.7269 37.5 20.3125 37.5ZM29.6875 37.5C29.2731 37.5 28.8757 37.3353 28.5826 37.0423C28.2896 36.7493 28.125 36.3519 28.125 35.9375V20.3125C28.125 19.8981 28.2896 19.5006 28.5826 19.2076C28.8757 18.9146 29.2731 18.75 29.6875 18.75C30.1019 18.75 30.4993 18.9146 30.7924 19.2076C31.0854 19.5006 31.25 19.8981 31.25 20.3125V35.9375C31.25 36.3519 31.0854 36.7493 30.7924 37.0423C30.4993 37.3353 30.1019 37.5 29.6875 37.5Z" />
      </svg>
      {isToggle && selectedIds.length > 0 ? (
        <p className="mr-2 text-red-500">Delete {`${selectedIds.length} Minimies`}</p>
      ) : null}
    </button>
  )
}

DeleteButton.propTypes = {
  uid: PropTypes.string,
  onFetch: PropTypes.func
}

export default DeleteButton
