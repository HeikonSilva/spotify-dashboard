import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  InfoIcon,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Repeat,
  Shuffle,
  Volume2,
  VolumeX,
  ListMusic,
  RefreshCw,
  AlertTriangle,
  Eye,
  MousePointerClick,
} from 'lucide-react'
import { useSpotifyPlayer } from '@/hooks/useSpotifyPlayer'
import { useSpotifyMe } from '@/hooks/useSpotifyMe'
import { motion, AnimatePresence } from 'motion/react'

export default function Player() {
  const {
    player,
    devices,
    loading,
    error,
    play,
    pause,
    next,
    previous,
    setRepeat,
    setVolume,
    setShuffle,
    addToQueue,
    refresh,
    refreshDevices,
  } = useSpotifyPlayer()

  const {
    data: profile,
    loading: profileLoading,
    error: profileError,
  } = useSpotifyMe()
  const [volume, setVolumeState] = useState(
    player?.device?.volume_percent ?? 50
  )
  const [queueUri, setQueueUri] = useState('')
  const [showModal, setShowModal] = useState(false)

  // Determina o modo de operação
  const isViewMode = profile && profile.product === 'free'
  // Agora, controles de player são desabilitados, mas refresh é sempre permitido
  const controlsDisabled = isViewMode

  // Volume slider handler
  const handleVolumeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (controlsDisabled) return setShowModal(true)
    const value = Number(e.target.value)
    setVolumeState(value)
    await setVolume(value)
  }

  // Add to queue handler
  const handleAddToQueue = async () => {
    if (controlsDisabled) return setShowModal(true)
    if (queueUri) {
      await addToQueue(queueUri)
      setQueueUri('')
    }
  }

  // Repeat toggle handler
  const handleRepeat = async () => {
    if (controlsDisabled) return setShowModal(true)
    if (!player) return
    const next =
      player.repeat_state === 'off'
        ? 'context'
        : player.repeat_state === 'context'
        ? 'track'
        : 'off'
    await setRepeat(next as 'off' | 'context' | 'track')
  }

  // Shuffle toggle handler
  const handleShuffle = async () => {
    if (controlsDisabled) return setShowModal(true)
    if (!player) return
    await setShuffle(!player.shuffle_state)
  }

  // Play/Pause handler
  const handlePlayPause = async () => {
    if (controlsDisabled) return setShowModal(true)
    if (!player) return
    if (player.is_playing) {
      await pause()
    } else {
      await play()
    }
  }

  // Device switch handler
  const handleDeviceChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (controlsDisabled) return setShowModal(true)
    const deviceId = e.target.value
    await play({ device_id: deviceId })
    refresh()
  }

  // Handler para refresh
  // Remova o bloqueio do modo visualização para o refresh
  const handleRefresh = () => {
    refresh()
    refreshDevices()
  }

  if (profileLoading) {
    return (
      <div className="max-w-xl mx-auto w-full">
        <Card className="bg-b1 text-white border-b3/30">
          <CardHeader>
            <CardTitle>Player Spotify</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4 py-8">
              <Skeleton className="w-32 h-32 rounded" />
              <Skeleton className="h-6 w-40 rounded" />
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-4 w-32 rounded" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (profileError) {
    return (
      <div className="max-w-xl mx-auto w-full">
        <Card className="bg-b1 text-white border-b3/30">
          <CardHeader>
            <CardTitle>Player Spotify</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <InfoIcon className="h-10 w-10 text-b4 mb-2" />
              <p className="text-b4">Erro ao carregar perfil: {profileError}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto w-full">
      <Card className="bg-b1 text-white border-b3/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Player Spotify</CardTitle>
            <div className="flex items-center gap-2">
              <span
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${
                  isViewMode
                    ? 'bg-yellow-400 text-black'
                    : 'bg-sprimary text-black'
                }`}
                title={
                  isViewMode
                    ? 'Modo Visualização: Apenas leitura'
                    : 'Modo Operação: Controle total'
                }
              >
                {isViewMode ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <MousePointerClick className="w-4 h-4" />
                )}
                {isViewMode ? 'Visualização' : 'Operação'}
              </span>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleRefresh}
                title="Atualizar"
                // Sempre habilitado, mesmo em modo visualização
                disabled={false}
              >
                <RefreshCw className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col items-center gap-4 py-8">
              <Skeleton className="w-32 h-32 rounded" />
              <Skeleton className="h-6 w-40 rounded" />
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-4 w-32 rounded" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <InfoIcon className="h-10 w-10 text-b4 mb-2" />
              <p className="text-b4">Erro ao carregar player: {error}</p>
            </div>
          ) : !player ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <InfoIcon className="h-10 w-10 text-b4 mb-2" />
              <p className="text-b4">Nenhuma música tocando no momento.</p>
              <p className="text-sm text-b4/70 mt-1">
                Inicie uma música no Spotify para controlar por aqui.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {/* Track info */}
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded bg-b3/30 overflow-hidden flex-shrink-0">
                  {player.item?.album?.images?.[0]?.url ? (
                    <img
                      src={player.item.album.images[0].url}
                      alt={player.item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-b4">
                      <ListMusic className="w-10 h-10" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold truncate">
                    {player.item?.name || 'Desconhecido'}
                  </h2>
                  <p className="text-b4 truncate">
                    {player.item?.artists?.map((a: any) => a.name).join(', ') ||
                      'Artista desconhecido'}
                  </p>
                  <p className="text-b4 text-sm truncate">
                    {player.item?.album?.name}
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleShuffle}
                  aria-label="Shuffle"
                  className={player.shuffle_state ? 'text-sprimary' : ''}
                  disabled={controlsDisabled}
                >
                  <Shuffle className="w-5 h-5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={previous}
                  aria-label="Anterior"
                  disabled={controlsDisabled}
                >
                  <SkipBack className="w-6 h-6" />
                </Button>
                <Button
                  size="icon"
                  variant="default"
                  onClick={handlePlayPause}
                  aria-label={player.is_playing ? 'Pausar' : 'Tocar'}
                  className="bg-sprimary text-black hover:bg-sprimary/90"
                  disabled={controlsDisabled}
                >
                  {player.is_playing ? (
                    <Pause className="w-7 h-7" />
                  ) : (
                    <Play className="w-7 h-7" />
                  )}
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={next}
                  aria-label="Próxima"
                  disabled={controlsDisabled}
                >
                  <SkipForward className="w-6 h-6" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleRepeat}
                  aria-label="Repeat"
                  className={
                    player.repeat_state !== 'off' ? 'text-sprimary' : ''
                  }
                  disabled={controlsDisabled}
                >
                  <Repeat className="w-5 h-5" />
                </Button>
              </div>

              {/* Volume */}
              <div className="flex items-center gap-3">
                <VolumeX className="w-5 h-5 text-b4" />
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-full accent-sprimary"
                  disabled={controlsDisabled}
                />
                <Volume2 className="w-5 h-5 text-b4" />
                <span className="text-b4 text-xs w-8 text-right">
                  {volume}%
                </span>
              </div>

              {/* Devices */}
              <div className="flex items-center gap-2">
                <span className="text-b4 text-xs">Dispositivo:</span>
                <select
                  className="bg-b2 border border-b3/30 rounded px-2 py-1 text-b4 text-xs"
                  value={player.device?.id}
                  onChange={handleDeviceChange}
                  disabled={controlsDisabled}
                >
                  {devices.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} {d.is_active ? '(Ativo)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Add to queue */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="URI da música para adicionar à fila"
                  value={queueUri}
                  onChange={
                    controlsDisabled
                      ? () => setShowModal(true)
                      : (e) => setQueueUri(e.target.value)
                  }
                  className="flex-1 bg-b2 border border-b3/30 rounded px-2 py-1 text-b4 text-xs"
                  disabled={controlsDisabled}
                />
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleAddToQueue}
                  disabled={!queueUri || controlsDisabled}
                >
                  Adicionar à fila
                </Button>
              </div>
            </div>
          )}
          {/* Modal de aviso para modo visualização */}
          <AnimatePresence>
            {showModal && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
                onClick={() => setShowModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.95 }}
                  className="bg-b2 rounded-lg p-6 max-w-xs w-full text-center shadow-lg border border-b3/30"
                  onClick={(e) => e.stopPropagation()}
                >
                  <AlertTriangle className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold mb-2 text-yellow-300">
                    Modo Visualização
                  </h3>
                  <p className="text-b4 mb-4">
                    Esta conta está em modo de visualização. Para controlar o
                    player, é necessário ter uma conta Premium.
                  </p>
                  <Button
                    className="w-full bg-sprimary text-black font-medium"
                    onClick={() => setShowModal(false)}
                  >
                    Entendi
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  )
}
