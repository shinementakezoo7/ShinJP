import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test-utils'
import { AchievementCard } from '../AchievementCard'

describe('AchievementCard', () => {
  const mockAchievement = {
    id: 1,
    name: 'First Steps',
    description: 'Complete your first lesson',
    icon_url: 'https://example.com/icon.png',
    criteria: {},
    category: 'learning',
    created_at: '2023-01-01T00:00:00Z',
  }

  it('renders achievement name and description', () => {
    render(<AchievementCard achievement={mockAchievement} />)

    expect(screen.getByText('First Steps')).toBeInTheDocument()
    expect(screen.getByText('Complete your first lesson')).toBeInTheDocument()
  })

  it('shows unlocked status when isUnlocked is true', () => {
    render(
      <AchievementCard
        achievement={mockAchievement}
        isUnlocked={true}
        unlockedAt="2023-01-01T00:00:00Z"
      />
    )

    expect(screen.getByText('Unlocked')).toBeInTheDocument()
  })

  it('shows locked status when isUnlocked is false', () => {
    render(<AchievementCard achievement={mockAchievement} isUnlocked={false} />)

    expect(screen.queryByText('Unlocked')).not.toBeInTheDocument()
  })
})
