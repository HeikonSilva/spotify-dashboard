import { useMemo } from 'react'
import { useSpotifyRecentlyPlayed } from './useSpotifyRecentlyPlayed'

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

export function useListeningActivity() {
  const oneMonthAgo = useMemo(() => {
    const date = new Date()
    date.setMonth(date.getMonth() - 1)
    return date.getTime()
  }, [])

  const { data, loading, error } = useSpotifyRecentlyPlayed({
    limit: 50,
    after: oneMonthAgo,
  })

  const weekdayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  const {
    hourlyActivity,
    weekdayActivity,
    totalTracks,
    totalTimeMs,
    uniqueArtists,
  } = useMemo(() => {
    if (!data || !data.items || !data.items.length) {
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

    // Initialize hourly data
    const hourlyData: number[] = Array(24).fill(0)

    // Initialize weekday data
    const weekdayData: number[] = Array(7).fill(0)

    // Process all tracks
    data.items.forEach((item) => {
      const date = new Date(item.played_at)
      const hour = date.getHours()
      const day = date.getDay()

      hourlyData[hour]++
      weekdayData[day]++
    })

    // Total tracks
    const totalTracks = data.items.length

    // Calculate percentage for each hour
    const hourlyActivity: HourlyActivity[] = hourlyData.map((count, hour) => ({
      hour,
      count,
      percentage: (count / totalTracks) * 100,
    }))

    // Calculate percentage for each weekday
    const weekdayActivity: WeekdayActivity[] = weekdayData.map(
      (count, day) => ({
        day,
        name: weekdayNames[day],
        count,
        percentage: (count / totalTracks) * 100,
      })
    )

    // Calculate total listening time
    const totalTimeMs = data.items.reduce((acc, item) => {
      return acc + item.track.duration_ms
    }, 0)

    // Count unique artists
    const artistSet = new Set()
    data.items.forEach((item) => {
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
  }, [data, weekdayNames])

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
