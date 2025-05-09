import { useEffect, useState } from 'react'
import { getActiveAccessToken } from '@/utils/spotifyAuth'

interface ExternalUrls {
  spotify: string
}

interface ExternalIds {
  isrc?: string
  ean?: string
  upc?: string
}

interface Restrictions {
  reason: string
}

interface Artist {
  external_urls: ExternalUrls
  href: string
  id: string
  name: string
  type: string
  uri: string
}

interface Image {
  url: string
  height: number | null
  width: number | null
}

interface AlbumArtist {
  external_urls: ExternalUrls
  href: string
  id: string
  name: string
  type: string
  uri: string
}

interface Album {
  album_type: string
  total_tracks: number
  available_markets: string[]
  external_urls: ExternalUrls
  href: string
  id: string
  images: Image[]
  name: string
  release_date: string
  release_date_precision: string
  restrictions?: Restrictions
  type: string
  uri: string
  artists: AlbumArtist[]
}

interface Track {
  album: Album
  artists: Artist[]
  available_markets: string[]
  disc_number: number
  duration_ms: number
  explicit: boolean
  external_ids: ExternalIds
  external_urls: ExternalUrls
  href: string
  id: string
  is_playable?: boolean
  linked_from?: Record<string, unknown>
  restrictions?: Restrictions
  name: string
  popularity: number
  track_number: number
  type: string
  uri: string
  is_local: boolean
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
  timeRange?: 'short_term' | 'medium_term' | 'long_term'
  offset?: number
}

export function useSpotifyTopTracks(options: UseSpotifyTopTracksOptions = {}) {
  const [data, setData] = useState<TopTracksResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const { limit = 10, timeRange = 'short_term', offset = 0 } = options

  useEffect(() => {
    let isMounted = true

    const fetchTopTracks = async () => {
      setLoading(true)
      setError(null)

      try {
        const token = await getActiveAccessToken()
        if (!token) {
          throw new Error('No access token available')
        }

        const params = new URLSearchParams({
          limit: limit.toString(),
          time_range: timeRange,
          offset: offset.toString(),
        })

        const response = await fetch(
          `https://api.spotify.com/v1/me/top/tracks?${params.toString()}`,
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

        const data: TopTracksResponse = await response.json()
        if (isMounted) {
          setData(data)
        }
      } catch (err) {
        console.error('Error fetching top tracks:', err)
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unknown error')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchTopTracks()

    return () => {
      isMounted = false
    }
  }, [limit, timeRange, offset])

  return { data, loading, error }
}
