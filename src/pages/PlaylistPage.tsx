import { Link, useParams } from 'react-router'
import { useSpotifyPlaylist } from '@/hooks/useSpotifyPlaylist'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { motion } from 'motion/react'

export default function PlaylistPage() {
  const { id } = useParams()
  const { data, loading, error } = useSpotifyPlaylist(id!)

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-b4">Carregando playlist...</span>
      </div>
    )
  if (error || !data)
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        Erro ao carregar playlist: {error || 'Não encontrada'}
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
            <div className="text-b4 mt-1">{data.owner?.display_name}</div>
            <div className="text-xs text-b4/70 mt-1">
              {data.tracks.total} músicas
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <span className="text-b4 font-medium">Faixas</span>
            <ul className="divide-y divide-b3/20 mt-2">
              {data.tracks.items.map((item: any, idx: number) => (
                <li
                  key={item.track.id}
                  className="flex items-center gap-3 py-2 hover:bg-b3/10 rounded transition-colors"
                >
                  <span className="text-b4 text-xs w-6 text-right">
                    {idx + 1}
                  </span>
                  {item.track.album?.images?.[0]?.url && (
                    <img
                      src={item.track.album.images[0].url}
                      alt={item.track.name}
                      className="w-10 h-10 rounded object-cover shadow"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/track/${item.track.id}`}
                      className="truncate text-white hover:underline block"
                    >
                      {item.track.name}
                    </Link>
                    <div className="text-xs text-b4/70 truncate">
                      {item.track.artists.map((artist: any, i: number) => (
                        <span key={artist.id}>
                          <Link
                            to={`/artist/${artist.id}`}
                            className="hover:underline"
                          >
                            {artist.name}
                          </Link>
                          {i < item.track.artists.length - 1 && ', '}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-b4/70">
                    {(item.track.duration_ms / 1000 / 60).toFixed(2)} min
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
