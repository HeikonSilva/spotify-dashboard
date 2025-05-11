import { useEffect, useState } from 'react'
import { useSpotifyToken } from './useSpotifyToken'
import axios from 'axios'

export function useSpotifyTrack(id: string) {
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

    axios
      .get(`https://api.spotify.com/v1/tracks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setData(res.data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.response?.data?.error?.message || err.message)
        setLoading(false)
      })
  }, [id, token, tokenLoading, tokenError])

  return { data, loading, error }
}
