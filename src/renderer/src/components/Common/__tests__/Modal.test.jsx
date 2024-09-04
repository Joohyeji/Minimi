import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HashRouter as Router } from 'react-router-dom'
import Modal from '../Modal'
import useErrorStore from '../../../store/useErrorStore'
import useMinimiStore from '../../../store/useMinimiStore'
import updateComputerSetting from '../../../utils/updateComputerSetting'

vi.mock('../../../store/useErrorStore')
vi.mock('../../../store/useMinimiStore')
vi.mock('../../../utils/updateComputerSetting')
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: vi.fn()
  }
})

const Wrapper = ({ children }) => <Router>{children}</Router>

describe('Modal Component', () => {
  let setIsModalOpen,
    setCurrentComputerSetting,
    setPrevClosestMinimi,
    setClosestMinimi,
    updateComputerSettingMock,
    navigateMock

  beforeEach(() => {
    setIsModalOpen = vi.fn()
    setCurrentComputerSetting = vi.fn()
    setPrevClosestMinimi = vi.fn()
    setClosestMinimi = vi.fn()
    updateComputerSettingMock = vi.fn()
    navigateMock = vi.fn()

    vi.mocked(useErrorStore).mockReturnValue({
      isModalOpen: true,
      setIsModalOpen
    })

    vi.mocked(useMinimiStore).mockReturnValue({
      closestMinimi: null,
      currentComputerSetting: {
        brightness: 50,
        volume: 30,
        wallpaper: 'default'
      },
      setCurrentComputerSetting,
      setPrevClosestMinimi,
      setClosestMinimi,
      previewMinimi: {
        brightness: 60,
        volume: 40,
        wallpaper: 'preview'
      }
    })

    vi.mocked(updateComputerSetting).mockImplementation(updateComputerSettingMock)
    vi.mocked(navigateMock).mockReturnValue(navigateMock)
  })

  it('모달이 렌더링되었을 때 "이 Minimi로 설정하시겠습니까?" 문구와 버튼들이 보여야 합니다.', () => {
    render(<Modal />, { wrapper: Wrapper })

    expect(screen.getByText(/이 Minimi로 설정하시겠습니까?/i)).toBeInTheDocument()
    expect(screen.getByText(/No/i)).toBeInTheDocument()
    expect(screen.getByText(/Apply/i)).toBeInTheDocument()
  })

  it('No 버튼이 클릭되면 handleNoBtnClick이 올바르게 동작해야 합니다.', () => {
    render(<Modal />, { wrapper: Wrapper })

    fireEvent.click(screen.getByText(/No/i))

    expect(updateComputerSettingMock).toHaveBeenCalledWith(50, 30, 'default')
    expect(setCurrentComputerSetting).toHaveBeenCalledWith(null)
    expect(setIsModalOpen).toHaveBeenCalledWith(false)
  })
})
