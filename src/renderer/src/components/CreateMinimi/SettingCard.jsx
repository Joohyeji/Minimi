import PropTypes from 'prop-types'
import useMinimiStore from '../../store/useMinimiStore'

function SettingCard({ cardText }) {
  const { addSettingInputLists, removeFromSettingCardLists, setMinimiBrightness, setMinimiVolume } =
    useMinimiStore()

  const handleSettingCardClick = () => {
    removeFromSettingCardLists(cardText)
    addSettingInputLists(cardText)

    if (cardText === 'Brightness') {
      const getBrightness = async () => {
        const currentBrightness = await window.api.getBrightness()
        if (currentBrightness !== null) {
          setMinimiBrightness(currentBrightness * 100)
        }
      }
      getBrightness()
    }

    if (cardText === 'Volume') {
      const getVolume = async () => {
        const currentVolume = await window.api.getVolume()
        setMinimiVolume(currentVolume)
      }
      getVolume()
    }
  }
  return (
    <button
      onClick={handleSettingCardClick}
      className="bg-white drop-shadow-md border border-slate-50 rounded-3xl p-2 text-center text-neutral-900 font-medium text-md hover:shadow-inner hover:drop-shadow-sm"
    >
      <p>{cardText}</p>
    </button>
  )
}

SettingCard.propTypes = {
  cardText: PropTypes.string
}

export default SettingCard
