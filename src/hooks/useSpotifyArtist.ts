import { useEffect, useState } from 'react'
import { useSpotifyToken } from './useSpotifyToken'
import axios from 'axios'

export function useSpotifyArtist(id: string) {
  const { token, loading: tokenLoading, error: tokenError } = useSpotifyToken()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id || tokenLoading) return
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

    Promise.all([
      axios.get(`https://api.spotify.com/v1/artists/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get(`https://api.spotify.com/v1/artists/${id}/albums?limit=20`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get(
        `https://api.spotify.com/v1/artists/${id}/top-tracks?market=BR`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      ),
    ])
      .then(([artist, albums, topTracks]) => {
        setData({
          artist: artist.data,
          albums: albums.data.items,
          topTracks: topTracks.data.tracks,
        })
        setLoading(false)
      })
      .catch((err) => {
        setError(err.response?.data?.error?.message || err.message)
        setLoading(false)
      })
  }, [id, token, tokenLoading, tokenError])

  return { data, loading, error }
}
