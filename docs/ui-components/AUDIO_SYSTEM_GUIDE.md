# Audio System Implementation Guide: Koto String Vibrations

## Overview
This guide provides complete implementation instructions for creating authentic koto (Japanese harp) string vibration sounds that trigger on user interactions within the Japanese-themed hero section.

## Technical Architecture

### 1. Web Audio API Foundation

#### Core Audio Context Setup
```typescript
// src/lib/audio/audio-context.ts
class AudioContextManager {
  private static instance: AudioContextManager
  private audioContext: AudioContext | null = null
  private isInitialized = false

  private constructor() {}

  static getInstance(): AudioContextManager {
    if (!AudioContextManager.instance) {
      AudioContextManager.instance = new AudioContextManager()
    }
    return AudioContextManager.instance
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return

    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      
      // Resume context if suspended (common on mobile)
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume()
      }
      
      this.isInitialized = true
    } catch (error) {
      console.warn('Web Audio API not supported:', error)
    }
  }

  getContext(): AudioContext | null {
    return this.audioContext
  }

  async resume(): Promise<void> {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume()
    }
  }
}
```

### 2. Koto String Synthesis System

#### Koto String Class Implementation
```typescript
// src/lib/audio/koto-string.ts
export interface KotoStringConfig {
  baseFrequency: number
  length: number // String length factor (0.5-2.0)
  tension: number // String tension (0.1-1.0)
  material: 'silk' | 'nylon' | 'steel'
  decayTime: number // seconds
}

export class KotoString {
  private audioContext: AudioContext
  private oscillator: OscillatorNode | null = null
  private gainNode: GainNode
  private filterNode: BiquadFilterNode
  private convolverNode: ConvolverNode | null = null
  
  constructor(
    private audioContext: AudioContext,
    private config: KotoStringConfig
  ) {
    this.gainNode = this.audioContext.createGain()
    this.filterNode = this.audioContext.createBiquadFilter()
    
    this.setupAudioChain()
    this.createReverb()
  }

  private setupAudioChain(): void {
    // Configure filter for string timbre
    this.filterNode.type = 'bandpass'
    this.filterNode.frequency.setValueAtTime(
      this.config.baseFrequency * 2, 
      this.audioContext.currentTime
    )
    this.filterNode.Q.setValueAtTime(10, this.audioContext.currentTime)
    
    // Connect audio chain
    this.filterNode.connect(this.gainNode)
    this.gainNode.connect(this.audioContext.destination)
  }

  private createReverb(): void {
    // Create impulse response for koto body resonance
    const sampleRate = this.audioContext.sampleRate
    const length = sampleRate * this.config.decayTime
    const impulse = this.audioContext.createBuffer(2, length, sampleRate)
    
    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel)
      for (let i = 0; i < length; i++) {
        const decay = Math.pow(1 - i / length, 2)
        channelData[i] = (Math.random() * 2 - 1) * decay * 0.1
      }
    }
    
    this.convolverNode = this.audioContext.createConvolver()
    this.convolverNode.buffer = impulse
    this.convolverNode.connect(this.gainNode)
  }

  play(velocity: number = 0.7, duration: number = 3): void {
    if (!this.audioContext) return

    // Create oscillator with appropriate waveform
    this.oscillator = this.audioContext.createOscillator()
    
    // Adjust frequency based on material properties
    let frequency = this.config.baseFrequency
    switch (this.config.material) {
      case 'silk':
        frequency *= 0.95
        this.oscillator.type = 'sine'
        break
      case 'nylon':
        frequency *= 1.0
        this.oscillator.type = 'triangle'
        break
      case 'steel':
        frequency *= 1.05
        this.oscillator.type = 'sawtooth'
        break
    }
    
    this.oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime)

    // Add slight frequency modulation for realism
    const modulator = this.audioContext.createOscillator()
    const modGain = this.audioContext.createGain()
    modulator.frequency.setValueAtTime(5, this.audioContext.currentTime)
    modGain.gain.setValueAtTime(frequency * 0.001, this.audioContext.currentTime)
    modulator.connect(modGain)
    modGain.connect(this.oscillator.frequency)
    modulator.start()

    // Connect to audio chain
    if (this.convolverNode) {
      this.oscillator.connect(this.convolverNode)
    } else {
      this.oscillator.connect(this.filterNode)
    }

    // ADSR envelope
    const now = this.audioContext.currentTime
    const attackTime = 0.01
    const decayTime = 0.3
    const sustainLevel = velocity * 0.3
    const releaseTime = duration - attackTime - decayTime

    this.gainNode.gain.setValueAtTime(0, now)
    this.gainNode.gain.linearRampToValueAtTime(velocity, now + attackTime)
    this.gainNode.gain.exponentialRampToValueAtTime(sustainLevel, now + attackTime + decayTime)
    this.gainNode.gain.exponentialRampToValueAtTime(0.001, now + attackTime + decayTime + releaseTime)

    // Start and stop
    this.oscillator.start(now)
    this.oscillator.stop(now + duration)
    
    // Cleanup
    this.oscillator.onended = () => {
      modulator.stop()
      this.oscillator = null
    }
  }

  stop(): void {
    if (this.oscillator) {
      this.oscillator.stop()
      this.oscillator = null
    }
  }
}
```

### 3. Koto Instrument Implementation

#### Multi-string Koto Class
```typescript
// src/lib/audio/koto-instrument.ts
import { KotoString, KotoStringConfig } from './koto-string'

export interface KotoConfig {
  stringCount: number // Typically 13, 17, or 25
  tuning: 'hirajoshi' | 'kumoi' | 'iwato' | 'custom'
  scale: number[]
}

export class KotoInstrument {
  private strings: KotoString[] = []
  private audioContextManager = AudioContextManager.getInstance()
  
  constructor(private config: KotoConfig) {
    this.initializeStrings()
  }

  private initializeStrings(): void {
    const baseFrequencies = this.getScaleFrequencies()
    
    for (let i = 0; i < this.config.stringCount; i++) {
      const stringConfig: KotoStringConfig = {
        baseFrequency: baseFrequencies[i] || baseFrequencies[0] * (i + 1),
        length: 1.0 - (i * 0.02), // Slightly shorter for higher strings
        tension: 0.8 + (i * 0.02), // Slightly tighter for higher strings
        material: i % 3 === 0 ? 'steel' : i % 3 === 1 ? 'silk' : 'nylon',
        decayTime: 4.0 + (i * 0.1)
      }
      
      const audioContext = this.audioContextManager.getContext()
      if (audioContext) {
        this.strings.push(new KotoString(audioContext, stringConfig))
      }
    }
  }

  private getScaleFrequencies(): number[] {
    // Traditional Japanese scales in Hirajoshi tuning
    const hirajoshi = [196.00, 220.00, 261.63, 293.66, 329.63] // G4, A4, C5, D5, E5
    const kumoi = [220.00, 246.94, 261.63, 293.66, 329.63] // A4, B4, C5, D5, E5
    const iwato = [196.00, 207.65, 261.63, 293.66, 311.13] // G4, G#4, C5, D5, D#5
    
    switch (this.config.tuning) {
      case 'hirajoshi':
        return hirajoshi
      case 'kumoi':
        return kumoi
      case 'iwato':
        return iwato
      case 'custom':
        return this.config.scale
      default:
        return hirajoshi
    }
  }

  playString(stringIndex: number, velocity: number = 0.7): void {
    if (stringIndex >= 0 && stringIndex < this.strings.length) {
      this.strings[stringIndex].play(velocity)
    }
  }

  playChord(indices: number[], velocity: number = 0.5): void {
    indices.forEach((index, i) => {
      setTimeout(() => {
        this.playString(index, velocity)
      }, i * 50) // Slight delay for realistic strumming
    })
  }

  playScale(direction: 'up' | 'down' = 'up', velocity: number = 0.6): void {
    const sequence = direction === 'up' 
      ? Array.from({ length: this.strings.length }, (_, i) => i)
      : Array.from({ length: this.strings.length }, (_, i) => this.strings.length - 1 - i)
    
    sequence.forEach((stringIndex, i) => {
      setTimeout(() => {
        this.playString(stringIndex, velocity)
      }, i * 200)
    })
  }

  // Traditional koto playing techniques
  playOrnament(baseString: number, ornamentString: number): void {
    this.playString(baseString, 0.6)
    setTimeout(() => {
      this.playString(ornamentString, 0.4)
    }, 150)
  }

  playGlissando(startString: number, endString: number, duration: number = 1000): void {
    const step = startString < endString ? 1 : -1
    const stringCount = Math.abs(endString - startString) + 1
    const delay = duration / stringCount
    
    for (let i = 0; i < stringCount; i++) {
      const stringIndex = startString + (i * step)
      setTimeout(() => {
        this.playString(stringIndex, 0.5 - (i * 0.02)) // Gradually quieter
      }, i * delay)
    }
  }
}
```

### 4. Interactive Sound System

#### Hook for React Components
```typescript
// src/hooks/useKotoSound.ts
import { useEffect, useRef, useCallback } from 'react'
import { KotoInstrument, KotoConfig } from '@/lib/audio/koto-instrument'

interface UseKotoSoundOptions {
  volume?: number
  enableOnHover?: boolean
  enableOnClick?: boolean
  stringPattern?: number[]
  tuning?: KotoConfig['tuning']
}

export function useKotoSound(options: UseKotoSoundOptions = {}) {
  const {
    volume = 0.7,
    enableOnHover = true,
    enableOnClick = true,
    stringPattern = [0, 2, 4], // Simple chord pattern
    tuning = 'hirajoshi'
  } = options

  const kotoRef = useRef<KotoInstrument | null>(null)
  const audioContextManager = AudioContextManager.getInstance()

  useEffect(() => {
    // Initialize audio context and koto instrument
    const initializeAudio = async () => {
      await audioContextManager.initialize()
      
      const kotoConfig: KotoConfig = {
        stringCount: 13,
        tuning,
        scale: []
      }
      
      kotoRef.current = new KotoInstrument(kotoConfig)
    }

    initializeAudio()

    return () => {
      // Cleanup audio resources
      if (kotoRef.current) {
        // Add cleanup logic if needed
      }
    }
  }, [tuning])

  const playSound = useCallback((type: 'single' | 'chord' | 'scale' = 'chord') => {
    if (!kotoRef.current) return

    switch (type) {
      case 'single':
        kotoRef.current.playString(Math.floor(Math.random() * 13), volume)
        break
      case 'chord':
        kotoRef.current.playChord(stringPattern, volume * 0.8)
        break
      case 'scale':
        kotoRef.current.playScale('up', volume * 0.6)
        break
    }
  }, [volume, stringPattern])

  const playHover = useCallback(() => {
    if (enableOnHover) {
      playSound('single')
    }
  }, [enableOnHover, playSound])

  const playClick = useCallback(() => {
    if (enableOnClick) {
      playSound('chord')
    }
  }, [enableOnClick, playSound])

  return {
    playSound,
    playHover,
    playClick,
    isReady: kotoRef.current !== null
  }
}
```

### 5. Integration with Components

#### Example Integration with CTA Button
```typescript
// src/components/japanese/KotoCTAButton.tsx
'use client'

import { useKotoSound } from '@/hooks/useKotoSound'

interface KotoCTAButtonProps {
  children: React.ReactNode
  onClick?: () => void
  stringPattern?: number[]
  className?: string
}

export default function KotoCTAButton({ 
  children, 
  onClick, 
  stringPattern = [0, 2, 4],
  className = '' 
}: KotoCTAButtonProps) {
  const { playClick, isReady } = useKotoSound({
    stringPattern,
    volume: 0.6
  })

  const handleClick = () => {
    playClick()
    onClick?.()
  }

  return (
    <button
      className={`koto-cta-button ${className}`}
      onClick={handleClick}
      aria-label="Interactive button with koto sound"
    >
      {children}
    </button>
  )
}
```

#### Example Integration with Origami Crane
```typescript
// Enhanced OrigamiCrane with sound
export default function EnhancedOrigamiCraneWithSound({
  // ... existing props
  soundEnabled = true
}) {
  const { playHover, playClick } = useKotoSound({
    volume: 0.4,
    stringPattern: [4, 7, 11] // Higher pitched strings
  })

  const handleMouseEnter = () => {
    if (soundEnabled) {
      playHover()
    }
    setIsHovered(true)
  }

  const handleClick = () => {
    if (soundEnabled) {
      playClick()
    }
    // ... existing click logic
  }

  // ... rest of component
}
```

### 6. Performance Optimization

#### Audio Resource Management
```typescript
// src/lib/audio/audio-optimizer.ts
export class AudioOptimizer {
  private static instance: AudioOptimizer
  private activeSounds = 0
  private maxConcurrentSounds = 8
  private soundQueue: Array<() => void> = []

  static getInstance(): AudioOptimizer {
    if (!AudioOptimizer.instance) {
      AudioOptimizer.instance = new AudioOptimizer()
    }
    return AudioOptimizer.instance
  }

  playSound(soundFunction: () => void): void {
    if (this.activeSounds < this.maxConcurrentSounds) {
      this.executeSound(soundFunction)
    } else {
      this.soundQueue.push(soundFunction)
    }
  }

  private executeSound(soundFunction: () => void): void {
    this.activeSounds++
    soundFunction()
    
    // Simulate sound completion (adjust based on actual sound duration)
    setTimeout(() => {
      this.activeSounds--
      this.processQueue()
    }, 2000)
  }

  private processQueue(): void {
    if (this.soundQueue.length > 0 && this.activeSounds < this.maxConcurrentSounds) {
      const nextSound = this.soundQueue.shift()
      if (nextSound) {
        this.executeSound(nextSound)
      }
    }
  }
}
```

### 7. Accessibility Considerations

#### Sound Controls and Preferences
```typescript
// src/lib/audio/sound-preferences.ts
export class SoundPreferences {
  private static instance: SoundPreferences
  private preferences = {
    enabled: true,
    volume: 0.7,
    enableOnHover: true,
    enableOnClick: true
  }

  static getInstance(): SoundPreferences {
    if (!SoundPreferences.instance) {
      SoundPreferences.instance = new SoundPreferences()
    }
    return SoundPreferences.instance
  }

  async loadPreferences(): Promise<void> {
    if (typeof window === 'undefined') return
    
    const saved = localStorage.getItem('koto-sound-preferences')
    if (saved) {
      this.preferences = { ...this.preferences, ...JSON.parse(saved) }
    }
    
    // Check system preferences
    if (window.matchMedia('(prefers-reduced-motion)').matches) {
      this.preferences.volume *= 0.5
    }
  }

  savePreferences(): void {
    if (typeof window === 'undefined') return
    localStorage.setItem('koto-sound-preferences', JSON.stringify(this.preferences))
  }

  updatePreferences(updates: Partial<typeof this.preferences>): void {
    this.preferences = { ...this.preferences, ...updates }
    this.savePreferences()
  }

  getPreferences() {
    return this.preferences
  }
}
```

### 8. Testing Implementation

#### Audio Testing Suite
```typescript
// tests/audio/koto-sound.test.ts
import { KotoString } from '@/lib/audio/koto-string'
import { KotoInstrument } from '@/lib/audio/koto-instrument'

describe('Koto Audio System', () => {
  let audioContext: AudioContext
  let kotoInstrument: KotoInstrument

  beforeEach(async () => {
    audioContext = new AudioContext()
    await audioContext.resume()
    
    kotoInstrument = new KotoInstrument({
      stringCount: 13,
      tuning: 'hirajoshi',
      scale: []
    })
  })

  test('KotoString plays with correct frequency', () => {
    const stringConfig = {
      baseFrequency: 440,
      length: 1.0,
      tension: 0.8,
      material: 'silk' as const,
      decayTime: 3.0
    }
    
    const string = new KotoString(audioContext, stringConfig)
    
    // Mock the audio context methods
    const mockOscillator = {
      frequency: { setValueAtTime: jest.fn() },
      connect: jest.fn(),
      start: jest.fn(),
      stop: jest.fn(),
      onended: null
    }
    
    jest.spyOn(audioContext, 'createOscillator').mockReturnValue(mockOscillator as any)
    
    string.play(0.7, 1)
    
    expect(mockOscillator.frequency.setValueAtTime).toHaveBeenCalledWith(418, expect.any(Number))
    expect(mockOscillator.start).toHaveBeenCalled()
  })

  test('KotoInstrument plays chord correctly', () => {
    const chordPattern = [0, 2, 4]
    const playStringSpy = jest.spyOn(kotoInstrument, 'playString')
    
    kotoInstrument.playChord(chordPattern, 0.5)
    
    expect(playStringSpy).toHaveBeenCalledTimes(3)
    expect(playStringSpy).toHaveBeenCalledWith(0, 0.5)
    expect(playStringSpy).toHaveBeenCalledWith(2, 0.5)
    expect(playStringSpy).toHaveBeenCalledWith(4, 0.5)
  })
})
```

This comprehensive audio system implementation provides authentic koto string sounds that enhance the Japanese cultural experience while maintaining performance and accessibility standards.