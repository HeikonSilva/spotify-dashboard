import { useEffect, useState } from 'react'

type Track = {
  id: string
  name: string
  artists: { name: string }[]
  album: { images: { url: string }[] }
}

export default function Home() {
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) return

    fetch('https://api.spotify.com/v1/me/tracks?market=BR&limit=10&offset=5', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setTracks(data.items || [])
        setLoading(false)
      })
  }, [])

  if (loading) return <div>Carregando...</div>

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Suas músicas mais ouvidas</h2>
      <ul>
        {tracks.map((track) => (
          <li key={track.id} className="mb-4 flex items-center gap-4">
            <img
              src={track.album.images[0]?.url}
              alt={track.name}
              className="w-12 h-12 rounded"
            />
            <div>
              <div className="font-semibold">{track.name}</div>
              <div className="text-sm text-gray-500">
                {track.artists.map((a) => a.name).join(', ')}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
