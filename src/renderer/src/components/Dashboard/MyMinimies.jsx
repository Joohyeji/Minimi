import MinimiCard from './MinimiCard'

function MyMinimies() {
  return (
    <div className="mt-10 grid grid-cols-5 gap-12 gap-y-16 overflow-auto py-5 h-[564px]">
      <MinimiCard />
      <MinimiCard />
    </div>
  )
}

export default MyMinimies
