import { useState, useEffect, useMemo } from 'react'
import { useSpotifyToken } from './useSpotifyToken'
import axios from 'axios'

interface HourlyActivity {
  hour: number
  count: number
  percentage: number
}

interface WeekdayActivity {
  day: number
  name: string
  count: number
  percentage: number
}

interface Track {
  id: string
  name: string
  duration_ms: number
  artists: { id: string; name: string }[]
}

interface ListeningHistoryItem {
  track: Track
  played_at: string
}

export function useListeningActivity() {
  const { token, loading: tokenLoading, error: tokenError } = useSpotifyToken()
  const [history, setHistory] = useState<ListeningHistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Período de 30 dias atrás
  const oneMonthAgo = useMemo(() => {
    const date = new Date()
    date.setMonth(date.getMonth() - 1)
    return date.getTime()
  }, [])

  const weekdayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

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

    const fetchAllRecentlyPlayed = async () => {
      setLoading(true)
      setError(null)

      try {
        const allItems: ListeningHistoryItem[] = []
        let nextUrl:
          | string
          | null = `https://api.spotify.com/v1/me/player/recently-played?limit=50&after=${oneMonthAgo}`

        // Vamos fazer até 10 chamadas para obter até 500 músicas
        // Você pode ajustar este limite conforme necessário
        const MAX_CALLS = 10
        let callCount = 0

        while (nextUrl && callCount < MAX_CALLS) {
          const response = await axios.get(nextUrl, {
            headers: { Authorization: `Bearer ${token}` },
          })

          const items = response.data.items
          allItems.push(...items)

          // Extrai o cursor para a próxima página
          if (response.data.cursors && response.data.cursors.after) {
            nextUrl = `https://api.spotify.com/v1/me/player/recently-played?limit=50&after=${response.data.cursors.after}`
          } else {
            nextUrl = null
          }

          callCount++
        }

        setHistory(allItems)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching listening history:', err)
        if (axios.isAxiosError(err) && err.response) {
          setError(
            `${err.response.status}: ${
              err.response.data?.error?.message || err.message
            }`
          )
        } else {
          setError(err instanceof Error ? err.message : 'Unknown error')
        }
        setLoading(false)
      }
    }

    fetchAllRecentlyPlayed()
  }, [token, tokenLoading, tokenError, oneMonthAgo])

  const {
    hourlyActivity,
    weekdayActivity,
    totalTracks,
    totalTimeMs,
    uniqueArtists,
  } = useMemo(() => {
    if (history.length === 0) {
      return {
        hourlyActivity: Array(24)
          .fill(0)
          .map((_, i) => ({ hour: i, count: 0, percentage: 0 })),
        weekdayActivity: Array(7)
          .fill(0)
          .map((_, i) => ({
            day: i,
            name: weekdayNames[i],
            count: 0,
            percentage: 0,
          })),
        totalTracks: 0,
        totalTimeMs: 0,
        uniqueArtists: 0,
      }
    }

    const hourlyData: number[] = Array(24).fill(0)
    const weekdayData: number[] = Array(7).fill(0)

    // Conta as músicas por hora e dia da semana
    history.forEach((item) => {
      const date = new Date(item.played_at)
      const hour = date.getHours()
      const day = date.getDay()

      hourlyData[hour]++
      weekdayData[day]++
    })

    const totalTracks = history.length

    const hourlyActivity: HourlyActivity[] = hourlyData.map((count, hour) => ({
      hour,
      count,
      percentage: totalTracks ? (count / totalTracks) * 100 : 0,
    }))

    const weekdayActivity: WeekdayActivity[] = weekdayData.map(
      (count, day) => ({
        day,
        name: weekdayNames[day],
        count,
        percentage: totalTracks ? (count / totalTracks) * 100 : 0,
      })
    )

    // Calcula o tempo total de escuta
    const totalTimeMs = history.reduce((acc, item) => {
      return acc + item.track.duration_ms
    }, 0)

    // Conta artistas únicos
    const artistSet = new Set()
    history.forEach((item) => {
      item.track.artists.forEach((artist) => {
        artistSet.add(artist.id)
      })
    })
    const uniqueArtists = artistSet.size

    return {
      hourlyActivity,
      weekdayActivity,
      totalTracks,
      totalTimeMs,
      uniqueArtists,
    }
  }, [history, weekdayNames])

  return {
    hourlyActivity,
    weekdayActivity,
    totalTracks,
    totalTimeMs,
    uniqueArtists,
    loading,
    error,
  }
}
