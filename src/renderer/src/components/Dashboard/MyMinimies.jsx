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
    setLoading(true)
    try {
      const myMinimiesQuery = query(MINIMIES_COLLECTION, where('uid', '==', userId))
      const myMinimiesSnapshot = await getDocs(myMinimiesQuery)
      let myMinimiesData = myMinimiesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))

      if (searchQuery) {
        myMinimiesData = myMinimiesData.filter((minimi) =>
          minimi.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }

      setMinimiPosts(myMinimiesData)
      setVisibleItems(Array.from({ length: myMinimiesData.length + 1 }, (_, index) => index))
    } catch (error) {
      setToastMessage('Minimi 가져오기에 실패했습니다.')
      setVisible(true)
    } finally {
      setLoading(false)
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
          {minimiPosts.length > 0
            ? minimiPosts.map((minimi, index) => (
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
              ))
            : searchQuery && (
                <p className="absolute font-regular text-neutral-400 text-lg">
                  검색 결과가 없습니다.
                </p>
              )}
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
        </>
      )}
      <DeleteButton uid={user.uid} onFetch={() => fetchUserMinimies(user.uid)} />
    </div>
  )
}

export default MyMinimies
