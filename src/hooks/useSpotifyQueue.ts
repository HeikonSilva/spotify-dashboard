import { useEffect, useState } from 'react'
import axios from 'axios'
import { useSpotifyToken } from './useSpotifyToken'

interface QueueTrack {
  id: string
  name: string
  artists: { id: string; name: string }[]
  album: { id: string; name: string; images: { url: string }[] }
  duration_ms: number
  uri: string
}

interface QueueResponse {
  currently_playing: QueueTrack | null
  queue: QueueTrack[]
}

export function useSpotifyQueue() {
  const { token, loading: tokenLoading, error: tokenError } = useSpotifyToken()
  const [data, setData] = useState<QueueResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

    setLoading(true)
    setError(null)

    axios
      .get('https://api.spotify.com/v1/me/player/queue', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setData(res.data)
        setLoading(false)
      })
      .catch((err) => {
        if (err.response?.status === 403) {
          setError(
            'Você precisa de uma conta Spotify Premium para acessar a fila.'
          )
        } else {
          setError(err.response?.data?.error?.message || err.message)
        }
        setLoading(false)
      })
  }, [token, tokenLoading, tokenError])

  return { data, loading, error }
}
