import { useEffect, useState } from 'react'
import { useSpotifyToken } from './useSpotifyToken'

interface ExternalUrls {
  spotify: string
}

interface Followers {
  href: string | null
  total: number
}

interface Image {
  url: string
  height: number | null
  width: number | null
}

interface Artist {
  external_urls: ExternalUrls
  followers: Followers
  genres: string[]
  href: string
  id: string
  images: Image[]
  name: string
  popularity: number
  type: string
  uri: string
}

interface TopArtistsResponse {
  items: Artist[]
  total: number
  limit: number
  offset: number
  href: string
  next: string | null
  previous: string | null
}

interface UseSpotifyTopArtistsOptions {
  limit?: number
  timeRange?: 'short_term' | 'medium_term' | 'long_term'
  offset?: number
}

export function useSpotifyTopArtists(
  options: UseSpotifyTopArtistsOptions = {}
) {
  const [data, setData] = useState<TopArtistsResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const { token, loading: tokenLoading, error: tokenError } = useSpotifyToken()

  const { limit = 10, timeRange = 'short_term', offset = 0 } = options

  useEffect(() => {
    let isMounted = true

    const fetchTopArtists = async () => {
      if (tokenLoading) return
      if (tokenError) {
        setError(tokenError)
        setLoading(false)
        return
      }
      if (!token) {
        setError('No access token available')
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams({
          limit: limit.toString(),
          time_range: timeRange,
          offset: offset.toString(),
        })

        const response = await fetch(
          `https://api.spotify.com/v1/me/top/artists?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        )

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }

        const data: TopArtistsResponse = await response.json()
        if (isMounted) {
          setData(data)
        }
      } catch (err) {
        console.error('Error fetching top artists:', err)
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unknown error')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchTopArtists()

    return () => {
      isMounted = false
    }
  }, [limit, timeRange, offset, token, tokenLoading, tokenError])

  return { data, loading, error }
}
