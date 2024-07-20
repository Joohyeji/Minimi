import PropTypes from 'prop-types'
import useMinimiStore from '../../store/useMinimiStore'

function SettingCard({ cardText }) {
  const { addSettingInputLists, removeFromSettingCardLists } = useMinimiStore()

  const handleSettingCardClick = () => {
    removeFromSettingCardLists(cardText)
    addSettingInputLists(cardText)
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
