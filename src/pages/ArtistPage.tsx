import { useParams } from 'react-router'
import { useSpotifyArtist } from '@/hooks/useSpotifyArtist'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Users, Music, ExternalLink } from 'lucide-react'
import { motion } from 'motion/react'
import { Link } from 'react-router'

export default function ArtistPage() {
  const { id } = useParams()
  const { data, loading, error } = useSpotifyArtist(id!)

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-b4">Carregando artista...</span>
      </div>
    )
  if (error || !data?.artist)
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        Erro ao carregar artista: {error || 'Não encontrado'}
      </div>
    )

  const { artist, albums, topTracks } = data

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto w-full"
    >
      <Card className="bg-b1 border-b3/30 text-white mb-6 shadow-xl">
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          {artist.images?.[0]?.url && (
            <img
              src={artist.images[0].url}
              alt={artist.name}
              className="w-24 h-24 rounded-full object-cover shadow"
            />
          )}
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl font-bold text-white">
              {artist.name}
            </CardTitle>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="flex items-center gap-1 text-b4 text-sm">
                <Users className="w-4 h-4 text-sprimary" />
                {artist.followers.total.toLocaleString()} seguidores
              </span>
              {artist.genres?.length > 0 && (
                <span className="bg-b3/30 text-xs px-2 py-1 rounded text-b4">
                  {artist.genres.slice(0, 2).join(', ')}
                </span>
              )}
              <Link
                to={artist.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-sprimary flex items-center gap-1 hover:underline text-xs"
              >
                <ExternalLink className="w-4 h-4" /> Spotify
              </Link>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-b1 border-b3/30 text-white shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="w-5 h-5" />
              Top Tracks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-b3/20 max-h-72 overflow-y-auto pr-2">
              {topTracks?.map((track: any, idx: number) => (
                <li
                  key={track.id}
                  className="flex items-center gap-3 py-2 hover:bg-b3/10 rounded transition-colors"
                >
                  <span className="text-b4 text-xs w-6 text-right">
                    {idx + 1}
                  </span>
                  {track.album?.images?.[0]?.url && (
                    <img
                      src={track.album.images[0].url}
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
          </CardContent>
        </Card>

        <Card className="bg-b1 border-b3/30 text-white shadow">
          <CardHeader>
            <CardTitle>Álbuns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 max-h-72 overflow-y-auto pr-2">
              {albums?.map((album: any) => (
                <Link
                  key={album.id}
                  to={`/album/${album.id}`}
                  className="flex flex-col items-center bg-b3/10 rounded-lg p-2 hover:bg-b3/20 transition-colors group"
                  style={{ textDecoration: 'none' }}
                >
                  {album.images?.[0]?.url && (
                    <img
                      src={album.images[0].url}
                      alt={album.name}
                      className="w-20 h-20 rounded object-cover mb-2 shadow group-hover:scale-105 transition-transform"
                    />
                  )}
                  <span className="text-center text-sm font-medium text-white truncate w-24 group-hover:underline">
                    {album.name}
                  </span>
                  <span className="text-xs text-b4/70 mt-1">
                    {album.release_date}
                  </span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
