import { useEffect } from 'react'
import { getDocs, collection } from 'firebase/firestore'
import { db } from '../../firebase'
import useAuthStore from '../../store/useAuthStore'
import usePostsStore from '../../store/usePostsStore'
import useErrorStore from '../../store/useErrorStore'

import MinimiCard from './MinimiCard'
import CreateMinimiCard from './CreateMinimiCard'

function MyMinimies() {
  const { user } = useAuthStore()
  const { minimiPosts, setMinimiPosts } = usePostsStore()
  const { isToastVisible, setToastMessage } = useErrorStore()

  const fetchUserMinimies = async (userId) => {
    try {
      const myMinimiesRef = collection(db, 'users', userId, 'minimies')
      const myMinimies = await getDocs(myMinimiesRef)
      const myMinimiesData = myMinimies.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))

      setMinimiPosts(myMinimiesData)
    } catch (error) {
      setToastMessage('Minimi 가져오기에 실패했습니다.')
      isToastVisible(true)
    }
  }

  useEffect(() => {
    fetchUserMinimies(user.uid)
  }, [])

  return (
    <div className="mt-10 grid grid-cols-5 gap-12 gap-y-16 overflow-auto py-5 h-[564px]">
      {minimiPosts.map((minimi) => (
        <MinimiCard key={minimi.id} {...minimi} />
      ))}
      <CreateMinimiCard />
    </div>
  )
}

export default MyMinimies
