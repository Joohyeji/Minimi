import MinimiCard from './MinimiCard'
import CreateMinimiCard from './CreateMinimiCard'

function MyMinimies() {
  return (
    <div className="mt-10 grid grid-cols-5 gap-12 gap-y-16 overflow-auto py-5 h-[564px]">
      <MinimiCard />
      <MinimiCard />
      <MinimiCard />
      <CreateMinimiCard />
    </div>
  )
}

export default MyMinimies
