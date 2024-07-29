import { useEffect, useState } from 'react'
import { getDocs, query, where } from 'firebase/firestore'
import { MINIMIES_COLLECTION } from '../../firebase'
import useAuthStore from '../../store/useAuthStore'
import usePostsStore from '../../store/usePostsStore'
import useErrorStore from '../../store/useErrorStore'
import { RADIUS } from '../../constants/constants'

import MinimiCard from './MinimiCard'
import Loading from '../Common/Loading'

function ExploreMore() {
  const [visibleItems, setVisibleItems] = useState([])

  const { user, nowLocation } = useAuthStore()
  const { otherMinimiPosts, setOtherMinimiPosts, searchQuery } = usePostsStore()
  const { setVisible, setToastMessage, isLoading, setLoading } = useErrorStore()

  const haversineDistance = (coords1, coords2) => {
    const toRad = (x) => (x * Math.PI) / 180
    const R = 6371e3
    const lat1 = toRad(coords1.lat)
    const lat2 = toRad(coords2.lat)
    const deltaLat = toRad(coords2.lat - coords1.lat)
    const deltaLng = toRad(coords2.lng - coords1.lng)

    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c
  }

  const fetchOtherMinimies = async (userId) => {
    try {
      setLoading(true)

      const otherMinimiesQuery = query(MINIMIES_COLLECTION, where('uid', '!=', userId))
      const otherMinimies = await getDocs(otherMinimiesQuery)
      let otherMinimiesData = otherMinimies.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))

      if (searchQuery) {
        otherMinimiesData = otherMinimiesData.filter((minimi) =>
          minimi.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }

      const filteredMinimies = otherMinimiesData.filter((minimi) => {
        const minimiLocation = minimi.location
        if (!minimiLocation) return false
        const distance = haversineDistance(minimiLocation, nowLocation)
        return distance <= RADIUS
      })

      setOtherMinimiPosts(filteredMinimies)
      setLoading(false)

      const itemsToShow = [...filteredMinimies, 'create']
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
      fetchOtherMinimies(user.uid)
    }
  }, [user, nowLocation, searchQuery])

  return (
    <div className="relative mt-10 grid grid-cols-5 gap-12 gap-y-16 overflow-auto p-3 h-[564px]">
      {isLoading ? (
        <Loading />
      ) : otherMinimiPosts.length > 0 ? (
        otherMinimiPosts.map((minimi, index) => (
          <div
            key={minimi.id}
            className={`transform transition duration-500 ease-in-out ${
              visibleItems.includes(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
          >
            <MinimiCard {...minimi} isOtherMinimi={true} />
          </div>
        ))
      ) : (
        <p className="absolute font-regular text-neutral-400 text-lg">
          {searchQuery ? '검색 결과가 없습니다.' : '해당 위치에 Minimi가 존재하지 않습니다.'}
        </p>
      )}
    </div>
  )
}

export default ExploreMore
