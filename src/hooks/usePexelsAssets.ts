'use client'

import { useEffect, useState } from 'react'
import { pexelsService, type PexelsImage, type PexelsVideo } from '@/services/pexels.service'

export function usePexelsPhotos(query: string, count: number = 15) {
  const [photos, setPhotos] = useState<PexelsImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let mounted = true

    async function fetchPhotos() {
      try {
        setLoading(true)
        const result = await pexelsService.searchPhotos(query, count)
        if (mounted) {
          setPhotos(result)
          setError(null)
        }
      } catch (err) {
        if (mounted) {
          setError(err as Error)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    fetchPhotos()

    return () => {
      mounted = false
    }
  }, [query, count])

  return { photos, loading, error }
}

export function usePexelsVideos(query: string, count: number = 10) {
  const [videos, setVideos] = useState<PexelsVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let mounted = true

    async function fetchVideos() {
      try {
        setLoading(true)
        const result = await pexelsService.searchVideos(query, count)
        if (mounted) {
          setVideos(result)
          setError(null)
        }
      } catch (err) {
        if (mounted) {
          setError(err as Error)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    fetchVideos()

    return () => {
      mounted = false
    }
  }, [query, count])

  return { videos, loading, error }
}

export function useRandomJapanPhoto() {
  const [photo, setPhoto] = useState<PexelsImage | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function fetchPhoto() {
      try {
        const result = await pexelsService.getRandomJapanPhoto()
        if (mounted) {
          setPhoto(result)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    fetchPhoto()

    return () => {
      mounted = false
    }
  }, [])

  return { photo, loading }
}
