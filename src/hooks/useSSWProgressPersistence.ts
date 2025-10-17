'use client'

import { useState } from 'react'

interface SSWGenerationConfig {
  title: string
  sswType: 'SSW1' | 'SSW2' | 'JFT-Basic'
  targetSector: string
  numberOfChapters: number
  focusAreas: string[]
  includeWorkplaceScenarios: boolean
  includeSafetyVocabulary: boolean
  includeAudio: boolean
  userId?: string
}

interface PersistedSSWData extends SSWGenerationConfig {
  step: number
  timestamp: number
}

const STORAGE_KEY = 'ssw-generation-progress'
const MAX_AGE_HOURS = 24 // Clear data after 24 hours

export function useSSWProgressPersistence() {
  const [isRestored, setIsRestored] = useState(false)

  // Save configuration to localStorage
  const saveProgress = (config: SSWGenerationConfig, step: number) => {
    try {
      const dataToSave: PersistedSSWData = {
        ...config,
        step,
        timestamp: Date.now(),
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
    } catch (error) {
      console.warn('Failed to save SSW progress to localStorage:', error)
    }
  }

  // Load configuration from localStorage
  const loadProgress = (): Partial<PersistedSSWData> | null => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY)
      if (!savedData) return null

      const parsed: PersistedSSWData = JSON.parse(savedData)

      // Check if data is too old
      const ageHours = (Date.now() - parsed.timestamp) / (1000 * 60 * 60)
      if (ageHours > MAX_AGE_HOURS) {
        clearProgress()
        return null
      }

      return parsed
    } catch (error) {
      console.warn('Failed to load SSW progress from localStorage:', error)
      return null
    }
  }

  // Clear saved progress
  const clearProgress = () => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.warn('Failed to clear SSW progress from localStorage:', error)
    }
  }

  // Check if there's saved progress
  const hasSavedProgress = (): boolean => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY)
      if (!savedData) return false

      const parsed: PersistedSSWData = JSON.parse(savedData)
      const ageHours = (Date.now() - parsed.timestamp) / (1000 * 60 * 60)
      return ageHours <= MAX_AGE_HOURS
    } catch {
      return false
    }
  }

  // Auto-save on configuration changes
  const autoSave = (config: SSWGenerationConfig, step: number) => {
    saveProgress(config, step)
  }

  // Restore progress on mount
  const restoreProgress = (): Partial<PersistedSSWData> | null => {
    const progress = loadProgress()
    setIsRestored(true)
    return progress
  }

  // Get summary of saved progress for display
  const getProgressSummary = () => {
    const progress = loadProgress()
    if (!progress) return null

    return {
      step: progress.step,
      title: progress.title || 'Untitled Textbook',
      sector: progress.targetSector,
      sswType: progress.sswType,
      chapters: progress.numberOfChapters,
      savedAt: new Date(progress.timestamp || Date.now()).toLocaleString(),
    }
  }

  return {
    saveProgress,
    loadProgress,
    clearProgress,
    hasSavedProgress,
    autoSave,
    restoreProgress,
    getProgressSummary,
    isRestored,
  }
}
