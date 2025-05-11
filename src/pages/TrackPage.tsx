import { useParams } from 'react-router'
import { useSpotifyTrack } from '@/hooks/useSpotifyTrack'
import { useSpotifyPlayer } from '@/hooks/useSpotifyPlayer'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Music, Play } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { usePremium } from '@/contexts/PremiumContext'

export default function TrackPage() {
  const { id } = useParams()
  const {
    data: track,
    loading: trackLoading,
    error: trackError,
  } = useSpotifyTrack(id!)
  const { play, loading: playerLoading } = useSpotifyPlayer()
  const { isPremium } = usePremium()
  const [showModal, setShowModal] = useState(false)

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

  const handlePlay = () => {
    if (isPremium) {
      play({ uris: [track.uri] })
    } else {
      setShowModal(true)
    }
  }

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
          <div className="flex items-center gap-2">
            <CardTitle className="flex items-center gap-2 text-2xl font-bold text-white">
              <Music className="w-5 h-5 text-sprimary" />
              {track.name}
              <motion.button
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-sprimary text-white shadow hover:bg-sprimary/80 transition disabled:opacity-60 focus:outline-none ml-2"
                disabled={playerLoading}
                onClick={handlePlay}
                aria-label="Tocar música"
              >
                <Play className="w-5 h-5" />
              </motion.button>
            </CardTitle>
          </div>
          {/* Custom Modal */}
          {showModal && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="bg-b1 border border-b3/30 rounded-xl p-8 max-w-md w-full shadow-xl flex flex-col items-center gap-6"
              >
                <div className="bg-b2 p-4 rounded-full">
                  <Music className="h-8 w-8 text-sprimary" />
                </div>
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold">
                    Spotify Premium necessário
                  </h2>
                  <p className="text-b4">
                    Para tocar músicas diretamente pelo player, é necessário ter
                    uma conta Spotify Premium.
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap w-full">
                  <Button
                    onClick={() => setShowModal(false)}
                    className="w-full bg-b2 hover:bg-b3 text-white"
                  >
                    Fechar
                  </Button>
                  <Button
                    asChild
                    variant="secondary"
                    className="w-full bg-sprimary hover:bg-sprimary/90 text-black font-medium"
                  >
                    <a
                      href="https://www.spotify.com/premium/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Saiba mais
                    </a>
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
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
