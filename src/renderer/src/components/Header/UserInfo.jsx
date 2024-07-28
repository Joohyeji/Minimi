import PropTypes from 'prop-types'
import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../../firebase'

import useErrorStore from '../../store/useErrorStore'
import useAuthStore from '../../store/useAuthStore'
import useTimerStore from '../../store/useTimerStore'

import Map from '../CreateMinimi/Map'

function UserInfo({ userName }) {
  const navigate = useNavigate()

  const selectRef = useRef(null)
  const [isTimerToggle, setTimerToggle] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)

  const {
    setTimer,
    initTimer,
    isTimerRunning,
    setIsTimerRunning,
    isSettingToggle,
    setSettingToggle
  } = useTimerStore()
  const { setToastMessage, setVisible } = useErrorStore()
  const { clearUser } = useAuthStore()

  const handleSettingClick = () => {
    setSettingToggle()
  }

  const handleTimerClick = () => {
    setTimerToggle((state) => !state)

    if (!isTimerToggle) {
      const selectedValue = parseInt(selectRef.current.value, 10)

      setTimer(selectedValue)
      setTimeRemaining(selectedValue)
      setIsTimerRunning(true)
    } else {
      initTimer()
      setIsTimerRunning(false)
    }
  }

  useEffect(() => {
    let timerId

    if (isTimerRunning && timeRemaining > 0) {
      timerId = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1000) {
            setIsTimerRunning(false)
            setTimerToggle(false)
            initTimer()
            clearInterval(timerId)
            return 0
          }
          return prev - 1000
        })
      }, 1000)
    }

    return () => clearInterval(timerId)
  }, [isTimerRunning, timeRemaining])

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    return `${String(hours).padStart(2, '0')} h : ${String(minutes).padStart(2, '0')} m : ${String(seconds).padStart(2, '0')} sec`
  }

  const handleLogOutClick = async () => {
    try {
      await auth.signOut()
      clearUser()
      setToastMessage('로그아웃되었습니다.')
      setVisible(true)
      navigate('/')
    } catch (err) {
      setToastMessage('로그아웃 중 오류가 발생했습니다.')
      setVisible(true)
    }
  }

  return (
    <div className="flex justify-between items-center">
      <span className="text-xl mr-8">
        Hello, <b className="tracking-wider">{userName}</b>
      </span>
      <div className="flex items-center gap-5">
        <button onClick={handleSettingClick}>
          <svg
            className={`hover:fill-black hover:rotate-90 ${isSettingToggle ? 'fill-black rotate-90' : 'fill-neutral-500 '}`}
            width="25"
            height="25"
            viewBox="0 0 42 42"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M38.4587 22.375C38.1247 21.9948 37.9405 21.506 37.9405 21C37.9405 20.4939 38.1247 20.0052 38.4587 19.625L41.1254 16.625C41.4192 16.2972 41.6017 15.8848 41.6466 15.4469C41.6915 15.009 41.5965 14.5681 41.3754 14.1875L37.2087 6.97915C36.9897 6.59899 36.6564 6.29764 36.2561 6.11808C35.8558 5.93852 35.4091 5.8899 34.9795 5.97915L31.0629 6.77082C30.5645 6.87379 30.0457 6.79079 29.6043 6.53748C29.1629 6.28417 28.8295 5.87807 28.667 5.39582L27.3962 1.58332C27.2564 1.16952 26.9901 0.81012 26.635 0.555906C26.2798 0.301691 25.8538 0.165524 25.417 0.166652H17.0837C16.6294 0.142939 16.1798 0.268582 15.8036 0.524389C15.4274 0.780197 15.1453 1.15211 15.0004 1.58332L13.8337 5.39582C13.6712 5.87807 13.3378 6.28417 12.8964 6.53748C12.455 6.79079 11.9362 6.87379 11.4379 6.77082L7.41702 5.97915C7.00983 5.92161 6.59473 5.98586 6.22399 6.16382C5.85326 6.34177 5.54348 6.62546 5.33369 6.97915L1.16702 14.1875C0.94027 14.5638 0.838316 15.0022 0.875734 15.44C0.913152 15.8778 1.08802 16.2926 1.37535 16.625L4.02119 19.625C4.35518 20.0052 4.53938 20.4939 4.53938 21C4.53938 21.506 4.35518 21.9948 4.02119 22.375L1.37535 25.375C1.08802 25.7074 0.913152 26.1221 0.875734 26.5599C0.838316 26.9977 0.94027 27.4361 1.16702 27.8125L5.33369 35.0208C5.55264 35.401 5.88602 35.7023 6.2863 35.8819C6.68657 36.0615 7.13332 36.1101 7.56285 36.0208L11.4795 35.2292C11.9779 35.1262 12.4967 35.2092 12.9381 35.4625C13.3795 35.7158 13.7129 36.1219 13.8754 36.6041L15.1462 40.4166C15.2911 40.8479 15.5733 41.2198 15.9494 41.4756C16.3256 41.7314 16.7752 41.857 17.2295 41.8333H25.5629C25.9996 41.8344 26.4257 41.6983 26.7808 41.4441C27.136 41.1898 27.4023 40.8304 27.542 40.4166L28.8129 36.6041C28.9754 36.1219 29.3087 35.7158 29.7501 35.4625C30.1915 35.2092 30.7103 35.1262 31.2087 35.2292L35.1254 36.0208C35.5549 36.1101 36.0016 36.0615 36.4019 35.8819C36.8022 35.7023 37.1356 35.401 37.3545 35.0208L41.5212 27.8125C41.7424 27.4319 41.8373 26.991 41.7924 26.5531C41.7475 26.1152 41.565 25.7028 41.2712 25.375L38.4587 22.375ZM35.3545 25.1667L37.0212 27.0416L34.3545 31.6667L31.8962 31.1666C30.3957 30.8599 28.8349 31.1148 27.5099 31.8829C26.185 32.651 25.1882 33.8788 24.7087 35.3333L23.917 37.6667H18.5837L17.8337 35.2917C17.3542 33.8372 16.3574 32.6093 15.0324 31.8412C13.7075 31.0732 12.1466 30.8183 10.6462 31.125L8.18785 31.625L5.47952 27.0208L7.14619 25.1458C8.17109 23.9999 8.73771 22.5165 8.73771 20.9792C8.73771 19.4418 8.17109 17.9584 7.14619 16.8125L5.47952 14.9375L8.14619 10.3542L10.6045 10.8542C12.105 11.1609 13.6658 10.906 14.9908 10.1379C16.3157 9.36981 17.3125 8.14198 17.792 6.68748L18.5837 4.33332H23.917L24.7087 6.70832C25.1882 8.16282 26.185 9.39064 27.5099 10.1587C28.8349 10.9268 30.3957 11.1817 31.8962 10.875L34.3545 10.375L37.0212 15L35.3545 16.875C34.3411 18.0182 33.7815 19.4931 33.7815 21.0208C33.7815 22.5486 34.3411 24.0234 35.3545 25.1667ZM21.2504 12.6667C19.6022 12.6667 17.991 13.1554 16.6206 14.0711C15.2502 14.9867 14.1821 16.2882 13.5514 17.811C12.9206 19.3337 12.7556 21.0092 13.0771 22.6257C13.3987 24.2422 14.1924 25.7271 15.3578 26.8925C16.5232 28.058 18.0081 28.8517 19.6246 29.1732C21.2411 29.4947 22.9167 29.3297 24.4394 28.699C25.9621 28.0683 27.2636 27.0001 28.1793 25.6297C29.0949 24.2593 29.5837 22.6482 29.5837 21C29.5837 18.7898 28.7057 16.6702 27.1429 15.1074C25.5801 13.5446 23.4605 12.6667 21.2504 12.6667ZM21.2504 25.1667C20.4263 25.1667 19.6207 24.9223 18.9355 24.4644C18.2503 24.0066 17.7162 23.3559 17.4009 22.5945C17.0855 21.8331 17.003 20.9954 17.1637 20.1871C17.3245 19.3789 17.7214 18.6364 18.3041 18.0537C18.8868 17.471 19.6292 17.0742 20.4375 16.9134C21.2457 16.7526 22.0835 16.8351 22.8449 17.1505C23.6062 17.4659 24.257 17.9999 24.7148 18.6851C25.1726 19.3703 25.417 20.1759 25.417 21C25.417 22.1051 24.978 23.1649 24.1966 23.9463C23.4152 24.7277 22.3554 25.1667 21.2504 25.1667Z" />
          </svg>
        </button>
        <button onClick={handleLogOutClick}>
          <svg
            width="23"
            height="23"
            viewBox="0 0 35 35"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="fill-neutral-500 hover:fill-black"
          >
            <path d="M3.88889 35C2.81944 35 1.90426 34.6195 1.14333 33.8586C0.382407 33.0977 0.0012963 32.1819 0 31.1111V3.88889C0 2.81944 0.381111 1.90426 1.14333 1.14333C1.90556 0.382407 2.82074 0.0012963 3.88889 0H17.5V3.88889H3.88889V31.1111H17.5V35H3.88889ZM25.2778 27.2222L22.6042 24.4028L27.5625 19.4444H11.6667V15.5556H27.5625L22.6042 10.5972L25.2778 7.77778L35 17.5L25.2778 27.2222Z" />
          </svg>
        </button>
      </div>
      {isSettingToggle && (
        <div className="absolute w-[300px] bg-white h-[250px] border border-slate-50 top-14 right-10 rounded-md shadow-md overflow-hidden">
          <div className="flex justify-between items-center bg-black text-white px-3 py-2">
            <p>{isTimerToggle ? formatTime(timeRemaining) : '이 위치로 고정'}</p>
            <div className="flex gap-2">
              {!isTimerToggle && (
                <select className="cursor-pointer bg-black" ref={selectRef}>
                  <option value="10000">10 초</option>
                  <option value="600000">10 분</option>
                  <option value="1800000">30 분</option>
                  <option value="3600000">1 시간</option>
                  <option value="7200000">2 시간</option>
                  <option value="10800000">3 시간</option>
                </select>
              )}
              <button
                onClick={handleTimerClick}
                className={`rounded-full p-1 text-black hover:bg-minimi-green border border-white hover:border-minimi-green ${isTimerToggle ? 'bg-minimi-green border-minimi-green' : ''}`}
              >
                {isTimerToggle ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 50 50"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M31.25 6.25004H18.75V2.08337H31.25V6.25004ZM27.0833 39.5834C27.0833 41.7292 27.625 43.75 28.5625 45.4792C27.4167 45.7084 26.2292 45.8334 25 45.8334C20.0272 45.8334 15.2581 43.8579 11.7417 40.3416C8.22544 36.8253 6.25 32.0562 6.25 27.0834C6.25 22.1106 8.22544 17.3414 11.7417 13.8251C15.2581 10.3088 20.0272 8.33337 25 8.33337C29.4167 8.33337 33.4792 9.87504 36.7083 12.5L39.6667 9.50004C40.7292 10.4167 41.6667 11.375 42.6042 12.4375L39.6458 15.3959C42.3043 18.711 43.7521 22.834 43.75 27.0834V27.8125C42.4167 27.3542 41.0417 27.0834 39.5833 27.0834C32.6875 27.0834 27.0833 32.6875 27.0833 39.5834ZM27.0833 14.5834H22.9167V29.1667H27.0833V14.5834ZM46.9583 35.1667L44 32.2292L39.5833 36.6459L35.1667 32.2292L32.2292 35.1667L36.6458 39.5834L32.2292 44L35.1667 46.9584L39.5833 42.5209L44 46.9584L46.9583 44L42.5208 39.5834L46.9583 35.1667Z"
                      fill="black"
                    />
                  </svg>
                ) : (
                  <svg
                    className="fill-white hover:fill-black"
                    width="20"
                    height="20"
                    viewBox="0 0 50 50"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M31.25 6.25004H18.75V2.08337H31.25V6.25004ZM27.0833 32.2917C27.0833 36.4584 29.75 41.1042 32.125 44.4375C29.9375 45.3334 27.5208 45.8334 25 45.8334C20.0272 45.8334 15.2581 43.8579 11.7417 40.3416C8.22544 36.8253 6.25 32.0562 6.25 27.0834C6.25 22.1106 8.22544 17.3414 11.7417 13.8251C15.2581 10.3088 20.0272 8.33337 25 8.33337C29.4167 8.33337 33.4792 9.87504 36.7083 12.5L39.6667 9.50004C40.7292 10.4167 41.6667 11.375 42.6042 12.4375L39.6458 15.3959C41.125 17.25 42.2708 19.4167 42.9583 21.75C41.5631 21.1494 40.0607 20.8376 38.5417 20.8334C32.2917 20.8334 27.0833 26.0417 27.0833 32.2917ZM27.0833 29.1667V14.5834H22.9167V29.1667H27.0833ZM45.8333 32.2917C45.8333 37.7084 38.5417 45.8334 38.5417 45.8334C38.5417 45.8334 31.25 37.7084 31.25 32.2917C31.25 28.3334 34.5833 25 38.5417 25C42.5 25 45.8333 28.3334 45.8333 32.2917ZM41.0417 32.5C41.0417 31.25 39.7917 30 38.5417 30C37.2917 30 36.0417 31.0417 36.0417 32.5C36.0417 33.75 37.0833 35 38.5417 35C40 35 41.25 33.75 41.0417 32.5Z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div className="w-full h-full">
            <Map isSettingMap={true} />
          </div>
        </div>
      )}
    </div>
  )
}

UserInfo.propTypes = {
  userName: PropTypes.string
}

export default UserInfo
