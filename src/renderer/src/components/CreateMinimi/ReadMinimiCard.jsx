import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { MINIMIES_COLLECTION } from '../../firebase'
import useReadMinimi from '../../hooks/useReadMinimi'

import useErrorStore from '../../store/useErrorStore'
import useMinimiStore from '../../store/useMinimiStore'
import useReadMinimiStore from '../../store/useReadMinimiStore'

import SettingInput from './SettingInput'
import Map from './Map'
import prev_icon from '../../assets/img/previous_icon.png'
import { SETTING_CARD_LISTS } from '../../constants/constants'

function ReadMinimiCard() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [isHovered, setIsHovered] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  const { setErrorText, setVisible, setToastMessage } = useErrorStore()
  const { existingMinimiData, setExistingMinimiData } = useReadMinimiStore()
  const {
    settingInputLists,
    settingCardLists,
    addSettingInputLists,
    initSettingInputLists,
    initSettingCardLists,
    removeFromSettingCardLists,
    resetMinimiData
  } = useMinimiStore()

  useReadMinimi()

  const handlePrevBtnClick = () => {
    navigate(-1)
    initSettingInputLists()
    initSettingCardLists()
    setExistingMinimiData(null)
  }

  const handleTooltip = () => {
    setIsHovered(true)
    setShowTooltip(true)
  }

  const handleApplyBtnClick = async () => {
    /** APPLY버튼 클릭 시 미리보기 구현 */
  }

  useEffect(() => {
    setErrorText('minimiName', '')

    const fetchMinimiData = async () => {
      if (id) {
        try {
          const minimiDocRef = doc(MINIMIES_COLLECTION, id)
          const minimiDoc = await getDoc(minimiDocRef)

          if (minimiDoc.exists()) {
            setExistingMinimiData(minimiDoc.data())
          } else {
            setToastMessage('해당 Minimi가 존재하지 않습니다.')
            setVisible(true)
          }
        } catch (error) {
          setToastMessage(`Minimi 데이터를 가져오는 중 오류가 발생했습니다: ${error}`)
          setVisible(true)
        }
      } else {
        initSettingInputLists()
        initSettingCardLists()
      }
    }

    fetchMinimiData()

    return () => {
      resetMinimiData()
    }
  }, [
    id,
    initSettingInputLists,
    initSettingCardLists,
    resetMinimiData,
    setErrorText,
    setToastMessage,
    setVisible
  ])

  if (id && existingMinimiData) {
    const nonNullKeys = Object.keys(existingMinimiData)
      .filter((key) => {
        const displayKey =
          key === 'executables' ? 'Auto Run' : key.charAt(0).toUpperCase() + key.slice(1)

        if (existingMinimiData[key] === null) {
          return false
        }

        if (key === 'bookmarks') {
          const { bookmarks, selected } = existingMinimiData[key]
          if (!bookmarks || bookmarks.length === 0 || !selected) {
            return false
          }
        }

        return SETTING_CARD_LISTS.includes(displayKey)
      })
      .map((key) => {
        return key === 'executables' ? 'Auto Run' : key.charAt(0).toUpperCase() + key.slice(1)
      })

    nonNullKeys.forEach((key) => {
      if (!settingInputLists.includes(key)) {
        addSettingInputLists(key)
      }
    })
  }

  useEffect(() => {
    settingCardLists.forEach((card) => {
      const displayCard = card === 'executables' ? 'Auto Run' : card

      if (settingInputLists.includes(displayCard)) {
        removeFromSettingCardLists(displayCard)
      }
    })
  }, [settingCardLists, settingInputLists])

  useEffect(() => {
    let timer
    if (isHovered) {
      timer = setTimeout(() => {
        setShowTooltip(false)
        setIsHovered(false)
      }, 3000)
    } else {
      setShowTooltip(false)
    }
    return () => clearTimeout(timer)
  }, [isHovered])

  return (
    <div className="flex">
      <div className="w-3/5">
        <div className="flex items-center -mt-5 relative">
          <button onClick={handlePrevBtnClick} className="relative hover:translate-x-[-10px]">
            <img src={prev_icon} alt="Previous Icon" />
          </button>
          <h1 className="ml-6 text-4xl font-bold">Make new Minimi</h1>
        </div>
        <section className="mt-5 w-full flex flex-col gap-5 p-2 pb-5 overflow-auto h-3/4">
          <SettingInput />
          {settingInputLists.map((setting, index) => (
            <SettingInput key={index} setting={setting} params={id} isOtherMinimi={true} />
          ))}
        </section>
        <button
          onClick={handleApplyBtnClick}
          className="absolute bottom-7 w-[150px] bg-black text-white px-5 py-3 rounded-full text-lg font-bold hover:bg-neutral-700"
        >
          APPLY.
        </button>
      </div>
      <div className="relative ml-5 w-2/5 h-[680px] bg-gray-100 -mt-[40px] -mr-7">
        <button
          onMouseEnter={handleTooltip}
          onMouseLeave={() => setIsHovered(false)}
          className="absolute right-4 top-4 z-10 px-2 text-sm font-light bg-black/50 rounded-full text-white flex items-center justify-center hover:bg-black"
        >
          현재 위치가 아닌가요?
        </button>
        <div
          className={`absolute right-4 top-10 mb-2 bg-gray-800 text-white text-center text-sm font-regular rounded py-1 px-2 z-20 transition-opacity duration-300 ${
            showTooltip ? 'opacity-100' : 'opacity-0'
          }`}
        >
          맵을 클릭해 현재 위치를 바꿀 수 있습니다.
        </div>
        <Map />
      </div>
    </div>
  )
}

export default ReadMinimiCard
