import { useEffect, useState } from 'react'
import { getAccessToken } from '@/utils/spotifyAuth'

interface Artist {
  id: string
  name: string
}

interface Track {
  id: string
  name: string
  artists: Artist[]
  album: {
    id: string
    name: string
    images: Array<{
      url: string
      height: number
      width: number
    }>
  }
  duration_ms: number
  popularity: number
}

interface TopTracksResponse {
  items: Track[]
  total: number
  limit: number
  offset: number
  href: string
  next: string | null
  previous: string | null
}

interface UseSpotifyTopTracksOptions {
  limit?: number
  timeRange?: number | string
}

export function useSpotifyTopTracks(options: UseSpotifyTopTracksOptions = {}) {
  const [data, setData] = useState<TopTracksResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const { limit = 10, timeRange = 'short_term' } = options

  useEffect(() => {
    const fetchTopTracks = async () => {
      setLoading(true)
      setError(null)

      try {
        const token = getAccessToken()
        if (!token) {
          throw new Error('No access token available')
        }

        const response = await fetch(
          `https://api.spotify.com/v1/me/top/tracks?limit=${limit}&offset=${timeRange}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }

        const data: TopTracksResponse = await response.json()
        setData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchTopTracks()
  }, [limit, timeRange])

  return { data, loading, error }
}
