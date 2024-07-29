import { useEffect } from 'react'
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

  const { setErrorText, setVisible, setToastMessage, setIsModalOpen } = useErrorStore()
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

  const handleApplyBtnClick = async () => {
    /** APPLY버튼 클릭 시 미리보기 구현 */
    console.log('APPLY 눌림')
    setIsModalOpen(true)
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
          <SettingInput isOtherMinimi={true} />
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
        <Map isOtherMinimi={true} />
      </div>
    </div>
  )
}

export default ReadMinimiCard
