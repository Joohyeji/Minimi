import { useEffect } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { auth } from '../../firebase'
import useGeoLocation from '../../hooks/useGeolocation'

import Loading from '../Common/Loading'
import useAuthStore from '../../store/useAuthStore'
import usePostsStore from '../../store/usePostsStore'
import useMinimiStore from '../../store/useMinimiStore'
import useReadMinimiStore from '../../store/useReadMinimiStore'

import { RADIUS } from '../../constants/constants'
import deleteIcon from '../../assets/img/delete_icon.png'

function Dashbaord() {
  const { user, setUser, nowLocation } = useAuthStore()
  const { minimiPosts } = usePostsStore()
  const { setClosestMinimi } = useMinimiStore()
  const { setExecuteOptions } = useReadMinimiStore()
  const navigate = useNavigate()

  useGeoLocation()

  const getDistanceFromLatLonInMeters = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3
    const dLat = (lat2 - lat1) * (Math.PI / 180)
    const dLon = (lon2 - lon1) * (Math.PI / 180)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c
    return distance
  }

  useEffect(() => {
    if (minimiPosts.length > 0) {
      const { lat, lng } = nowLocation

      const nearbyMinimies = minimiPosts
        .map((minimi) => ({
          ...minimi,
          distance: getDistanceFromLatLonInMeters(
            lat,
            lng,
            minimi.location.lat,
            minimi.location.lng
          )
        }))
        .filter((minimi) => minimi.distance <= RADIUS)

      const closestMinimi = nearbyMinimies.reduce((closest, minimi) => {
        if (!closest || minimi.distance < closest.distance) {
          return minimi
        }
        return closest
      }, null)

      setClosestMinimi(closestMinimi)
    }
  }, [minimiPosts, nowLocation])

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser)
      } else {
        setUser(null)
        navigate('/signin')
      }
    })

    return () => unsubscribe()
  }, [setUser])

  useEffect(() => {
    const fetchExecutables = async () => {
      const executables = await window.api.getExecutables()
      setExecuteOptions(executables)
    }

    fetchExecutables()
  }, [])

  if (!user) {
    return <Loading />
  }

  return (
    <>
      <h1 className="text-4xl font-bold -mt-5">Dashboard</h1>
      <nav className="flex w-full gap-20 mt-5">
        <NavLink
          to="myminimies"
          className={({ isActive }) =>
            isActive
              ? 'text-lg font-bold text-black underline'
              : 'text-lg font-bold text-neutral-500'
          }
        >
          My Minimies
        </NavLink>
        <NavLink
          to="explore"
          className={({ isActive }) =>
            isActive
              ? 'text-lg font-bold text-black underline'
              : 'text-lg font-bold text-neutral-500'
          }
        >
          Explore more
        </NavLink>
      </nav>
      <section className="mt-5">
        <Outlet />
        <button className="border border-slate-50 rounded-full shadow-md hover:drop-shadow-md p-2 w-12 fixed bottom-7 right-7 hover:bg-white">
          <img src={deleteIcon} />
        </button>
      </section>
    </>
  )
}

export default Dashbaord
