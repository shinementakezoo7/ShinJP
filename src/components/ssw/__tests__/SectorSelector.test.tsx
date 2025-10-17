import React from 'react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@/test-utils'
import SectorSelector from '../SectorSelector'
import { SSW_SECTORS } from '@/lib/ssw/sectors-data'

describe('SectorSelector', () => {
  const mockOnChange = vi.fn()

  beforeEach(() => {
    mockOnChange.mockClear()
  })

  it('renders all 14 sectors', () => {
    render(<SectorSelector value="" onChange={mockOnChange} />)

    // Check that all sectors are rendered by checking Japanese names
    SSW_SECTORS.forEach((sector) => {
      expect(screen.getByText(sector.nameJP)).toBeInTheDocument()
    })

    // Check that we have exactly 14 sectors
    const sectorButtons = screen.getAllByRole('button')
    expect(sectorButtons).toHaveLength(14)
  })

  it('handles sector selection correctly', () => {
    render(<SectorSelector value="" onChange={mockOnChange} />)

    // Click on the first sector
    const firstSectorButton = screen.getByLabelText(
      `Select ${SSW_SECTORS[0].name} sector for SSW textbook generation`
    )
    fireEvent.click(firstSectorButton)

    // Check that onChange was called with the correct sector ID
    expect(mockOnChange).toHaveBeenCalledWith(SSW_SECTORS[0].id)
  })

  it('applies correct accessibility attributes', () => {
    const selectedSectorId = SSW_SECTORS[2].id
    render(<SectorSelector value={selectedSectorId} onChange={mockOnChange} />)

    SSW_SECTORS.forEach((sector) => {
      const button = screen.getByLabelText(
        `Select ${sector.name} sector for SSW textbook generation`
      )

      // Check aria-pressed attribute
      if (sector.id === selectedSectorId) {
        expect(button).toHaveAttribute('aria-pressed', 'true')
      } else {
        expect(button).toHaveAttribute('aria-pressed', 'false')
      }
    })
  })

  it('shows selected checkmark for active sector', () => {
    const selectedSectorId = SSW_SECTORS[5].id
    render(<SectorSelector value={selectedSectorId} onChange={mockOnChange} />)

    // Check that the selected sector has a checkmark
    const selectedButton = screen.getByLabelText(
      `Select ${SSW_SECTORS[5].name} sector for SSW textbook generation`
    )
    const checkmark = selectedButton.querySelector('svg')
    expect(checkmark).toBeInTheDocument()
  })

  it('applies correct styling based on selection state', () => {
    const selectedSectorId = SSW_SECTORS[0].id
    render(<SectorSelector value={selectedSectorId} onChange={mockOnChange} />)

    SSW_SECTORS.forEach((sector) => {
      const button = screen.getByLabelText(
        `Select ${sector.name} sector for SSW textbook generation`
      )

      if (sector.id === selectedSectorId) {
        // Check selected state classes
        expect(button).toHaveClass('border-transparent')
        expect(button).toHaveClass('text-white')
      } else {
        // Check unselected state classes
        expect(button).toHaveClass('border-gray-300')
      }
    })
  })
})
