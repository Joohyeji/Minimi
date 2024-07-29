import { useEffect, useState } from 'react'
import { getDocs, query, where } from 'firebase/firestore'
import { MINIMIES_COLLECTION } from '../../firebase'
import useAuthStore from '../../store/useAuthStore'
import usePostsStore from '../../store/usePostsStore'
import useErrorStore from '../../store/useErrorStore'

import MinimiCard from './MinimiCard'
import CreateMinimiCard from './CreateMinimiCard'
import Loading from '../Common/Loading'
import DeleteButton from '../Common/DeleteButton'

function MyMinimies() {
  const [visibleItems, setVisibleItems] = useState([])
  const { user } = useAuthStore()
  const { minimiPosts, setMinimiPosts, searchQuery } = usePostsStore()
  const { setVisible, setToastMessage, isLoading, setLoading } = useErrorStore()

  const fetchUserMinimies = async (userId) => {
    try {
      setLoading(true)

      const myMinimiesQuery = query(MINIMIES_COLLECTION, where('uid', '==', userId))

      const myMinimies = await getDocs(myMinimiesQuery)
      let myMinimiesData = myMinimies.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))

      if (searchQuery) {
        myMinimiesData = myMinimiesData.filter((minimi) =>
          minimi.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }

      setMinimiPosts(myMinimiesData)
      setLoading(false)

      const itemsToShow = [...myMinimiesData, 'create']
      itemsToShow.forEach((_, index) => {
        setTimeout(() => {
          setVisibleItems((prev) => [...prev, index])
        }, index * 100)
      })
    } catch (error) {
      setToastMessage('Minimi 가져오기에 실패했습니다.')
      setVisible(true)
    }
  }

  useEffect(() => {
    if (user?.uid) {
      fetchUserMinimies(user.uid)
    }
  }, [user, searchQuery])

  return (
    <div className="mt-10 grid grid-cols-5 gap-12 gap-y-16 overflow-auto p-3 h-[564px]">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {minimiPosts.map((minimi, index) => (
            <div
              key={minimi.id}
              className={`transform transition duration-500 ease-in-out ${
                visibleItems.includes(index)
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-5'
              }`}
            >
              <MinimiCard {...minimi} />
            </div>
          ))}
          {!searchQuery && (
            <div
              key="create"
              className={`transform transition duration-500 ease-in-out ${
                visibleItems.includes(minimiPosts.length)
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-5'
              }`}
            >
              <CreateMinimiCard />
            </div>
          )}
          {searchQuery && minimiPosts.length == 0 ? (
            <p className="absolute font-regular text-neutral-400 text-lg">
              {searchQuery ? '검색 결과가 없습니다.' : '해당 위치에 Minimi가 존재하지 않습니다.'}
            </p>
          ) : null}
        </>
      )}
      <DeleteButton uid={user.uid} onFetch={fetchUserMinimies} />
    </div>
  )
}

export default MyMinimies
