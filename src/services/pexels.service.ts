import { createClient } from 'pexels'

const PEXELS_API_KEY = 'SGYiBk9dYciptDCkYsSln50aNltKpkCKcTrn5U2aQwoOF8DfxwNA9jsW'

const client = createClient(PEXELS_API_KEY)

export interface PexelsImage {
  id: number
  url: string
  photographer: string
  src: {
    original: string
    large2x: string
    large: string
    medium: string
    small: string
    portrait: string
    landscape: string
    tiny: string
  }
}

export interface PexelsVideo {
  id: number
  url: string
  image?: string
  user: {
    name: string
  }
  video_files: Array<{
    id: number
    quality: string
    file_type: string
    width: number
    height: number
    link: string
  }>
  video_pictures?: Array<{
    id: number
    picture: string
    nr: number
  }>
}

export const japanThemes = {
  cherryBlossom: 'japan cherry blossom sakura',
  garden: 'japanese garden zen',
  tokyo: 'tokyo night city',
  mountFuji: 'mount fuji japan',
  temple: 'japanese temple shrine',
  street: 'japanese street kyoto',
  culture: 'japanese culture traditional',
  nature: 'japan nature landscape',
  architecture: 'japanese architecture',
  food: 'japanese food sushi',
}

export class PexelsService {
  private cache: Map<string, any> = new Map()
  private requestQueue: Map<string, Promise<any>> = new Map()

  // Optimized batch photo fetch with deduplication
  async searchPhotos(
    query: string,
    perPage: number = 15,
    orientation?: 'landscape' | 'portrait' | 'square'
  ): Promise<PexelsImage[]> {
    const cacheKey = `photos-${query}-${perPage}-${orientation || 'any'}`

    // Return cached result
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)
    }

    // Deduplicate concurrent requests
    if (this.requestQueue.has(cacheKey)) {
      return this.requestQueue.get(cacheKey)
    }

    const request = this.fetchPhotos(query, perPage, orientation)
    this.requestQueue.set(cacheKey, request)

    try {
      const photos = await request
      this.cache.set(cacheKey, photos)
      return photos
    } finally {
      this.requestQueue.delete(cacheKey)
    }
  }

  private async fetchPhotos(
    query: string,
    perPage: number,
    orientation?: 'landscape' | 'portrait' | 'square'
  ): Promise<PexelsImage[]> {
    try {
      const searchOptions: any = {
        query,
        per_page: perPage,
      }

      if (orientation) {
        searchOptions.orientation = orientation
      }

      const response = await client.photos.search(searchOptions)

      if ('photos' in response) {
        return response.photos as PexelsImage[]
      }

      return []
    } catch (error) {
      console.error('Error fetching photos from Pexels:', error)
      return []
    }
  }

  // Optimized batch video fetch with deduplication
  async searchVideos(
    query: string,
    perPage: number = 10,
    minWidth?: number,
    minHeight?: number
  ): Promise<PexelsVideo[]> {
    const cacheKey = `videos-${query}-${perPage}-${minWidth || 'any'}-${minHeight || 'any'}`

    // Return cached result
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)
    }

    // Deduplicate concurrent requests
    if (this.requestQueue.has(cacheKey)) {
      return this.requestQueue.get(cacheKey)
    }

    const request = this.fetchVideos(query, perPage, minWidth, minHeight)
    this.requestQueue.set(cacheKey, request)

    try {
      const videos = await request
      this.cache.set(cacheKey, videos)
      return videos
    } finally {
      this.requestQueue.delete(cacheKey)
    }
  }

  private async fetchVideos(
    query: string,
    perPage: number,
    minWidth?: number,
    minHeight?: number
  ): Promise<PexelsVideo[]> {
    try {
      const searchOptions: any = {
        query,
        per_page: perPage,
      }

      if (minWidth) searchOptions.min_width = minWidth
      if (minHeight) searchOptions.min_height = minHeight

      const response = await client.videos.search(searchOptions)

      if ('videos' in response) {
        return response.videos as PexelsVideo[]
      }

      return []
    } catch (error) {
      console.error('Error fetching videos from Pexels:', error)
      return []
    }
  }

  // Batch fetch multiple queries at once
  async batchFetchPhotos(
    queries: Array<{ query: string; perPage?: number; orientation?: 'landscape' | 'portrait' }>
  ): Promise<Record<string, PexelsImage[]>> {
    const results: Record<string, PexelsImage[]> = {}

    await Promise.all(
      queries.map(async ({ query, perPage = 15, orientation }) => {
        results[query] = await this.searchPhotos(query, perPage, orientation)
      })
    )

    return results
  }

  // Batch fetch videos
  async batchFetchVideos(
    queries: Array<{ query: string; perPage?: number }>
  ): Promise<Record<string, PexelsVideo[]>> {
    const results: Record<string, PexelsVideo[]> = {}

    await Promise.all(
      queries.map(async ({ query, perPage = 10 }) => {
        results[query] = await this.searchVideos(query, perPage)
      })
    )

    return results
  }

  async getRandomJapanPhoto(): Promise<PexelsImage | null> {
    const themes = Object.values(japanThemes)
    const randomTheme = themes[Math.floor(Math.random() * themes.length)]
    const photos = await this.searchPhotos(randomTheme, 20)

    if (photos.length > 0) {
      return photos[Math.floor(Math.random() * photos.length)]
    }

    return null
  }

  async getRandomJapanVideo(): Promise<PexelsVideo | null> {
    const themes = Object.values(japanThemes)
    const randomTheme = themes[Math.floor(Math.random() * themes.length)]
    const videos = await this.searchVideos(randomTheme, 10)

    if (videos.length > 0) {
      return videos[Math.floor(Math.random() * videos.length)]
    }

    return null
  }

  clearCache() {
    this.cache.clear()
  }
}

export const pexelsService = new PexelsService()
