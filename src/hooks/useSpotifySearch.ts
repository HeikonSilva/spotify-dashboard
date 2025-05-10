import { useState, useEffect } from 'react'
import axios from 'axios'
import { useSpotifyToken } from './useSpotifyToken'

export type SearchType = 'artist' | 'album' | 'track'

interface UseSpotifySearchOptions {
  query: string
  type: SearchType | SearchType[]
  limit?: number
  offset?: number
  market?: string
}

export function useSpotifySearch(options: UseSpotifySearchOptions) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const { token, loading: tokenLoading, error: tokenError } = useSpotifyToken()

  useEffect(() => {
    if (!options.query || options.query.trim() === '') {
      setData(null)
      return
    }

    if (tokenLoading) return
    if (tokenError) {
      setError(tokenError)
      return
    }
    if (!token) {
      setError('No access token available')
      return
    }

    const fetchSearchResults = async () => {
      setLoading(true)
      setError(null)

      try {
        const typeParam = Array.isArray(options.type)
          ? options.type.join(',')
          : options.type

        const params = new URLSearchParams({
          q: options.query,
          type: typeParam,
          limit: options.limit?.toString() || '20',
          offset: options.offset?.toString() || '0',
        })

        if (options.market) {
          params.append('market', options.market)
        }

        const response = await axios.get(
          `https://api.spotify.com/v1/search?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        )

        setData(response.data)
      } catch (err) {
        console.error('Error searching Spotify:', err)
        if (axios.isAxiosError(err) && err.response) {
          setError(
            `${err.response.status}: ${
              err.response.data?.error?.message || err.message
            }`
          )
        } else {
          setError(err instanceof Error ? err.message : 'Unknown error')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchSearchResults()
  }, [
    options.query,
    options.type,
    options.limit,
    options.offset,
    options.market,
    token,
    tokenLoading,
    tokenError,
  ])

  return { data, loading, error }
}
