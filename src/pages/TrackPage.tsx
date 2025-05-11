import { useParams } from 'react-router'
import { useSpotifyTrack } from '@/hooks/useSpotifyTrack'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Music } from 'lucide-react'
import { motion } from 'motion/react'

export default function TrackPage() {
  const { id } = useParams()
  const {
    data: track,
    loading: trackLoading,
    error: trackError,
  } = useSpotifyTrack(id!)

  if (trackLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-b4">Carregando música...</span>
      </div>
    )
  if (trackError || !track)
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        Erro ao carregar música: {trackError || 'Não encontrada'}
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
          {track.album.images?.[0]?.url && (
            <img
              src={track.album.images[0].url}
              alt={track.name}
              className="w-20 h-20 rounded object-cover shadow"
            />
          )}
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl font-bold text-white">
              <Music className="w-5 h-5 text-sprimary" />
              {track.name}
            </CardTitle>
            <div className="text-b4 mt-1">
              {track.artists.map((artist: any, idx: number) => (
                <a
                  key={artist.id}
                  href={`/artist/${artist.id}`}
                  className="hover:underline"
                  style={{
                    marginRight: idx < track.artists.length - 1 ? 4 : 0,
                  }}
                >
                  {artist.name}
                  {idx < track.artists.length - 1 && <span>, </span>}
                </a>
              ))}
            </div>
            <div className="text-xs text-b4/70 mt-1">
              <a href={`/album/${track.album.id}`} className="hover:underline">
                {track.album.name}
              </a>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-6 mt-2">
            <div>
              <span className="text-b4 font-medium">Duração: </span>
              <span className="text-white">
                {(track.duration_ms / 1000 / 60).toFixed(2)} min
              </span>
            </div>
            <div>
              <span className="text-b4 font-medium">Popularidade: </span>
              <span className="text-white">{track.popularity}</span>
            </div>
            <div>
              <span className="text-b4 font-medium">Lançamento: </span>
              <span className="text-white">{track.album.release_date}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
