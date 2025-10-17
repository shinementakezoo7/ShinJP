import { useEffect, useRef, useCallback } from 'react'
import { useSocketConnection, useChatMessages } from '@/lib/websocket/socket-client'

// Custom hook for virtualized message rendering
export const useVirtualizedMessages = (
  messages: any[],
  containerRef: React.RefObject<HTMLElement>
) => {
  const [visibleMessages, setVisibleMessages] = useState<any[]>([])
  const [scrollTop, setScrollTop] = useState(0)
  const itemHeight = 80 // approximate height of each message item
  const containerHeight = 600 // visible container height

  useEffect(() => {
    if (!containerRef.current || !messages.length) {
      setVisibleMessages(messages)
      return
    }

    const startIndex = Math.floor(scrollTop / itemHeight)
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 2, // +2 for buffer
      messages.length
    )

    const visible = messages.slice(startIndex, endIndex)
    setVisibleMessages(visible)
  }, [messages, scrollTop, containerRef])

  return { visibleMessages, setScrollTop }
}

// Custom hook for optimized typing indicators
export const useTypingOptimization = () => {
  const { typingUsers } = useTypingIndicators()
  const [optimizedTyping, setOptimizedTyping] = useState<TypingIndicator[]>([])

  useEffect(() => {
    // Debounce typing updates to reduce re-renders
    const timer = setTimeout(() => {
      setOptimizedTyping(typingUsers)
    }, 100)

    return () => clearTimeout(timer)
  }, [typingUsers])

  return optimizedTyping
}

// Custom hook for message batching and debouncing
export const useMessageBatching = (callback: (messages: any[]) => void) => {
  const messageQueue = useRef<any[]>([])
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const addMessage = useCallback(
    (message: any) => {
      messageQueue.current.push(message)

      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // Batch messages with 50ms debounce
      timeoutRef.current = setTimeout(() => {
        if (messageQueue.current.length > 0) {
          callback([...messageQueue.current])
          messageQueue.current = []
        }
      }, 50)
    },
    [callback]
  )

  const flushMessages = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    if (messageQueue.current.length > 0) {
      callback([...messageQueue.current])
      messageQueue.current = []
    }
  }, [callback])

  return { addMessage, flushMessages }
}

// Custom hook for smooth animations with requestAnimationFrame
export const useSmoothAnimations = () => {
  const animationFrameRef = useRef<number | null>(null)

  const animate = useCallback((callback: () => void) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }

    animationFrameRef.current = requestAnimationFrame(callback)
  }, [])

  const cleanup = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
  }, [])

  useEffect(() => {
    return cleanup
  }, [cleanup])

  return { animate, cleanup }
}

// Custom hook for optimized file uploads
interface FileUploadState {
  isUploading: boolean
  progress: number
  error: string | null
}

export const useFileUploadOptimization = () => {
  const [uploadStates, setUploadStates] = useState<Record<string, FileUploadState>>({})
  const uploadProgress = useRef<Record<string, number>>({})

  const startUpload = useCallback((fileId: string, file: File) => {
    setUploadStates((prev) => ({
      ...prev,
      [fileId]: { isUploading: true, progress: 0, error: null },
    }))

    // Simulate upload progress
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 15
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        setUploadStates((prev) => ({
          ...prev,
          [fileId]: { isUploading: false, progress: 100, error: null },
        }))
      } else {
        uploadProgress.current[fileId] = progress
        setUploadStates((prev) => ({
          ...prev,
          [fileId]: { ...prev[fileId], progress },
        }))
      }
    }, 100)

    return interval
  }, [])

  const cancelUpload = useCallback((fileId: string, interval: NodeJS.Timeout) => {
    clearInterval(interval)
    setUploadStates((prev) => ({
      ...prev,
      [fileId]: { isUploading: false, progress: 0, error: 'Upload cancelled' },
    }))
  }, [])

  const resetUpload = useCallback((fileId: string) => {
    setUploadStates((prev) => {
      const newStates = { ...prev }
      delete newStates[fileId]
      return newStates
    })
  }, [])

  return {
    uploadStates,
    startUpload,
    cancelUpload,
    resetUpload,
  }
}

// Custom hook for keyboard navigation optimization
export const useKeyboardNavigation = (containerRef: React.RefObject<HTMLElement>) => {
  const [focusedIndex, setFocusedIndex] = useState(-1)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!containerRef.current) return

      const focusableElements = containerRef.current.querySelectorAll('[data-focusable="true"]')
      const currentIndex = Array.from(focusableElements).findIndex(
        (el) => el === document.activeElement
      )

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          const nextIndex = (currentIndex + 1) % focusableElements.length
          setFocusedIndex(nextIndex)
          if (focusableElements[nextIndex]) {
            ;(focusableElements[nextIndex] as HTMLElement).focus()
          }
          break

        case 'ArrowUp':
          e.preventDefault()
          const prevIndex = currentIndex <= 0 ? focusableElements.length - 1 : currentIndex - 1
          setFocusedIndex(prevIndex)
          if (focusableElements[prevIndex]) {
            ;(focusableElements[prevIndex] as HTMLElement).focus()
          }
          break

        case 'Enter':
          if (currentIndex >= 0 && focusableElements[currentIndex]) {
            ;(focusableElements[currentIndex] as HTMLElement).click()
          }
          break

        case 'Escape':
          setFocusedIndex(-1)
          document.activeElement?.blur()
          break
      }
    },
    [containerRef]
  )

  useEffect(() => {
    const container = containerRef.current
    if (container) {
      container.addEventListener('keydown', handleKeyDown)
      return () => container.removeEventListener('keydown', handleKeyDown)
    }
  }, [containerRef, handleKeyDown])

  return { focusedIndex, setFocusedIndex }
}

// Custom hook for performance monitoring
export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    messagesRendered: 0,
    renderTime: 0,
    memoryUsage: 0,
  })

  const measurePerformance = useCallback((operation: string, callback: () => void) => {
    const startTime = performance.now()
    const startMemory = performance.memory?.usedJSHeapSize || 0

    callback()

    const endTime = performance.now()
    const endMemory = performance.memory?.usedJSHeapSize || 0

    setMetrics((prev) => ({
      ...prev,
      renderTime: endTime - startTime,
      memoryUsage: (endMemory - startMemory) / 1024 / 1024, // MB
    }))

    if (process.env.NODE_ENV === 'development') {
      console.log(`Performance: ${operation} took ${endTime - startTime}ms`)
    }
  }, [])

  return { metrics, measurePerformance }
}
