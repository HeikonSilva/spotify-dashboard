import { useState, useEffect } from 'react'
import { getActiveAccessToken, isAuthenticated } from '@/utils/spotifyAuth'

export function useSpotifyToken() {
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchToken = async () => {
      if (!isAuthenticated()) {
        if (isMounted) {
          setLoading(false)
          setToken(null)
        }
        return
      }

      try {
        const activeToken = await getActiveAccessToken()
        if (isMounted) {
          setToken(activeToken)
          setError(null)
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to get token')
          setToken(null)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchToken()

    return () => {
      isMounted = false
    }
  }, [])

  return { token, loading, error }
}
