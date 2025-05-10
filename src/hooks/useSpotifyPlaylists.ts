import { useEffect, useState } from 'react'
import axios from 'axios'
import { useSpotifyToken } from './useSpotifyToken'

export function useSpotifyPlaylists() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { token, loading: tokenLoading, error: tokenError } = useSpotifyToken()

  useEffect(() => {
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

    axios
      .get('https://api.spotify.com/v1/me/playlists?limit=50', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setData(res.data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [token, tokenLoading, tokenError])

  return { data, loading, error }
}
