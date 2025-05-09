import { useEffect, useState } from 'react'
import axios from 'axios'
import { getActiveAccessToken } from '@/utils/spotifyAuth'

interface ExternalUrls {
  spotify: string
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

interface Restrictions {
  reason: string
}

interface ExternalIds {
  isrc?: string
  ean?: string
  upc?: string
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

interface TrackArtist {
  external_urls: ExternalUrls
  href: string
  id: string
  name: string
  type: string
  uri: string
}

interface Track {
  album: Album
  artists: TrackArtist[]
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

interface Context {
  type: string
  href: string
  external_urls: ExternalUrls
  uri: string
}

interface PlayHistoryItem {
  track: Track
  played_at: string
  context: Context | null
}

interface Cursors {
  after: string
  before: string
}

interface RecentlyPlayedResponse {
  items: PlayHistoryItem[]
  next: string | null
  cursors: Cursors
  limit: number
  href: string
  total?: number
}

interface UseSpotifyRecentlyPlayedOptions {
  limit?: number
  after?: number
  before?: number
}

export function useSpotifyRecentlyPlayed(
  options: UseSpotifyRecentlyPlayedOptions = {}
) {
  const [data, setData] = useState<RecentlyPlayedResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      try {
        // Use await to get the token
        const token = await getActiveAccessToken()

        if (!token) {
          throw new Error('No access token available')
        }

        // Build query parameters
        const params = new URLSearchParams()
        if (options.limit) params.append('limit', options.limit.toString())
        if (options.after) params.append('after', options.after.toString())
        if (options.before) params.append('before', options.before.toString())

        // Construct the URL with query parameters
        const url = `https://api.spotify.com/v1/me/player/recently-played${
          params.toString() ? '?' + params.toString() : ''
        }`

        const response = await axios.get<RecentlyPlayedResponse>(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        if (isMounted) {
          setData(response.data)
          setError(null)
        }
      } catch (err) {
        console.error('Error fetching recently played tracks:', err)
        if (isMounted) {
          if (axios.isAxiosError(err) && err.response) {
            // Extract the specific error message from Spotify API
            const spotifyError =
              err.response.data?.error?.message || err.message
            setError(`${err.response.status}: ${spotifyError}`)
          } else {
            setError(err instanceof Error ? err.message : 'Unknown error')
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, [options.limit, options.after, options.before])

  return { data, loading, error }
}
