import { Link } from 'react-router-dom'

function CreateMinimiCard() {
  return (
    <Link
      to="/createminimi"
      className="h-[230px] border border-slate-50 rounded-3xl relative shadow-lg hover:shadow-md cursor-pointer overflow-hidden p-5 flex items-center justify-center  hover:bg-neutral-900 text-neutral-500 hover:text-minimi-green"
    >
      <p className="font-bold text-5xl">+</p>
    </Link>
  )
}

export default CreateMinimiCard
