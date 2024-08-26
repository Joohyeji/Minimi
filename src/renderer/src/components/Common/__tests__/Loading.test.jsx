import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, it, expect } from 'vitest'
import Loading from '../Loading'

describe('Loading Component', () => {
  it('로딩 화면을 렌더링합니다.', () => {
    render(<Loading />)

    const loadingSpinner = screen.getByTestId('loading-spinner')
    expect(loadingSpinner).toBeInTheDocument()

    const svgElement = screen.getByTestId('loading-spinner').querySelector('svg')
    expect(svgElement).toBeInTheDocument()
  })

  it('SVG요소가 올바른 클래스 이름을 적용합니다', () => {
    render(<Loading />)
    const svgElement = screen.getByTestId('loading-spinner').querySelector('svg')
    expect(svgElement).toHaveClass('w-12 h-12 text-gray-300 animate-spin')
  })
})
