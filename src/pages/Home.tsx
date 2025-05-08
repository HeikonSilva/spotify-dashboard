import { useSpotifyRecentlyPlayed } from '../hooks/useSpotifyRecentlyPlayed'
import { useMemo } from 'react'

export default function Home() {
  // Fetch recently played tracks with a limit of 50
  const { data, loading, error } = useSpotifyRecentlyPlayed({
    limit: 50,
    after: 0, // Start from the beginning
  })

  // Process data to get statistics
  const stats = useMemo(() => {
    if (!data || !data.items || !data.items.length) {
      return { totalTracks: 0, totalTimeMs: 0, uniqueArtists: 0 }
    }

    // Total number of tracks
    const totalTracks = data.items.length

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

    return { totalTracks, totalTimeMs, uniqueArtists }
  }, [data])

  // Format milliseconds to hours and minutes
  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60))
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  if (loading) {
    return <div className="text-white">Carregando dados do Spotify...</div>
  }

  if (error) {
    return <div className="text-white">Erro ao carregar dados: {error}</div>
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-row gap-2">
        <div className="w-full border-1 text-white bg-b1 p-4 rounded">
          <h1 className="font-bold">Músicas ouvidas em um mês</h1>
          <p className="text-4xl font-bold">{stats.totalTracks}</p>
        </div>
        <div className="w-full border-1 text-white bg-b1 p-4 rounded">
          <h1 className="font-bold">Tempo escutado aproximadamente</h1>
          <p className="text-4xl font-bold">{formatTime(stats.totalTimeMs)}</p>
        </div>
        <div className="w-full border-1 text-white bg-b1 p-4 rounded">
          <h1 className="font-bold">Artistas escutados</h1>
          <p className="text-4xl font-bold">{stats.uniqueArtists}</p>
        </div>
      </div>
    </div>
  )
}
