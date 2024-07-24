import useDeleteMinimiStore from '../../store/useDeleteMinimiStore'
import deleteIcon from '../../assets/img/delete_icon.png'

function DeleteButton() {
  const { isToggle, setToggle } = useDeleteMinimiStore()

  return (
    <button
      onClick={() => setToggle((state) => !state)}
      className={`flex border rounded-full drop-shadow-md p-2 fixed bottom-7 right-7 transition-all ${
        isToggle ? 'bg-black' : 'border-slate-50 bg-white'
      } hover:drop-shadow-sm`}
    >
      <img src={deleteIcon} alt="Delete" className="h-[25px]" />

      <p className={`mr-1 text-minimi-green font-medium ${isToggle ? 'block' : 'hidden'}`}>
        Delete 2
      </p>
    </button>
  )
}

export default DeleteButton
