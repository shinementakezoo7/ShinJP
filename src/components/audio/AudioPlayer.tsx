'use client'

import { useEffect, useRef, useState } from 'react'

interface AudioPlayerProps {
  text: string
  audioUrl?: string
  speaker?: 'male' | 'female' | 'child' | 'elderly'
  speed?: 'slow' | 'normal' | 'fast'
  showText?: boolean
  showControls?: boolean
  autoGenerate?: boolean
  className?: string
}

export default function AudioPlayer({
  text,
  audioUrl: initialAudioUrl,
  speaker = 'female',
  speed = 'normal',
  showText = true,
  showControls = true,
  autoGenerate = false,
  className = '',
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [audioUrl, setAudioUrl] = useState(initialAudioUrl)
  const [currentSpeaker, setCurrentSpeaker] = useState(speaker)
  const [currentSpeed, setCurrentSpeed] = useState(speed)
  const [error, setError] = useState<string | null>(null)

  const generateAudio = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/audio/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          speaker: currentSpeaker,
          speed: currentSpeed,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate audio')
      }

      const data = await response.json()
      setAudioUrl(data.audioUrl)
    } catch (err) {
      console.error('Audio generation error:', err)
      setError('Failed to generate audio')
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-generate audio if requested and no URL provided
  useEffect(() => {
    if (autoGenerate && !audioUrl && text) {
      generateAudio()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoGenerate, text, audioUrl])

  const togglePlay = async () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      // Generate audio if not available
      if (!audioUrl && !isLoading) {
        await generateAudio()
      }

      if (audioRef.current && audioUrl) {
        try {
          await audioRef.current.play()
          setIsPlaying(true)
        } catch (err) {
          console.error('Playback error:', err)
          setError('Failed to play audio')
        }
      }
    }
  }

  const changeSpeaker = async (newSpeaker: typeof speaker) => {
    setCurrentSpeaker(newSpeaker)
    setAudioUrl(undefined) // Clear current audio
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const changeSpeed = async (newSpeed: typeof speed) => {
    setCurrentSpeed(newSpeed)
    setAudioUrl(undefined) // Clear current audio
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {showText && (
        <span className="text-lg font-japanese text-gray-900 dark:text-white">{text}</span>
      )}

      {/* Play/Pause Button */}
      <button
        onClick={togglePlay}
        disabled={isLoading}
        className={`p-2 rounded-full transition-all ${
          isLoading
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl'
        }`}
        title={isPlaying ? 'Pause' : 'Play'}
      >
        {isLoading ? (
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : isPlaying ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>

      {/* Speed Controls */}
      {showControls && (
        <div className="flex gap-1">
          {(['slow', 'normal', 'fast'] as const).map((s) => (
            <button
              key={s}
              onClick={() => changeSpeed(s)}
              disabled={isLoading}
              className={`px-2 py-1 text-xs rounded transition-all ${
                currentSpeed === s
                  ? 'bg-blue-500 text-white font-semibold'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={`${s} speed`}
            >
              {s === 'slow' && '🐢'}
              {s === 'normal' && '▶️'}
              {s === 'fast' && '⚡'}
            </button>
          ))}
        </div>
      )}

      {/* Speaker Controls */}
      {showControls && (
        <div className="flex gap-1">
          {(['male', 'female'] as const).map((sp) => (
            <button
              key={sp}
              onClick={() => changeSpeaker(sp)}
              disabled={isLoading}
              className={`px-2 py-1 text-xs rounded transition-all ${
                currentSpeaker === sp
                  ? 'bg-purple-500 text-white font-semibold'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={`${sp} voice`}
            >
              {sp === 'male' ? '👨' : '👩'}
            </button>
          ))}
        </div>
      )}

      {/* Error Message */}
      {error && <span className="text-xs text-red-600 dark:text-red-400">{error}</span>}

      {/* Audio Element */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={() => setIsPlaying(false)}
          onError={() => {
            setError('Audio playback error')
            setIsPlaying(false)
          }}
          preload="auto"
        />
      )}
    </div>
  )
}
