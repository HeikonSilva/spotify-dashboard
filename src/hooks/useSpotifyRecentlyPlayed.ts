import { useEffect, useState } from 'react'
import axios from 'axios'

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

interface Album {
  album_type: string
  artists: Artist[]
  available_markets: string[]
  external_urls: ExternalUrls
  href: string
  id: string
  images: { url: string; height: number; width: number }[]
  name: string
  release_date: string
  release_date_precision: string
  total_tracks: number
  type: string
  uri: string
}

interface Track {
  album: Album
  artists: Artist[]
  available_markets: string[]
  disc_number: number
  duration_ms: number
  explicit: boolean
  external_urls: ExternalUrls
  href: string
  id: string
  is_local: boolean
  name: string
  popularity: number
  preview_url: string | null
  track_number: number
  type: string
  uri: string
}

interface PlayHistoryItem {
  track: Track
  played_at: string
  context: {
    type: string
    href: string
    external_urls: ExternalUrls
    uri: string
  } | null
}

interface RecentlyPlayedResponse {
  items: PlayHistoryItem[]
  next: string | null
  cursors: {
    after: string
    before: string
  }
  limit: number
  href: string
}

interface UseSpotifyRecentlyPlayedOptions {
  limit?: number
  after?: number // timestamp in milliseconds
}

export function useSpotifyRecentlyPlayed(
  options: UseSpotifyRecentlyPlayedOptions = {}
) {
  const [data, setData] = useState<RecentlyPlayedResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      setError('No access token found')
      setLoading(false)
      return
    }

    // Build query parameters
    const params = new URLSearchParams()
    if (options.limit) params.append('limit', options.limit.toString())
    if (options.after) params.append('after', options.after.toString())

    // Construct the URL with query parameters
    const url = `https://api.spotify.com/v1/me/player/recently-played${
      params.toString() ? '?' + params.toString() : ''
    }`

    axios
      .get<RecentlyPlayedResponse>(url, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [options.limit, options.after])

  return { data, loading, error }
}
