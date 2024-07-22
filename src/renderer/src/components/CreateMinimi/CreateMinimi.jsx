import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { MINIMIES_COLLECTION } from '../../firebase'
import { isWhitespace } from '../../utils/validation'

import useAuthStore from '../../store/useAuthStore'
import useErrorStore from '../../store/useErrorStore'
import useMinimiStore from '../../store/useMinimiStore'
import { uploadWallpaperToFirebase } from '../../hooks/useUpload'

import SettingInput from './SettingInput'
import SettingCard from './SettingCard'
import Map from './Map'
import prev_icon from '../../assets/img/previous_icon.png'

function CreateMinimi() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [isHovered, setIsHovered] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [existingMinimiData, setExistingMinimiData] = useState(null)

  const { user } = useAuthStore()
  const { setErrorText, setVisible, setToastMessage } = useErrorStore()
  const {
    markerPosition,
    placeName,
    minimiName,
    settingInputLists,
    settingCardLists,
    initSettingInputLists,
    initSettingCardLists,
    minimiBrightness,
    minimiVolume,
    wallpaper,
    resetMinimiData
  } = useMinimiStore()

  const handlePrevBtnClick = () => {
    navigate(-1)
  }

  const handleTooltip = () => {
    setIsHovered(true)
    setShowTooltip(true)
  }

  const handleDoneBtnClick = async () => {
    setErrorText('minimiName', '')

    if (isWhitespace(minimiName)) {
      setErrorText('minimiName', '공백만으로 이루어질 수 없습니다.')
      return
    }

    let wallpaperUrl = null

    if (wallpaper) {
      try {
        wallpaperUrl = await uploadWallpaperToFirebase(wallpaper)
      } catch (error) {
        setToastMessage(`이미지 업로드 중 오류가 발생했습니다: ${error}`)
        setVisible(true)
        return
      }
    }

    const minimiData = {
      uid: user.uid,
      user: user.displayName,
      title: minimiName,
      location: markerPosition,
      address: placeName,
      volume: minimiVolume,
      brightness: minimiBrightness,
      wallpaper: wallpaperUrl
    }

    try {
      if (id) {
        const minimiDocRef = doc(MINIMIES_COLLECTION, id)
        await setDoc(minimiDocRef, minimiData)
      } else {
        const newMinimi = doc(MINIMIES_COLLECTION)
        await setDoc(newMinimi, minimiData)
      }

      setToastMessage('성공적으로 저장되었습니다.')
      setVisible(true)

      navigate('/dashboard/myminimies')
    } catch (error) {
      setToastMessage(`저장 중 오류가 발생했습니다. ${error}`)
      setVisible(true)
    }
  }

  useEffect(() => {
    setErrorText('minimiName', '')

    if (!id) {
      initSettingInputLists()
      initSettingCardLists()
    } else {
      const fecthMinimiData = async () => {
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
      }
      fecthMinimiData()
    }

    return () => {
      resetMinimiData()
    }
  }, [id])

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
        <section className="mt-5 w-full flex flex-col gap-5 p-2 pb-5 overflow-auto h-[680px]">
          <SettingInput />
          {settingInputLists.map((setting, index) => (
            <SettingInput key={index} setting={setting} />
          ))}
          <div className="flex justify-center w-10/12 gap-8">
            {settingCardLists.map((cardText, index) => (
              <SettingCard key={index} cardText={cardText} />
            ))}
          </div>
        </section>
        <button
          onClick={handleDoneBtnClick}
          className="absolute bottom-7 w-[150px] bg-black text-white px-5 py-3 rounded-full text-lg font-bold hover:bg-neutral-700"
        >
          DONE .
        </button>
      </div>
      <div className="relative ml-5 w-2/5 h-[680px] bg-gray-100 -mt-[60px] -mr-7">
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

export default CreateMinimi
