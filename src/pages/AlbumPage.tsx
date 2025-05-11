import { useParams } from 'react-router'
import { useSpotifyAlbum } from '@/hooks/useSpotifyAlbum'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Link } from 'react-router'
import { motion } from 'motion/react'

export default function AlbumPage() {
  const { id } = useParams()
  const { data, loading, error } = useSpotifyAlbum(id!)

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-b4">Carregando álbum...</span>
      </div>
    )
  if (error || !data)
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        Erro ao carregar álbum: {error || 'Não encontrado'}
      </div>
    )

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto w-full"
    >
      <Card className="bg-b1 border-b3/30 text-white mb-6 shadow-xl">
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          {data.images?.[0]?.url && (
            <img
              src={data.images[0].url}
              alt={data.name}
              className="w-24 h-24 rounded-lg object-cover shadow"
            />
          )}
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl font-bold text-white">
              {data.name}
            </CardTitle>
            <div className="text-b4 mt-1">
              {data.artists.map((artist: any, idx: number) => (
                <Link
                  key={artist.id}
                  to={`/artist/${artist.id}`}
                  className="hover:underline"
                  style={{ marginRight: idx < data.artists.length - 1 ? 4 : 0 }}
                >
                  {artist.name}
                  {idx < data.artists.length - 1 && <span>, </span>}
                </Link>
              ))}
            </div>
            <div className="text-xs text-b4/70 mt-1">
              {data.release_date} • {data.total_tracks} músicas
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <span className="text-b4 font-medium">Faixas</span>
            <ul className="divide-y divide-b3/20 mt-2">
              {data.tracks.items.map((track: any, idx: number) => (
                <li
                  key={track.id}
                  className="flex items-center gap-3 py-2 hover:bg-b3/10 rounded transition-colors"
                >
                  <span className="text-b4 text-xs w-6 text-right">
                    {idx + 1}
                  </span>
                  {data.images?.[0]?.url && (
                    <img
                      src={data.images[0].url}
                      alt={track.name}
                      className="w-10 h-10 rounded object-cover shadow"
                    />
                  )}
                  <Link
                    to={`/track/${track.id}`}
                    className="flex-1 truncate text-white hover:underline"
                  >
                    {track.name}
                  </Link>
                  <span className="text-xs text-b4/70">
                    {(track.duration_ms / 1000 / 60).toFixed(2)} min
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
