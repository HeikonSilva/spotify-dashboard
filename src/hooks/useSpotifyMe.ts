import { useEffect, useState } from 'react'
import axios from 'axios'

interface SpotifyUser {
  display_name: string
  email: string
  id: string
  images: { url: string }[]
}

export function useSpotifyMe() {
  const [data, setData] = useState<SpotifyUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      setError('No access token found')
      setLoading(false)
      return
    }

    axios
      .get('https://api.spotify.com/v1/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return { data, loading, error }
}
