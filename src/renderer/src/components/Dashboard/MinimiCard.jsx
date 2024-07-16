function MinimiCard() {
  return (
    <article className="h-[230px] border border-slate-50 rounded-3xl relative shadow-lg hover:shadow-md cursor-pointer overflow-hidden p-5">
      <div className="w-full absolute left-0 top-0 bg-minimi-green h-[20px]"></div>
      <div className="absolute bottom-5">
        <p className="font-black text-lg">Title</p>
        <p className="font-medium text-sm text-neutral-500">latitute, latitute</p>
      </div>
    </article>
  )
}

export default MinimiCard
